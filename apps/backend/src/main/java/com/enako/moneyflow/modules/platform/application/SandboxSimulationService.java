package com.enako.moneyflow.modules.platform.application;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SandboxSimulationService {
    private final NamedParameterJdbcTemplate jdbc;

    public SandboxSimulationService(NamedParameterJdbcTemplate jdbc) { this.jdbc = jdbc; }

    @Transactional
    public SandboxState reset(UUID profileId, long openingBalance) {
        UUID customerId = customerId(profileId);
        MapSqlParameterSource customer = new MapSqlParameterSource("customerId", customerId);
        jdbc.update("DELETE FROM transaction_disputes WHERE customer_id = :customerId AND environment = 'sandbox'", customer);
        jdbc.update("DELETE FROM ledger_entries WHERE customer_id = :customerId AND environment = 'sandbox'", customer);
        jdbc.update("DELETE FROM money_movements WHERE customer_id = :customerId AND environment = 'sandbox'", customer);
        jdbc.update("DELETE FROM beneficiaries WHERE customer_id = :customerId AND environment = 'sandbox'", customer);
        jdbc.update("""
            INSERT INTO wallets (id, customer_id, environment, currency, balance_minor, held_minor)
            VALUES (:id, :customerId, 'sandbox', 'XAF', :balance, 0)
            ON CONFLICT (customer_id, environment, currency)
            DO UPDATE SET balance_minor = EXCLUDED.balance_minor, held_minor = 0, status = 'active', updated_at = CURRENT_TIMESTAMP
            """, new MapSqlParameterSource().addValue("id", UUID.randomUUID()).addValue("customerId", customerId).addValue("balance", openingBalance));
        seedBeneficiary(customerId, "Sandbox MTN", "MTN Mobile Money", "+237 670 ••• 001", "sandbox:mtn:670000001");
        seedBeneficiary(customerId, "Sandbox Orange", "Orange Money", "+237 690 ••• 002", "sandbox:orange:690000002");
        return new SandboxState(openingBalance, 0, 2);
    }

    @Transactional
    public SimulationResult simulate(UUID profileId, Scenario scenario, long amount) {
        return simulate(profileId, scenario, amount, UUID.randomUUID().toString());
    }

    @Transactional
    public SimulationResult simulate(UUID profileId, Scenario scenario, long amount, String idempotencyKey) {
        UUID customerId = customerId(profileId);
        Wallet wallet = wallet(customerId);
        var existing = jdbc.query("""
            SELECT m.id, m.external_reference, m.movement_type, m.status::text, m.amount_minor,
                   COALESCE(l.balance_after_minor, w.balance_minor) AS resulting_balance
            FROM money_movements m
            JOIN wallets w ON w.id = m.wallet_id
            LEFT JOIN ledger_entries l ON l.movement_id = m.id AND l.environment = 'sandbox'
            WHERE m.customer_id = :customerId AND m.environment = 'sandbox' AND m.idempotency_key = :idempotency
            """, new MapSqlParameterSource().addValue("customerId", customerId).addValue("idempotency", idempotencyKey),
            (rs, row) -> new SimulationResult(rs.getObject("id", UUID.class), rs.getString("external_reference"),
                rs.getString("movement_type") + "_" + rs.getString("status"), rs.getString("status"),
                rs.getLong("amount_minor"), rs.getLong("resulting_balance")));
        if (!existing.isEmpty()) {
            if (existing.getFirst().amountMinor() != amount)
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Idempotency key was already used with a different amount");
            return existing.getFirst();
        }
        boolean completed = scenario == Scenario.DEPOSIT_COMPLETED || scenario == Scenario.WITHDRAWAL_COMPLETED;
        boolean debit = scenario.name().startsWith("WITHDRAWAL_");
        if (scenario == Scenario.WITHDRAWAL_COMPLETED && wallet.available() < amount)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Sandbox balance is insufficient for this scenario");

        String status = completed ? "completed" : scenario.name().endsWith("_PENDING") ? "pending" : "failed";
        UUID movementId = UUID.randomUUID();
        String reference = "SBX-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        jdbc.update("""
            INSERT INTO money_movements (id, customer_id, wallet_id, environment, direction, movement_type, status,
                amount_minor, fee_minor, currency, external_reference, idempotency_key, description, completed_at)
            VALUES (:id, :customerId, :walletId, 'sandbox', CAST(:direction AS money_movement_direction), :type, CAST(:status AS money_movement_status),
                :amount, 0, 'XAF', :reference, :idempotency, :description,
                CASE WHEN :status = 'completed' THEN CURRENT_TIMESTAMP ELSE NULL END)
            """, new MapSqlParameterSource().addValue("id", movementId).addValue("customerId", customerId)
            .addValue("walletId", wallet.id()).addValue("direction", debit ? "debit" : "credit")
            .addValue("type", debit ? "withdrawal" : "deposit").addValue("status", status).addValue("amount", amount)
            .addValue("reference", reference).addValue("idempotency", idempotencyKey)
            .addValue("description", "Deterministic Sandbox scenario: " + scenario.name()));

        long resultingBalance = wallet.balance();
        if (completed) {
            resultingBalance = debit ? wallet.balance() - amount : wallet.balance() + amount;
            jdbc.update("UPDATE wallets SET balance_minor = :balance, updated_at = CURRENT_TIMESTAMP WHERE id = :walletId AND environment = 'sandbox'",
                new MapSqlParameterSource().addValue("balance", resultingBalance).addValue("walletId", wallet.id()));
            jdbc.update("""
                INSERT INTO ledger_entries (customer_id, wallet_id, movement_id, environment, direction, amount_minor, balance_after_minor, currency)
                VALUES (:customerId, :walletId, :movementId, 'sandbox', CAST(:direction AS money_movement_direction), :amount, :balance, 'XAF')
                """, new MapSqlParameterSource().addValue("customerId", customerId).addValue("walletId", wallet.id())
                .addValue("movementId", movementId).addValue("direction", debit ? "debit" : "credit")
                .addValue("amount", amount).addValue("balance", resultingBalance));
        }
        return new SimulationResult(movementId, reference, scenario.name().toLowerCase(), status, amount, resultingBalance);
    }

    @Transactional(readOnly = true)
    public SandboxSnapshot state(UUID profileId) {
        UUID customerId = customerId(profileId);
        Wallet wallet;
        try {
            wallet = wallet(customerId);
        } catch (ResponseStatusException exception) {
            if (exception.getStatusCode() == HttpStatus.NOT_FOUND) {
                return new SandboxSnapshot(false, 0, 0, 0, List.of(), List.of());
            }
            throw exception;
        }
        var parameters = new MapSqlParameterSource("customerId", customerId);
        List<SandboxBeneficiary> beneficiaries = jdbc.query("""
            SELECT id, display_name, provider, account_reference_masked, status
            FROM beneficiaries
            WHERE customer_id = :customerId AND environment = 'sandbox'
            ORDER BY created_at ASC
            """, parameters, (rs, row) -> new SandboxBeneficiary(
                rs.getObject("id", UUID.class), rs.getString("display_name"), rs.getString("provider"),
                rs.getString("account_reference_masked"), rs.getString("status")));
        List<SandboxMovement> movements = jdbc.query("""
            SELECT id, direction::text, movement_type, status::text, amount_minor, fee_minor, currency,
                   external_reference, description, created_at
            FROM money_movements
            WHERE customer_id = :customerId AND environment = 'sandbox'
            ORDER BY created_at DESC
            LIMIT 20
            """, parameters, (rs, row) -> new SandboxMovement(
                rs.getObject("id", UUID.class), rs.getString("direction"), rs.getString("movement_type"),
                rs.getString("status"), rs.getLong("amount_minor"), rs.getLong("fee_minor"),
                rs.getString("currency"), rs.getString("external_reference"), rs.getString("description"),
                rs.getObject("created_at", OffsetDateTime.class)));
        return new SandboxSnapshot(true, wallet.balance(), wallet.balance() - wallet.available(), wallet.available(), beneficiaries, movements);
    }

    @Transactional(readOnly = true)
    public SimulationResult payment(UUID profileId, UUID movementId) {
        UUID customerId = customerId(profileId);
        var payments = jdbc.query("""
            SELECT m.id, m.external_reference, m.movement_type, m.status::text, m.amount_minor,
                   COALESCE(l.balance_after_minor, w.balance_minor) AS resulting_balance
            FROM money_movements m
            JOIN wallets w ON w.id = m.wallet_id
            LEFT JOIN ledger_entries l ON l.movement_id = m.id AND l.environment = 'sandbox'
            WHERE m.id = :id AND m.customer_id = :customerId AND m.environment = 'sandbox'
            """, new MapSqlParameterSource().addValue("id", movementId).addValue("customerId", customerId),
            (rs, row) -> new SimulationResult(rs.getObject("id", UUID.class), rs.getString("external_reference"),
                rs.getString("movement_type") + "_" + rs.getString("status"), rs.getString("status"),
                rs.getLong("amount_minor"), rs.getLong("resulting_balance")));
        if (payments.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sandbox payment was not found");
        return payments.getFirst();
    }

    private UUID customerId(UUID profileId) {
        var ids = jdbc.query("SELECT id FROM customers WHERE profile_id = :profileId AND status = 'active'",
            new MapSqlParameterSource("profileId", profileId), (rs, row) -> rs.getObject("id", UUID.class));
        if (ids.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Complete the customer profile before using Sandbox");
        return ids.getFirst();
    }

    private Wallet wallet(UUID customerId) {
        var wallets = jdbc.query("""
            SELECT id, balance_minor, (balance_minor - held_minor) available_minor FROM wallets
            WHERE customer_id = :customerId AND environment = 'sandbox' AND currency = 'XAF' AND status = 'active'
            """, new MapSqlParameterSource("customerId", customerId),
            (rs, row) -> new Wallet(rs.getObject("id", UUID.class), rs.getLong("balance_minor"), rs.getLong("available_minor")));
        if (wallets.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Reset Sandbox to create its test wallet");
        return wallets.getFirst();
    }

    private void seedBeneficiary(UUID customerId, String name, String provider, String masked, String encrypted) {
        jdbc.update("""
            INSERT INTO beneficiaries (customer_id, environment, display_name, provider, account_reference_encrypted, account_reference_masked, status)
            VALUES (:customerId, 'sandbox', :name, :provider, :encrypted, :masked, 'active')
            """, new MapSqlParameterSource().addValue("customerId", customerId).addValue("name", name)
            .addValue("provider", provider).addValue("encrypted", encrypted).addValue("masked", masked));
    }

    public enum Scenario { DEPOSIT_COMPLETED, DEPOSIT_PENDING, DEPOSIT_FAILED, WITHDRAWAL_COMPLETED, WITHDRAWAL_PENDING, WITHDRAWAL_FAILED }
    private record Wallet(UUID id, long balance, long available) { }
    public record SandboxState(long balanceMinor, long heldMinor, int beneficiaryCount) { }
    public record SimulationResult(UUID movementId, String reference, String scenario, String status, long amountMinor, long balanceMinor) { }
    public record SandboxSnapshot(boolean initialized, long balanceMinor, long heldMinor, long availableMinor,
        List<SandboxBeneficiary> beneficiaries, List<SandboxMovement> movements) { }
    public record SandboxBeneficiary(UUID id, String displayName, String provider, String accountMasked, String status) { }
    public record SandboxMovement(UUID id, String direction, String movementType, String status, long amountMinor,
        long feeMinor, String currency, String reference, String description, OffsetDateTime createdAt) { }
}
