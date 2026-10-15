package com.enako.moneyflow.modules.identity.application;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthenticatedUserService {

    private final NamedParameterJdbcTemplate jdbc;

    public AuthenticatedUserService(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public CurrentUser currentUser(UUID profileId) {
        Map<String, Object> profile = findRequiredProfile(profileId);
        List<String> roles = jdbc.queryForList("""
            SELECT role::text
            FROM staff_role_assignments
            WHERE profile_id = :profileId AND revoked_at IS NULL
            UNION
            SELECT 'customer'
            WHERE EXISTS (SELECT 1 FROM customers WHERE profile_id = :profileId)
            ORDER BY 1
            """, parameters(profileId), String.class)
            .stream()
            .map(role -> role.toUpperCase(Locale.ROOT))
            .toList();

        return new CurrentUser(
            profileId,
            (String) profile.get("email"),
            (String) profile.get("display_name"),
            roles
        );
    }

    private Map<String, Object> findRequiredProfile(UUID profileId) {
        List<Map<String, Object>> profiles = jdbc.queryForList("""
            SELECT id, email, display_name
            FROM profiles
            WHERE id = :profileId
            """, parameters(profileId));

        if (profiles.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No application profile exists for this authenticated user");
        }
        return profiles.getFirst();
    }

    private MapSqlParameterSource parameters(UUID profileId) {
        return new MapSqlParameterSource("profileId", profileId);
    }

    public record CurrentUser(UUID id, String email, String displayName, List<String> roles) { }
}
