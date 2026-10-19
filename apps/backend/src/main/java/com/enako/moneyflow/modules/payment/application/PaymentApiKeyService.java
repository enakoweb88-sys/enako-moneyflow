package com.enako.moneyflow.modules.payment.application;

import com.enako.moneyflow.modules.platform.application.EnvironmentAccessPolicy;
import com.enako.moneyflow.modules.platform.domain.MoneyEnvironment;
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
public class PaymentApiKeyService {
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final BCryptPasswordEncoder HASHER = new BCryptPasswordEncoder(12);
    private static final int MAX_ACTIVE_KEYS = 5;
    private final NamedParameterJdbcTemplate jdbc;
    private final EnvironmentAccessPolicy accessPolicy;

    public PaymentApiKeyService(NamedParameterJdbcTemplate jdbc, EnvironmentAccessPolicy accessPolicy) {
        this.jdbc = jdbc;
        this.accessPolicy = accessPolicy;
    }

    @Transactional
    public IssuedKey issue(UUID profileId, MoneyEnvironment environment, String label) {
        if (environment == MoneyEnvironment.SANDBOX) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use the Sandbox key endpoint for Sandbox credentials");
        }
        accessPolicy.assertAccessible(profileId, environment);
        UUID customerId = customerId(profileId);
        Integer active = jdbc.queryForObject("""
            SELECT COUNT(*) FROM api_credentials
            WHERE customer_id = :customerId AND environment = CAST(:environment AS money_environment) AND revoked_at IS NULL
            """, new MapSqlParameterSource().addValue("customerId", customerId)
            .addValue("environment", environment.value()), Integer.class);
        if (active != null && active >= MAX_ACTIVE_KEYS) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Revoke an existing key before creating another one");
        }
        String keyLabel = label == null || label.isBlank() ? defaultLabel(environment) : label.trim();
        if (keyLabel.length() > 120) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Key label is too long");
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String secret = prefix(environment) + Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        String visiblePrefix = secret.substring(0, Math.min(20, secret.length()));
        UUID id = UUID.randomUUID();
        jdbc.update("""
            INSERT INTO api_credentials (id, customer_id, environment, key_prefix, secret_hash, label)
            VALUES (:id, :customerId, CAST(:environment AS money_environment), :prefix, :hash, :label)
            """, new MapSqlParameterSource().addValue("id", id).addValue("customerId", customerId)
            .addValue("environment", environment.value()).addValue("prefix", visiblePrefix)
            .addValue("hash", HASHER.encode(secret)).addValue("label", keyLabel));
        ensureWallet(customerId, environment);
        return new IssuedKey(id, environment.value(), visiblePrefix, keyLabel, secret);
    }

    @Transactional(readOnly = true)
    public List<KeyView> list(UUID profileId, MoneyEnvironment environment) {
        return jdbc.query("""
            SELECT a.id, a.environment::text, a.key_prefix, a.label, a.last_used_at, a.created_at
            FROM api_credentials a JOIN customers c ON c.id = a.customer_id
            WHERE c.profile_id = :profileId AND a.environment = CAST(:environment AS money_environment)
              AND a.revoked_at IS NULL ORDER BY a.created_at DESC
            """, new MapSqlParameterSource().addValue("profileId", profileId).addValue("environment", environment.value()),
            (rs, row) -> new KeyView(rs.getObject("id", UUID.class), rs.getString("environment"),
                rs.getString("key_prefix"), rs.getString("label"), rs.getObject("last_used_at", OffsetDateTime.class),
                rs.getObject("created_at", OffsetDateTime.class)));
    }

    @Transactional
    public void revoke(UUID profileId, MoneyEnvironment environment, UUID id) {
        int changed = jdbc.update("""
            UPDATE api_credentials a SET revoked_at = CURRENT_TIMESTAMP
            FROM customers c WHERE a.customer_id = c.id AND c.profile_id = :profileId AND a.id = :id
              AND a.environment = CAST(:environment AS money_environment) AND a.revoked_at IS NULL
            """, new MapSqlParameterSource().addValue("profileId", profileId).addValue("id", id)
            .addValue("environment", environment.value()));
        if (changed == 0) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "API key was not found");
    }

    @Transactional
    public ApiPrincipal authenticate(String secret) {
        MoneyEnvironment environment = environmentFor(secret);
        String visiblePrefix = secret.substring(0, Math.min(20, secret.length()));
        var candidates = jdbc.query("""
            SELECT a.id, a.customer_id, c.profile_id, a.secret_hash
            FROM api_credentials a JOIN customers c ON c.id = a.customer_id
            WHERE a.key_prefix = :prefix AND a.environment = CAST(:environment AS money_environment)
              AND a.revoked_at IS NULL AND c.status = 'active'
            """, new MapSqlParameterSource().addValue("prefix", visiblePrefix).addValue("environment", environment.value()),
            (rs, row) -> new Candidate(rs.getObject("id", UUID.class), rs.getObject("customer_id", UUID.class),
                rs.getObject("profile_id", UUID.class), rs.getString("secret_hash")));
        Candidate match = candidates.stream().filter(candidate -> HASHER.matches(secret, candidate.hash())).findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid MoneyFlow API key"));
        jdbc.update("UPDATE api_credentials SET last_used_at = CURRENT_TIMESTAMP WHERE id = :id",
            new MapSqlParameterSource("id", match.id()));
        return new ApiPrincipal(match.customerId(), match.profileId(), environment);
    }

    private MoneyEnvironment environmentFor(String secret) {
        if (secret == null || secret.length() < 20) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid MoneyFlow API key");
        if (secret.startsWith("mf_plt_")) return MoneyEnvironment.PILOT_LIVE;
        if (secret.startsWith("mf_live_")) return MoneyEnvironment.LIVE;
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "This endpoint requires a Pilot Live or Live key");
    }

    private UUID customerId(UUID profileId) {
        var ids = jdbc.query("SELECT id FROM customers WHERE profile_id = :profileId AND status = 'active'",
            new MapSqlParameterSource("profileId", profileId), (rs, row) -> rs.getObject("id", UUID.class));
        if (ids.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Complete your customer profile first");
        return ids.getFirst();
    }

    private void ensureWallet(UUID customerId, MoneyEnvironment environment) {
        jdbc.update("""
            INSERT INTO wallets (id, customer_id, environment, currency, balance_minor, held_minor)
            VALUES (:id, :customerId, CAST(:environment AS money_environment), 'XAF', 0, 0)
            ON CONFLICT (customer_id, environment, currency) DO NOTHING
            """, new MapSqlParameterSource().addValue("id", UUID.randomUUID()).addValue("customerId", customerId)
            .addValue("environment", environment.value()));
    }

    private String prefix(MoneyEnvironment environment) { return environment == MoneyEnvironment.PILOT_LIVE ? "mf_plt_" : "mf_live_"; }
    private String defaultLabel(MoneyEnvironment environment) { return environment == MoneyEnvironment.PILOT_LIVE ? "Pilot Live key" : "Live key"; }

    private record Candidate(UUID id, UUID customerId, UUID profileId, String hash) { }
    public record ApiPrincipal(UUID customerId, UUID profileId, MoneyEnvironment environment) { }
    public record IssuedKey(UUID id, String environment, String prefix, String label, String secret) { }
    public record KeyView(UUID id, String environment, String prefix, String label, OffsetDateTime lastUsedAt, OffsetDateTime createdAt) { }
}
