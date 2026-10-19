package com.enako.moneyflow.modules.payment.application;

import com.enako.moneyflow.modules.payment.application.PaymentProviderGateway.Provider;
import com.enako.moneyflow.modules.platform.domain.MoneyEnvironment;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PaymentCollectionService {
    private static final Pattern PHONE = Pattern.compile("^\\+[1-9][0-9]{7,14}$");
    private final NamedParameterJdbcTemplate jdbc;
    private final PaymentApiKeyService keys;
    private final PaymentProviderRouter providers;
    private final ObjectMapper objectMapper;
    private final long pilotMinimum;
    private final long pilotMaximum;
    private final long pilotDailyMaximum;

    public PaymentCollectionService(NamedParameterJdbcTemplate jdbc, PaymentApiKeyService keys,
        PaymentProviderRouter providers, ObjectMapper objectMapper,
        @Value("${app.payments.pilot.minimum-xaf:1}") long pilotMinimum,
        @Value("${app.payments.pilot.maximum-xaf:1000}") long pilotMaximum,
        @Value("${app.payments.pilot.daily-maximum-xaf:5000}") long pilotDailyMaximum) {
        this.jdbc = jdbc; this.keys = keys; this.providers = providers; this.objectMapper = objectMapper;
        this.pilotMinimum = pilotMinimum; this.pilotMaximum = pilotMaximum; this.pilotDailyMaximum = pilotDailyMaximum;
    }

    public PaymentView create(String secret, String idempotencyKey, CreatePayment command) {
        var principal = keys.authenticate(secret);
        validate(principal.customerId(), principal.environment(), idempotencyKey, command);
        var existing = findByIdempotency(principal.customerId(), principal.environment(), idempotencyKey);
        if (existing != null) {
            if (existing.amountMinor() != command.amount() || !existing.provider().equals(command.provider().name().toLowerCase())
                || !existing.merchantReference().equals(command.merchantReference())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Idempotency key was already used for another payment");
            }
            return existing;
        }
        PaymentProviderGateway gateway = providers.gateway(command.provider());
        UUID walletId = walletId(principal.customerId(), principal.environment());
        UUID paymentId = UUID.randomUUID();
        OffsetDateTime expiresAt = OffsetDateTime.now().plusMinutes(10);
        jdbc.update("""
            INSERT INTO payment_intents (id, customer_id, wallet_id, environment, provider, status, amount_minor,
                currency, payer_phone_e164, merchant_reference, idempotency_key, description, metadata_json, expires_at)
            VALUES (:id, :customerId, :walletId, CAST(:environment AS money_environment), CAST(:provider AS payment_provider),
                'created', :amount, 'XAF', :phone, :merchantReference, :idempotencyKey, :description, CAST(:metadata AS jsonb), :expiresAt)
            """, params(principal.customerId(), principal.environment(), command, idempotencyKey)
                .addValue("id", paymentId).addValue("walletId", walletId).addValue("expiresAt", expiresAt));
        try {
            var result = gateway.initiate(new PaymentProviderGateway.InitiationCommand(paymentId, command.amount(), "XAF",
                command.payerPhone(), command.merchantReference(), command.description()));
            jdbc.update("""
                UPDATE payment_intents SET provider_reference = :providerReference,
                    status = CAST(:status AS payment_intent_status), updated_at = CURRENT_TIMESTAMP WHERE id = :id
                """, new MapSqlParameterSource().addValue("providerReference", result.providerReference())
                .addValue("status", normalizeInitiationStatus(result.status())).addValue("id", paymentId));
        } catch (RuntimeException exception) {
            jdbc.update("""
                UPDATE payment_intents SET status = 'processing', failure_code = 'PROVIDER_INITIATION_UNCERTAIN',
                    failure_message = :message, updated_at = CURRENT_TIMESTAMP WHERE id = :id
                """, new MapSqlParameterSource().addValue("id", paymentId)
                .addValue("message", safeMessage(exception)));
            throw exception;
        }
        return getForCustomer(principal.customerId(), principal.environment(), paymentId);
    }

    public PaymentView get(String secret, UUID paymentId) {
        var principal = keys.authenticate(secret);
        return getForCustomer(principal.customerId(), principal.environment(), paymentId);
    }

    public PaymentView reconcileProviderCallback(Provider provider, UUID paymentId) {
        PaymentView payment = getByProviderAndId(provider, paymentId);
        if ("completed".equals(payment.status()) || "failed".equals(payment.status()) || "expired".equals(payment.status())) return payment;
        if (payment.providerReference() == null || payment.providerReference().isBlank())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment has no provider reference");
        var authoritative = providers.gateway(provider).status(payment.providerReference());
        String providerStatus = authoritative.status().toUpperCase(java.util.Locale.ROOT);
        if ("SUCCESSFUL".equals(providerStatus) || "COMPLETED".equals(providerStatus)) {
            completeFromVerifiedProvider(provider, payment.providerReference());
        } else if ("FAILED".equals(providerStatus) || "REJECTED".equals(providerStatus)) {
            jdbc.update("""
                UPDATE payment_intents SET status = 'failed', failure_code = 'PROVIDER_FAILED',
                    failure_message = :reason, updated_at = CURRENT_TIMESTAMP WHERE id = :id AND status <> 'completed'
                """, new MapSqlParameterSource().addValue("id", paymentId)
                .addValue("reason", authoritative.reason() == null ? providerStatus : authoritative.reason()));
        } else {
            jdbc.update("UPDATE payment_intents SET status = 'processing', updated_at = CURRENT_TIMESTAMP WHERE id = :id AND status NOT IN ('completed','failed')",
                new MapSqlParameterSource("id", paymentId));
        }
        return getByProviderAndId(provider, paymentId);
    }

    @Transactional
    public void completeFromVerifiedProvider(Provider provider, String providerReference) {
        var rows = jdbc.query("""
            SELECT id, customer_id, wallet_id, environment::text, amount_minor, currency, merchant_reference
            FROM payment_intents WHERE provider = CAST(:provider AS payment_provider) AND provider_reference = :reference
            FOR UPDATE
            """, new MapSqlParameterSource().addValue("provider", provider.name().toLowerCase()).addValue("reference", providerReference),
            (rs, row) -> new CompletionTarget(rs.getObject("id", UUID.class), rs.getObject("customer_id", UUID.class),
                rs.getObject("wallet_id", UUID.class), MoneyEnvironment.parse(rs.getString("environment")),
                rs.getLong("amount_minor"), rs.getString("currency"), rs.getString("merchant_reference")));
        if (rows.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment was not found");
        CompletionTarget target = rows.getFirst();
        Integer alreadyComplete = jdbc.queryForObject("SELECT COUNT(*) FROM payment_intents WHERE id = :id AND status = 'completed'",
            new MapSqlParameterSource("id", target.id()), Integer.class);
        if (alreadyComplete != null && alreadyComplete > 0) return;
        UUID movementId = UUID.randomUUID();
        jdbc.update("""
            INSERT INTO money_movements (id, customer_id, wallet_id, environment, direction, movement_type, status,
                amount_minor, currency, external_reference, idempotency_key, description, completed_at)
            VALUES (:id, :customerId, :walletId, CAST(:environment AS money_environment), 'credit', 'deposit', 'completed',
                :amount, :currency, :reference, :idempotency, 'Mobile-money collection', CURRENT_TIMESTAMP)
            """, new MapSqlParameterSource().addValue("id", movementId).addValue("customerId", target.customerId())
            .addValue("walletId", target.walletId()).addValue("environment", target.environment().value())
            .addValue("amount", target.amountMinor()).addValue("currency", target.currency())
            .addValue("reference", providerReference).addValue("idempotency", "payment:" + target.id()));
        boolean pilot = target.environment() == MoneyEnvironment.PILOT_LIVE;
        jdbc.update("""
            UPDATE wallets SET balance_minor = balance_minor + :amount,
                held_minor = held_minor + CASE WHEN :pilot THEN :amount ELSE 0 END, updated_at = CURRENT_TIMESTAMP
            WHERE id = :walletId
            """, new MapSqlParameterSource().addValue("amount", target.amountMinor()).addValue("pilot", pilot)
            .addValue("walletId", target.walletId()));
        Long balance = jdbc.queryForObject("SELECT balance_minor FROM wallets WHERE id = :walletId",
            new MapSqlParameterSource("walletId", target.walletId()), Long.class);
        jdbc.update("""
            INSERT INTO ledger_entries (customer_id, wallet_id, movement_id, environment, direction, amount_minor, balance_after_minor, currency)
            VALUES (:customerId, :walletId, :movementId, CAST(:environment AS money_environment), 'credit', :amount, :balance, :currency)
            """, new MapSqlParameterSource().addValue("customerId", target.customerId()).addValue("walletId", target.walletId())
            .addValue("movementId", movementId).addValue("environment", target.environment().value())
            .addValue("amount", target.amountMinor()).addValue("balance", balance).addValue("currency", target.currency()));
        jdbc.update("UPDATE payment_intents SET status = 'completed', movement_id = :movementId, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = :id",
            new MapSqlParameterSource().addValue("movementId", movementId).addValue("id", target.id()));
        createWebhookEvent(target, providerReference);
    }

    private void validate(UUID customerId, MoneyEnvironment environment, String idempotencyKey, CreatePayment command) {
        if (idempotencyKey == null || idempotencyKey.isBlank() || idempotencyKey.length() > 160)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid Idempotency-Key is required");
        if (command.currency() == null || !command.currency().equals("XAF"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only XAF is currently supported");
        if (command.amount() < 1) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be positive");
        if (command.payerPhone() == null || !PHONE.matcher(command.payerPhone()).matches())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payer phone must use E.164 format");
        if (command.merchantReference() == null || command.merchantReference().isBlank() || command.merchantReference().length() > 160)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A merchant reference is required");
        if (environment == MoneyEnvironment.PILOT_LIVE) {
            if (command.amount() < pilotMinimum || command.amount() > pilotMaximum)
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Pilot payments must be between " + pilotMinimum + " and " + pilotMaximum + " XAF");
            assertPilotDailyLimit(customerId, environment, command.amount());
        }
    }

    private void assertPilotDailyLimit(UUID customerId, MoneyEnvironment environment, long amount) {
        if (environment != MoneyEnvironment.PILOT_LIVE) return;
        Long used = jdbc.queryForObject("""
            SELECT COALESCE(SUM(amount_minor), 0) FROM payment_intents
            WHERE customer_id = :customerId AND environment = 'pilot_live'
              AND created_at >= CURRENT_DATE AND status NOT IN ('failed', 'cancelled', 'expired')
            """, new MapSqlParameterSource("customerId", customerId), Long.class);
        if ((used == null ? 0 : used) + amount > pilotDailyMaximum)
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Pilot daily collection limit exceeded");
    }

    private UUID walletId(UUID customerId, MoneyEnvironment environment) {
        var ids = jdbc.query("SELECT id FROM wallets WHERE customer_id = :customerId AND environment = CAST(:environment AS money_environment) AND currency = 'XAF' AND status = 'active'",
            new MapSqlParameterSource().addValue("customerId", customerId).addValue("environment", environment.value()),
            (rs, row) -> rs.getObject("id", UUID.class));
        if (ids.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No wallet exists for this API environment");
        return ids.getFirst();
    }

    private PaymentView findByIdempotency(UUID customerId, MoneyEnvironment environment, String key) {
        var rows = queryPayment("p.customer_id = :customerId AND p.environment = CAST(:environment AS money_environment) AND p.idempotency_key = :key",
            new MapSqlParameterSource().addValue("customerId", customerId).addValue("environment", environment.value()).addValue("key", key));
        return rows.isEmpty() ? null : rows.getFirst();
    }

    private PaymentView getForCustomer(UUID customerId, MoneyEnvironment environment, UUID id) {
        var rows = queryPayment("p.id = :id AND p.customer_id = :customerId AND p.environment = CAST(:environment AS money_environment)",
            new MapSqlParameterSource().addValue("id", id).addValue("customerId", customerId).addValue("environment", environment.value()));
        if (rows.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment was not found");
        return rows.getFirst();
    }

    private PaymentView getByProviderAndId(Provider provider, UUID id) {
        var rows = queryPayment("p.id = :id AND p.provider = CAST(:provider AS payment_provider)",
            new MapSqlParameterSource().addValue("id", id).addValue("provider", provider.name().toLowerCase()));
        if (rows.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment was not found");
        return rows.getFirst();
    }

    private java.util.List<PaymentView> queryPayment(String where, MapSqlParameterSource params) {
        return jdbc.query("""
            SELECT p.id, p.environment::text, p.provider::text, p.status::text, p.amount_minor, p.currency,
                p.payer_phone_e164, p.merchant_reference, p.provider_reference, p.expires_at, p.created_at, p.completed_at
            FROM payment_intents p WHERE """ + " " + where, params, (rs, row) -> new PaymentView(
                rs.getObject("id", UUID.class), rs.getString("environment"), rs.getString("provider"), rs.getString("status"),
                rs.getLong("amount_minor"), rs.getString("currency"), rs.getString("payer_phone_e164"),
                rs.getString("merchant_reference"), rs.getString("provider_reference"),
                rs.getObject("expires_at", OffsetDateTime.class), rs.getObject("created_at", OffsetDateTime.class),
                rs.getObject("completed_at", OffsetDateTime.class)));
    }

    private MapSqlParameterSource params(UUID customerId, MoneyEnvironment environment, CreatePayment command, String key) {
        try {
            return new MapSqlParameterSource().addValue("customerId", customerId).addValue("environment", environment.value())
                .addValue("provider", command.provider().name().toLowerCase()).addValue("amount", command.amount())
                .addValue("phone", command.payerPhone()).addValue("merchantReference", command.merchantReference())
                .addValue("idempotencyKey", key).addValue("description", command.description())
                .addValue("metadata", objectMapper.writeValueAsString(command.metadata() == null ? Map.of() : command.metadata()));
        } catch (JsonProcessingException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment metadata is invalid");
        }
    }

    private void createWebhookEvent(CompletionTarget target, String providerReference) {
        UUID eventId = UUID.randomUUID();
        String payload;
        try {
            payload = objectMapper.writeValueAsString(Map.of("id", eventId, "type", "payment.completed",
                "data", Map.of("paymentId", target.id(), "merchantReference", target.merchantReference(),
                    "providerReference", providerReference, "amount", target.amountMinor(), "currency", target.currency(),
                    "environment", target.environment().value())));
        } catch (JsonProcessingException exception) { throw new IllegalStateException(exception); }
        jdbc.update("""
            INSERT INTO webhook_events (id, customer_id, environment, event_type, aggregate_id, payload_json)
            VALUES (:id, :customerId, CAST(:environment AS money_environment), 'payment.completed', :aggregateId, CAST(:payload AS jsonb))
            """, new MapSqlParameterSource().addValue("id", eventId).addValue("customerId", target.customerId())
            .addValue("environment", target.environment().value()).addValue("aggregateId", target.id()).addValue("payload", payload));
        jdbc.update("""
            INSERT INTO webhook_deliveries (event_id, endpoint_id, customer_id, environment)
            SELECT :eventId, w.id, :customerId, CAST(:environment AS money_environment) FROM webhook_endpoints w
            WHERE w.customer_id = :customerId AND w.environment = CAST(:environment AS money_environment) AND w.enabled
            """, new MapSqlParameterSource().addValue("eventId", eventId).addValue("customerId", target.customerId())
            .addValue("environment", target.environment().value()));
    }

    private String normalizeInitiationStatus(String status) {
        return "processing".equalsIgnoreCase(status) ? "processing" : "pending_customer";
    }
    private String safeMessage(RuntimeException exception) {
        String message = exception.getMessage();
        return message == null ? exception.getClass().getSimpleName() : message.substring(0, Math.min(500, message.length()));
    }

    private record CompletionTarget(UUID id, UUID customerId, UUID walletId, MoneyEnvironment environment,
        long amountMinor, String currency, String merchantReference) { }
    public record CreatePayment(long amount, String currency, Provider provider, String payerPhone,
        String merchantReference, String description, Map<String, Object> metadata) { }
    public record PaymentView(UUID id, String environment, String provider, String status, long amountMinor,
        String currency, String payerPhone, String merchantReference, String providerReference,
        OffsetDateTime expiresAt, OffsetDateTime createdAt, OffsetDateTime completedAt) { }
}
