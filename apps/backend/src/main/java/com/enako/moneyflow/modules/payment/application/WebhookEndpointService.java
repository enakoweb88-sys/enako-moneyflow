package com.enako.moneyflow.modules.payment.application;

import com.enako.moneyflow.infrastructure.security.WebhookSecretCipher;
import com.enako.moneyflow.modules.platform.domain.MoneyEnvironment;
import java.net.InetAddress;
import java.net.URI;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class WebhookEndpointService {
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final BCryptPasswordEncoder HASHER = new BCryptPasswordEncoder(12);
    private final NamedParameterJdbcTemplate jdbc;
    private final WebhookSecretCipher cipher;
    public WebhookEndpointService(NamedParameterJdbcTemplate jdbc, WebhookSecretCipher cipher) { this.jdbc = jdbc; this.cipher = cipher; }

    @Transactional
    public IssuedEndpoint create(UUID profileId, MoneyEnvironment environment, String endpointUrl) {
        URI uri = validatePublicHttps(endpointUrl);
        UUID customerId = customerId(profileId);
        byte[] bytes = new byte[32]; RANDOM.nextBytes(bytes);
        String secret = "whsec_" + Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        UUID id = UUID.randomUUID();
        jdbc.update("""
            INSERT INTO webhook_endpoints (id, customer_id, environment, endpoint_url, signing_secret_hash,
                signing_secret_encrypted, secret_prefix)
            VALUES (:id, :customerId, CAST(:environment AS money_environment), :url, :hash, :encrypted, :prefix)
            """, new MapSqlParameterSource().addValue("id", id).addValue("customerId", customerId)
            .addValue("environment", environment.value()).addValue("url", uri.toString())
            .addValue("hash", HASHER.encode(secret)).addValue("encrypted", cipher.encrypt(secret))
            .addValue("prefix", secret.substring(0, 14)));
        return new IssuedEndpoint(id, environment.value(), uri.toString(), secret.substring(0, 14), true, OffsetDateTime.now(), secret);
    }

    @Transactional(readOnly = true)
    public List<EndpointView> list(UUID profileId, MoneyEnvironment environment) {
        return jdbc.query("""
            SELECT w.id, w.environment::text, w.endpoint_url, w.secret_prefix, w.enabled, w.created_at
            FROM webhook_endpoints w JOIN customers c ON c.id = w.customer_id
            WHERE c.profile_id = :profileId AND w.environment = CAST(:environment AS money_environment)
            ORDER BY w.created_at DESC
            """, new MapSqlParameterSource().addValue("profileId", profileId).addValue("environment", environment.value()),
            (rs, row) -> new EndpointView(rs.getObject("id", UUID.class), rs.getString("environment"),
                rs.getString("endpoint_url"), rs.getString("secret_prefix"), rs.getBoolean("enabled"),
                rs.getObject("created_at", OffsetDateTime.class)));
    }

    @Transactional(readOnly = true)
    public List<DeliveryView> deliveries(UUID profileId, MoneyEnvironment environment) {
        return jdbc.query("""
            SELECT d.id, e.event_type, e.aggregate_id, w.endpoint_url, d.status, d.attempt_count,
                   d.last_http_status, d.last_error, d.next_attempt_at, d.delivered_at, d.created_at
            FROM webhook_deliveries d
            JOIN webhook_events e ON e.id = d.event_id
            JOIN webhook_endpoints w ON w.id = d.endpoint_id
            JOIN customers c ON c.id = d.customer_id
            WHERE c.profile_id = :profileId AND d.environment = CAST(:environment AS money_environment)
            ORDER BY d.created_at DESC LIMIT 50
            """, new MapSqlParameterSource().addValue("profileId", profileId).addValue("environment", environment.value()),
            (rs, row) -> new DeliveryView(rs.getObject("id", UUID.class), rs.getString("event_type"),
                rs.getObject("aggregate_id", UUID.class), rs.getString("endpoint_url"), rs.getString("status"),
                rs.getInt("attempt_count"), (Integer) rs.getObject("last_http_status"), rs.getString("last_error"),
                rs.getObject("next_attempt_at", OffsetDateTime.class), rs.getObject("delivered_at", OffsetDateTime.class),
                rs.getObject("created_at", OffsetDateTime.class)));
    }

    @Transactional
    public void delete(UUID profileId, UUID id) {
        int changed = jdbc.update("""
            DELETE FROM webhook_endpoints w USING customers c
            WHERE w.customer_id = c.id AND c.profile_id = :profileId AND w.id = :id
            """, new MapSqlParameterSource().addValue("profileId", profileId).addValue("id", id));
        if (changed == 0) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Webhook endpoint was not found");
    }

    public URI validatePublicHttps(String value) {
        try {
            URI uri = URI.create(value == null ? "" : value.trim());
            if (!"https".equalsIgnoreCase(uri.getScheme()) || uri.getHost() == null || uri.getUserInfo() != null || uri.getPort() != -1)
                throw new IllegalArgumentException();
            for (InetAddress address : InetAddress.getAllByName(uri.getHost())) {
                if (address.isAnyLocalAddress() || address.isLoopbackAddress() || address.isLinkLocalAddress()
                    || address.isSiteLocalAddress() || address.isMulticastAddress())
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Webhook endpoint must resolve to a public address");
            }
            return uri;
        } catch (ResponseStatusException exception) { throw exception; }
        catch (Exception exception) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Webhook endpoint must be a public HTTPS URL without a custom port"); }
    }

    private UUID customerId(UUID profileId) {
        var ids = jdbc.query("SELECT id FROM customers WHERE profile_id = :profileId AND status = 'active'",
            new MapSqlParameterSource("profileId", profileId), (rs, row) -> rs.getObject("id", UUID.class));
        if (ids.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Complete your customer profile first");
        return ids.getFirst();
    }
    public record EndpointView(UUID id, String environment, String endpointUrl, String secretPrefix, boolean enabled, OffsetDateTime createdAt) { }
    public record IssuedEndpoint(UUID id, String environment, String endpointUrl, String secretPrefix, boolean enabled, OffsetDateTime createdAt, String signingSecret) { }
    public record DeliveryView(UUID id, String eventType, UUID aggregateId, String endpointUrl, String status,
        int attemptCount, Integer lastHttpStatus, String lastError, OffsetDateTime nextAttemptAt,
        OffsetDateTime deliveredAt, OffsetDateTime createdAt) { }
}
