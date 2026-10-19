package com.enako.moneyflow.modules.payment.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.enako.moneyflow.modules.payment.application.PaymentProviderGateway.Provider;
import com.enako.moneyflow.infrastructure.security.WebhookSecretCipher;
import com.enako.moneyflow.modules.platform.application.EnvironmentAccessPolicy;
import com.enako.moneyflow.modules.platform.domain.MoneyEnvironment;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.web.server.ResponseStatusException;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class PilotPaymentIntegrationTest {
    @Container
    private static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
        .withDatabaseName("moneyflow").withUsername("postgres").withPassword("postgres")
        .withInitScript("supabase-auth-stub.sql");
    private JdbcTemplate jdbc;
    private PaymentApiKeyService keys;
    private PaymentCollectionService payments;
    private UUID profileId;
    private UUID customerId;

    @BeforeAll
    void setUp() {
        var dataSource = new DriverManagerDataSource(postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword());
        Flyway.configure().dataSource(dataSource).locations("classpath:db/migration").load().migrate();
        jdbc = new JdbcTemplate(dataSource);
        var named = new NamedParameterJdbcTemplate(dataSource);
        keys = new PaymentApiKeyService(named, new EnvironmentAccessPolicy());
        PaymentProviderGateway fakeProvider = new PaymentProviderGateway() {
            public boolean supports(Provider provider) { return provider == Provider.MTN_MOMO; }
            public InitiationResult initiate(InitiationCommand command) {
                return new InitiationResult("MTN-" + command.paymentId(), "pending_customer");
            }
            public ProviderStatus status(String providerReference) {
                return new ProviderStatus(providerReference, "SUCCESSFUL", "MTN-FINANCIAL-1", null);
            }
        };
        payments = new PaymentCollectionService(named, keys, new PaymentProviderRouter(List.of(fakeProvider)),
            new ObjectMapper().findAndRegisterModules(), 1, 1_000, 5_000);
        profileId = UUID.randomUUID();
        customerId = UUID.randomUUID();
        jdbc.update("INSERT INTO auth.users (id, email) VALUES (?, ?)", profileId, "pilot@enako.test");
        jdbc.update("INSERT INTO profiles (id, email, display_name) VALUES (?, ?, ?)", profileId, "pilot@enako.test", "Pilot Merchant");
        jdbc.update("INSERT INTO customers (id, profile_id, customer_number) VALUES (?, ?, ?)", customerId, profileId, "CUS-PILOT");
    }

    @Test
    void pilotKeyCreatesRealPaymentAndCompletionLocksEntireBalance() {
        var issued = keys.issue(profileId, MoneyEnvironment.PILOT_LIVE, "Checkout test");
        var webhookCipher = new WebhookSecretCipher("integration-test-encryption-secret");
        jdbc.update("""
            INSERT INTO webhook_endpoints (customer_id, environment, endpoint_url, signing_secret_hash,
                signing_secret_encrypted, secret_prefix)
            VALUES (?, 'pilot_live', 'https://merchant.example/webhooks/moneyflow', 'test-hash', ?, 'whsec_test')
            """, customerId, webhookCipher.encrypt("whsec_test_delivery_secret"));
        var command = new PaymentCollectionService.CreatePayment(10, "XAF", Provider.MTN_MOMO,
            "+237670000000", "ORDER-10", "Pilot checkout", Map.of("cartId", "CART-10"));
        var created = payments.create(issued.secret(), "idem-order-10", command);
        assertEquals("pending_customer", created.status());

        var retry = payments.create(issued.secret(), "idem-order-10", command);
        assertEquals(created.id(), retry.id());

        payments.reconcileProviderCallback(Provider.MTN_MOMO, created.id());
        assertEquals("completed", payments.get(issued.secret(), created.id()).status());
        assertEquals(10L, jdbc.queryForObject("SELECT balance_minor FROM wallets WHERE customer_id = ? AND environment = 'pilot_live'", Long.class, customerId));
        assertEquals(10L, jdbc.queryForObject("SELECT held_minor FROM wallets WHERE customer_id = ? AND environment = 'pilot_live'", Long.class, customerId));
        assertEquals(1, jdbc.queryForObject("SELECT COUNT(*) FROM webhook_events WHERE aggregate_id = ?", Integer.class, created.id()));
        assertEquals(1, jdbc.queryForObject("SELECT COUNT(*) FROM webhook_deliveries d JOIN webhook_events e ON e.id = d.event_id WHERE e.aggregate_id = ? AND d.status = 'pending'", Integer.class, created.id()));
    }

    @Test
    void pilotLimitsAndLiveKeyGateAreEnforced() {
        var issued = keys.issue(profileId, MoneyEnvironment.PILOT_LIVE, "Limits test");
        assertThrows(ResponseStatusException.class, () -> payments.create(issued.secret(), "too-large",
            new PaymentCollectionService.CreatePayment(1_001, "XAF", Provider.MTN_MOMO,
                "+237670000000", "ORDER-LARGE", null, Map.of())));
        assertThrows(ResponseStatusException.class, () -> keys.issue(profileId, MoneyEnvironment.LIVE, "Not approved"));
    }
}
