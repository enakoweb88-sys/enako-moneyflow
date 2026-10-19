package com.enako.moneyflow.modules.platform.application;

import com.enako.moneyflow.infrastructure.security.AccountReferenceCipher;
import com.enako.moneyflow.modules.platform.domain.MoneyEnvironment;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BeneficiaryService {
    private static final Set<String> PROVIDERS = Set.of(
        "MTN Mobile Money", "Orange Money", "Ecobank Cameroon", "Afriland First Bank");
    private final NamedParameterJdbcTemplate jdbc;
    private final AccountReferenceCipher cipher;

    public BeneficiaryService(NamedParameterJdbcTemplate jdbc, AccountReferenceCipher cipher) {
        this.jdbc = jdbc;
        this.cipher = cipher;
    }

    @Transactional(readOnly = true)
    public List<BeneficiaryView> list(UUID profileId, MoneyEnvironment environment) {
        UUID customerId = customerId(profileId);
        return jdbc.query("""
            SELECT id, display_name, provider, account_reference_masked, status, created_at
            FROM beneficiaries
            WHERE customer_id = :customerId AND environment = CAST(:environment AS money_environment)
            ORDER BY created_at DESC
            """, new MapSqlParameterSource().addValue("customerId", customerId).addValue("environment", environment.value()),
            (rs, row) -> new BeneficiaryView(rs.getObject("id", UUID.class), rs.getString("display_name"),
                rs.getString("provider"), rs.getString("account_reference_masked"), rs.getString("status"),
                rs.getObject("created_at", OffsetDateTime.class)));
    }

    @Transactional
    public BeneficiaryView create(UUID profileId, MoneyEnvironment environment, String name, String provider, String account) {
        String cleanName = name == null ? "" : name.trim();
        String cleanAccount = account == null ? "" : account.replaceAll("\\s+", "").trim();
        if (cleanName.length() < 2 || cleanName.length() > 200)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid beneficiary name");
        if (!PROVIDERS.contains(provider))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a supported beneficiary provider");
        if (cleanAccount.length() < 6 || cleanAccount.length() > 80)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid phone or account reference");
        UUID customerId = customerId(profileId);
        UUID id = UUID.randomUUID();
        String status = environment == MoneyEnvironment.SANDBOX ? "active" : "cooldown";
        jdbc.update("""
            INSERT INTO beneficiaries (id, customer_id, environment, display_name, provider,
                account_reference_encrypted, account_reference_masked, status)
            VALUES (:id, :customerId, CAST(:environment AS money_environment), :name, :provider,
                :encrypted, :masked, :status)
            """, new MapSqlParameterSource().addValue("id", id).addValue("customerId", customerId)
            .addValue("environment", environment.value()).addValue("name", cleanName).addValue("provider", provider)
            .addValue("encrypted", cipher.encrypt(cleanAccount)).addValue("masked", mask(cleanAccount)).addValue("status", status));
        return new BeneficiaryView(id, cleanName, provider, mask(cleanAccount), status, OffsetDateTime.now());
    }

    @Transactional
    public void delete(UUID profileId, MoneyEnvironment environment, UUID beneficiaryId) {
        int deleted = jdbc.update("""
            DELETE FROM beneficiaries
            WHERE id = :id AND customer_id = :customerId AND environment = CAST(:environment AS money_environment)
            """, new MapSqlParameterSource().addValue("id", beneficiaryId).addValue("customerId", customerId(profileId))
            .addValue("environment", environment.value()));
        if (deleted == 0) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Beneficiary was not found");
    }

    private UUID customerId(UUID profileId) {
        var ids = jdbc.query("SELECT id FROM customers WHERE profile_id = :profileId AND status = 'active'",
            new MapSqlParameterSource("profileId", profileId), (rs, row) -> rs.getObject("id", UUID.class));
        if (ids.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Complete your customer profile first");
        return ids.getFirst();
    }

    private String mask(String value) {
        int visible = Math.min(4, value.length());
        return "•••• " + value.substring(value.length() - visible);
    }

    public record BeneficiaryView(UUID id, String displayName, String provider, String accountMasked,
        String status, OffsetDateTime createdAt) { }
}
