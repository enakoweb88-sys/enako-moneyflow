package com.enako.moneyflow.modules.customer.application;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CustomerReadService {

    private final NamedParameterJdbcTemplate jdbc;

    public CustomerReadService(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public CustomerProfile customerProfile(UUID profileId) {
        return jdbc.query("""
            SELECT c.id, c.customer_number, p.display_name, p.email, p.phone_e164,
                   c.kyc_status::text, c.kyc_tier, c.status
            FROM customers c
            INNER JOIN profiles p ON p.id = c.profile_id
            WHERE c.profile_id = :profileId
            """, new MapSqlParameterSource("profileId", profileId), resultSet -> {
                if (!resultSet.next()) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No customer profile exists for this authenticated user");
                }
                return new CustomerProfile(
                    resultSet.getObject("id", UUID.class),
                    resultSet.getString("customer_number"),
                    resultSet.getString("display_name"),
                    resultSet.getString("email"),
                    resultSet.getString("phone_e164"),
                    resultSet.getString("kyc_status"),
                    resultSet.getShort("kyc_tier"),
                    resultSet.getString("status")
                );
            });
    }

    public record CustomerProfile(
        UUID id,
        String customerNumber,
        String displayName,
        String email,
        String phoneE164,
        String kycStatus,
        short kycTier,
        String status
    ) { }
}
