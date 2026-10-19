package com.enako.moneyflow.modules.wallet.application;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.enako.moneyflow.modules.platform.application.EnvironmentAccessPolicy;
import com.enako.moneyflow.modules.platform.domain.MoneyEnvironment;

@Service
public class WalletReadService {

    private final NamedParameterJdbcTemplate jdbc;
    private final EnvironmentAccessPolicy environmentAccessPolicy;

    public WalletReadService(NamedParameterJdbcTemplate jdbc, EnvironmentAccessPolicy environmentAccessPolicy) {
        this.jdbc = jdbc;
        this.environmentAccessPolicy = environmentAccessPolicy;
    }

    public CustomerWallets customerWallets(UUID profileId, MoneyEnvironment environment) {
        environmentAccessPolicy.assertAccessible(profileId, environment);
        List<CustomerWallets> wallets = jdbc.query("""
            SELECT c.id AS customer_id, w.id, w.currency, w.status::text,
                   w.balance_minor, w.held_minor, (w.balance_minor - w.held_minor) AS available_minor
            FROM customers c
            LEFT JOIN wallets w ON w.customer_id = c.id AND w.environment = CAST(:environment AS money_environment)
            WHERE c.profile_id = :profileId
            ORDER BY w.currency ASC NULLS LAST
            """, new MapSqlParameterSource().addValue("profileId", profileId).addValue("environment", environment.value()), (resultSet, rowNumber) -> {
                UUID customerId = resultSet.getObject("customer_id", UUID.class);
                UUID walletId = resultSet.getObject("id", UUID.class);
                Wallet wallet = walletId == null ? null : new Wallet(
                    walletId,
                    resultSet.getString("currency"),
                    resultSet.getString("status"),
                    resultSet.getLong("balance_minor"),
                    resultSet.getLong("held_minor"),
                    resultSet.getLong("available_minor")
                );
                return new CustomerWallets(customerId, environment.value(), wallet == null ? List.of() : List.of(wallet));
            });

        if (wallets.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No customer wallet exists for this authenticated user");
        }

        UUID customerId = wallets.getFirst().customerId();
        List<Wallet> walletList = wallets.stream().flatMap(result -> result.wallets().stream()).toList();
        return new CustomerWallets(customerId, environment.value(), walletList);
    }

    public record CustomerWallets(UUID customerId, String environment, List<Wallet> wallets) { }

    public record Wallet(
        UUID id,
        String currency,
        String status,
        long balanceMinor,
        long heldMinor,
        long availableMinor
    ) { }
}
