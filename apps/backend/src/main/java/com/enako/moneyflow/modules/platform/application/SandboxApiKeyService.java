package com.enako.moneyflow.modules.platform.application;

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
public class SandboxApiKeyService {
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final BCryptPasswordEncoder HASHER = new BCryptPasswordEncoder(12);
    private final NamedParameterJdbcTemplate jdbc;
    public SandboxApiKeyService(NamedParameterJdbcTemplate jdbc) { this.jdbc = jdbc; }

    @Transactional
    public IssuedKey issue(UUID profileId, String label) {
        UUID customerId = customerId(profileId);
        byte[] bytes = new byte[32]; RANDOM.nextBytes(bytes);
        String secret = "mf_sbx_" + Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        String prefix = secret.substring(0, 20);
        UUID id = UUID.randomUUID();
        jdbc.update("""
            INSERT INTO api_credentials (id, customer_id, environment, key_prefix, secret_hash, label)
            VALUES (:id, :customerId, 'sandbox', :prefix, :hash, :label)
            """, new MapSqlParameterSource().addValue("id", id).addValue("customerId", customerId)
            .addValue("prefix", prefix).addValue("hash", HASHER.encode(secret))
            .addValue("label", label == null || label.isBlank() ? "Sandbox key" : label.trim()));
        return new IssuedKey(id, prefix, label == null || label.isBlank() ? "Sandbox key" : label.trim(), secret);
    }

    @Transactional(readOnly = true)
    public List<KeyView> list(UUID profileId) {
        return jdbc.query("""
            SELECT a.id, a.key_prefix, a.label, a.last_used_at, a.created_at
            FROM api_credentials a JOIN customers c ON c.id = a.customer_id
            WHERE c.profile_id = :profileId AND a.environment = 'sandbox' AND a.revoked_at IS NULL
            ORDER BY a.created_at DESC
            """, new MapSqlParameterSource("profileId", profileId), (rs, row) -> new KeyView(
                rs.getObject("id", UUID.class), rs.getString("key_prefix"), rs.getString("label"),
                rs.getObject("last_used_at", OffsetDateTime.class), rs.getObject("created_at", OffsetDateTime.class)));
    }

    @Transactional
    public void revoke(UUID profileId, UUID id) {
        int changed = jdbc.update("""
            UPDATE api_credentials a SET revoked_at = CURRENT_TIMESTAMP
            FROM customers c WHERE a.customer_id = c.id AND c.profile_id = :profileId
              AND a.id = :id AND a.environment = 'sandbox' AND a.revoked_at IS NULL
            """, new MapSqlParameterSource().addValue("profileId", profileId).addValue("id", id));
        if (changed == 0) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sandbox key was not found");
    }

    @Transactional
    public ApiPrincipal authenticate(String secret) {
        if (secret == null || !secret.startsWith("mf_sbx_") || secret.length() < 20)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Sandbox API key");
        String prefix = secret.substring(0, 20);
        var candidates = jdbc.query("""
            SELECT a.id, a.customer_id, c.profile_id, a.secret_hash
            FROM api_credentials a JOIN customers c ON c.id = a.customer_id
            WHERE a.key_prefix = :prefix AND a.environment = 'sandbox' AND a.revoked_at IS NULL
            """, new MapSqlParameterSource("prefix", prefix), (rs, row) -> new Candidate(
                rs.getObject("id", UUID.class), rs.getObject("customer_id", UUID.class),
                rs.getObject("profile_id", UUID.class), rs.getString("secret_hash")));
        Candidate match = candidates.stream().filter(candidate -> HASHER.matches(secret, candidate.hash())).findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Sandbox API key"));
        jdbc.update("UPDATE api_credentials SET last_used_at = CURRENT_TIMESTAMP WHERE id = :id",
            new MapSqlParameterSource("id", match.id()));
        return new ApiPrincipal(match.customerId(), match.profileId());
    }

    private UUID customerId(UUID profileId) {
        var ids = jdbc.query("SELECT id FROM customers WHERE profile_id = :profileId AND status = 'active'",
            new MapSqlParameterSource("profileId", profileId), (rs, row) -> rs.getObject("id", UUID.class));
        if (ids.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Complete your customer profile first");
        return ids.getFirst();
    }
    private record Candidate(UUID id, UUID customerId, UUID profileId, String hash) { }
    public record ApiPrincipal(UUID customerId, UUID profileId) { }
    public record IssuedKey(UUID id, String prefix, String label, String secret) { }
    public record KeyView(UUID id, String prefix, String label, OffsetDateTime lastUsedAt, OffsetDateTime createdAt) { }
}
