package com.enako.moneyflow.modules.payment.application;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.enako.moneyflow.modules.notification.application.ResendEmailService;

@Service
public class PaymentActivationService {
    private final NamedParameterJdbcTemplate jdbc;
    private final ResendEmailService emailService;

    public PaymentActivationService(NamedParameterJdbcTemplate jdbc, ResendEmailService emailService) { this.jdbc = jdbc; this.emailService = emailService; }

    public ActivationRequest latestFor(UUID profileId) {
        List<ActivationRequest> records = jdbc.query("""
            SELECT r.id, r.business_use, r.business_country, r.organisation_type, r.legal_business_name,
                   r.representative_name, r.representative_email, r.representative_phone, r.representative_role,
                   r.settlement_currency, r.expected_monthly_volume, r.status::text, r.submitted_at, r.review_note,
                   ARRAY(SELECT channel::text FROM payment_activation_channels c WHERE c.payment_activation_request_id = r.id ORDER BY 1) channels
            FROM payment_activation_requests r WHERE r.profile_id = :profileId ORDER BY r.created_at DESC LIMIT 1
            """, p(profileId), (rs, n) -> map(rs));
        if (records.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No payment activation request exists");
        return records.getFirst();
    }

    @Transactional
    public ActivationRequest saveDraft(UUID profileId, ActivationDraft draft) {
        UUID id = jdbc.query("""
            SELECT id FROM payment_activation_requests WHERE profile_id = :profileId
            AND status IN ('draft', 'changes_requested') ORDER BY updated_at DESC LIMIT 1
            """, p(profileId), rs -> rs.next() ? rs.getObject(1, UUID.class) : null);
        MapSqlParameterSource params = p(profileId).addValue("businessUse", draft.businessUse()).addValue("country", draft.businessCountry())
            .addValue("organisationType", draft.organisationType()).addValue("legalBusinessName", draft.legalBusinessName())
            .addValue("representativeName", draft.representativeName()).addValue("representativeEmail", draft.representativeEmail())
            .addValue("representativePhone", blankToNull(draft.representativePhone())).addValue("representativeRole", draft.representativeRole())
            .addValue("currency", draft.settlementCurrency()).addValue("monthlyVolume", blankToNull(draft.expectedMonthlyVolume()));
        if (id == null) {
            id = UUID.randomUUID(); params.addValue("id", id);
            jdbc.update("""
                INSERT INTO payment_activation_requests (id,profile_id,business_use,business_country,organisation_type,legal_business_name,representative_name,representative_email,representative_phone,representative_role,settlement_currency,expected_monthly_volume)
                VALUES (:id,:profileId,:businessUse,:country,:organisationType,:legalBusinessName,:representativeName,:representativeEmail,:representativePhone,:representativeRole,:currency,:monthlyVolume)
                """, params);
        } else {
            params.addValue("id", id);
            jdbc.update("""
                UPDATE payment_activation_requests SET business_use=:businessUse,business_country=:country,organisation_type=:organisationType,legal_business_name=:legalBusinessName,representative_name=:representativeName,representative_email=:representativeEmail,representative_phone=:representativePhone,representative_role=:representativeRole,settlement_currency=:currency,expected_monthly_volume=:monthlyVolume,status='draft',submitted_at=NULL,reviewed_at=NULL,reviewed_by=NULL,review_note=NULL,updated_at=CURRENT_TIMESTAMP WHERE id=:id
                """, params);
        }
        jdbc.update("DELETE FROM payment_activation_channels WHERE payment_activation_request_id=:id", new MapSqlParameterSource("id", id));
        for (String channel : draft.channels()) jdbc.update("INSERT INTO payment_activation_channels (payment_activation_request_id,channel) VALUES (:id,CAST(:channel AS payment_activation_channel))", new MapSqlParameterSource().addValue("id", id).addValue("channel", channel));
        return latestFor(profileId);
    }

    @Transactional
    public ActivationRequest submit(UUID profileId) {
        ActivationRequest request = latestFor(profileId);
        if (!"draft".equals(request.status()) && !"changes_requested".equals(request.status())) return request;
        jdbc.update("UPDATE payment_activation_requests SET status='submitted', submitted_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP WHERE id=:id", new MapSqlParameterSource("id", request.id()));
        emailService.paymentActivationSubmitted(request.representativeEmail(), request.legalBusinessName());
        return latestFor(profileId);
    }

    private MapSqlParameterSource p(UUID profileId) { return new MapSqlParameterSource("profileId", profileId); }
    private String blankToNull(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private ActivationRequest map(java.sql.ResultSet rs) throws java.sql.SQLException { return new ActivationRequest(rs.getObject("id", UUID.class),rs.getString("business_use"),rs.getString("business_country"),rs.getString("organisation_type"),rs.getString("legal_business_name"),rs.getString("representative_name"),rs.getString("representative_email"),rs.getString("representative_phone"),rs.getString("representative_role"),rs.getString("settlement_currency"),rs.getString("expected_monthly_volume"),rs.getString("status"),rs.getObject("submitted_at", OffsetDateTime.class),rs.getString("review_note"),List.of((String[])rs.getArray("channels").getArray())); }

    public record ActivationDraft(String businessUse,String businessCountry,String organisationType,String legalBusinessName,String representativeName,String representativeEmail,String representativePhone,String representativeRole,String settlementCurrency,String expectedMonthlyVolume,List<String> channels) { }
    public record ActivationRequest(UUID id,String businessUse,String businessCountry,String organisationType,String legalBusinessName,String representativeName,String representativeEmail,String representativePhone,String representativeRole,String settlementCurrency,String expectedMonthlyVolume,String status,OffsetDateTime submittedAt,String reviewNote,List<String> channels) { }
}
