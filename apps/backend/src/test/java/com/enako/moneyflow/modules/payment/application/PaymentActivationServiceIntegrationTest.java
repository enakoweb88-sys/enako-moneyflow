package com.enako.moneyflow.modules.payment.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import com.enako.moneyflow.modules.notification.application.ResendEmailService;
import java.util.List;
import java.util.UUID;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.web.server.ResponseStatusException;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class PaymentActivationServiceIntegrationTest {
    @Container
    private static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
        .withDatabaseName("moneyflow")
        .withUsername("postgres")
        .withPassword("postgres")
        .withInitScript("supabase-auth-stub.sql");

    private JdbcTemplate jdbc;
    private PaymentActivationService service;
    private ResendEmailService emailService;

    @BeforeAll
    void setUp() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource(
            postgres.getJdbcUrl(),
            postgres.getUsername(),
            postgres.getPassword()
        );
        Flyway.configure().dataSource(dataSource).locations("classpath:db/migration").load().migrate();
        jdbc = new JdbcTemplate(dataSource);
        emailService = mock(ResendEmailService.class);
        service = new PaymentActivationService(new NamedParameterJdbcTemplate(dataSource), emailService);
    }

    @Test
    void savesAndSubmitsAnActivationRequestOwnedByTheAuthenticatedProfile() {
        UUID profileId = createProfile("owner@enako.test");
        UUID otherProfileId = createProfile("other@enako.test");

        PaymentActivationService.ActivationDraft draft = new PaymentActivationService.ActivationDraft(
            "online_payments",
            "CM",
            "company",
            "E-NAKO Test Merchant",
            "Test Owner",
            "owner@enako.test",
            "+237670000000",
            "Director",
            "XAF",
            "1000000_5000000",
            List.of("mtn_momo", "orange_money")
        );

        PaymentActivationService.ActivationRequest saved = service.saveDraft(profileId, draft);
        assertEquals("draft", saved.status());
        assertEquals(List.of("mtn_momo", "orange_money"), saved.channels());

        PaymentActivationService.ActivationRequest submitted = service.submit(profileId);
        assertEquals("submitted", submitted.status());
        assertEquals(1, jdbc.queryForObject(
            "SELECT COUNT(*) FROM payment_activation_requests WHERE profile_id = ? AND submitted_at IS NOT NULL",
            Integer.class,
            profileId
        ));
        verify(emailService).paymentActivationSubmitted("owner@enako.test", "E-NAKO Test Merchant");

        ResponseStatusException error = assertThrows(
            ResponseStatusException.class,
            () -> service.latestFor(otherProfileId)
        );
        assertEquals(HttpStatus.NOT_FOUND, error.getStatusCode());
    }

    private UUID createProfile(String email) {
        UUID id = UUID.randomUUID();
        jdbc.update("INSERT INTO auth.users (id, email) VALUES (?, ?)", id, email);
        jdbc.update(
            "INSERT INTO profiles (id, email, display_name) VALUES (?, ?, ?)",
            id,
            email,
            "Integration Test"
        );
        return id;
    }
}
