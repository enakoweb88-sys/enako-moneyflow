package com.enako.moneyflow.modules.platform.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.UUID;
import com.enako.moneyflow.infrastructure.security.AccountReferenceCipher;
import com.enako.moneyflow.modules.platform.domain.MoneyEnvironment;
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
class SandboxSimulationServiceIntegrationTest {
    @Container
    private static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
        .withDatabaseName("moneyflow").withUsername("postgres").withPassword("postgres")
        .withInitScript("supabase-auth-stub.sql");
    private JdbcTemplate jdbc;
    private SandboxSimulationService service;
    private UUID profileId;
    private UUID customerId;

    @BeforeAll
    void setUp() {
        var dataSource = new DriverManagerDataSource(postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword());
        Flyway.configure().dataSource(dataSource).locations("classpath:db/migration").load().migrate();
        jdbc = new JdbcTemplate(dataSource);
        service = new SandboxSimulationService(new NamedParameterJdbcTemplate(dataSource));
        profileId = UUID.randomUUID();
        customerId = UUID.randomUUID();
        jdbc.update("INSERT INTO auth.users (id, email) VALUES (?, ?)", profileId, "sandbox@enako.test");
        jdbc.update("INSERT INTO profiles (id, email, display_name) VALUES (?, ?, ?)", profileId, "sandbox@enako.test", "Sandbox User");
        jdbc.update("INSERT INTO customers (id, profile_id, customer_number) VALUES (?, ?, ?)", customerId, profileId, "CUS-SANDBOX");
        jdbc.update("INSERT INTO wallets (customer_id, environment, currency, balance_minor) VALUES (?, 'live', 'XAF', 777)", customerId);
    }

    @Test
    void resetAndScenariosAffectOnlySandbox() {
        var reset = service.reset(profileId, 1_000_000);
        assertEquals(1_000_000, reset.balanceMinor());
        assertEquals(2, reset.beneficiaryCount());
        assertEquals(777L, jdbc.queryForObject("SELECT balance_minor FROM wallets WHERE customer_id = ? AND environment = 'live'", Long.class, customerId));

        var deposit = service.simulate(profileId, SandboxSimulationService.Scenario.DEPOSIT_COMPLETED, 100_000);
        assertEquals("completed", deposit.status());
        assertEquals(1_100_000, deposit.balanceMinor());

        var pending = service.simulate(profileId, SandboxSimulationService.Scenario.WITHDRAWAL_PENDING, 50_000);
        assertEquals("pending", pending.status());
        assertEquals(1_100_000, pending.balanceMinor());

        var failed = service.simulate(profileId, SandboxSimulationService.Scenario.WITHDRAWAL_FAILED, 50_000);
        assertEquals("failed", failed.status());
        assertEquals(1_100_000, failed.balanceMinor());

        var withdrawal = service.simulate(profileId, SandboxSimulationService.Scenario.WITHDRAWAL_COMPLETED, 200_000);
        assertEquals(900_000, withdrawal.balanceMinor());
        var snapshot = service.state(profileId);
        assertEquals(true, snapshot.initialized());
        assertEquals(900_000, snapshot.balanceMinor());
        assertEquals(900_000, snapshot.availableMinor());
        assertEquals(2, snapshot.beneficiaries().size());
        assertEquals(4, snapshot.movements().size());
        assertEquals(2, jdbc.queryForObject("SELECT COUNT(*) FROM ledger_entries WHERE customer_id = ? AND environment = 'sandbox'", Integer.class, customerId));
        assertEquals(0, jdbc.queryForObject("SELECT COUNT(*) FROM ledger_entries WHERE customer_id = ? AND environment = 'live'", Integer.class, customerId));
    }

    @Test
    void completedWithdrawalCannotOverdrawSandbox() {
        service.reset(profileId, 10_000);
        assertThrows(ResponseStatusException.class,
            () -> service.simulate(profileId, SandboxSimulationService.Scenario.WITHDRAWAL_COMPLETED, 10_001));
    }

    @Test
    void beneficiariesPersistWithEncryptionAndEnvironmentIsolation() {
        service.reset(profileId, 100_000);
        var beneficiaryService = new BeneficiaryService(new NamedParameterJdbcTemplate(jdbc.getDataSource()),
            new AccountReferenceCipher("integration-test-encryption-secret"));
        var live = beneficiaryService.create(profileId, MoneyEnvironment.LIVE, "Live Recipient",
            "MTN Mobile Money", "237670123456");
        var sandbox = beneficiaryService.create(profileId, MoneyEnvironment.SANDBOX, "Test Recipient",
            "Orange Money", "237690654321");

        assertEquals("cooldown", live.status());
        assertEquals("active", sandbox.status());
        assertEquals(3, beneficiaryService.list(profileId, MoneyEnvironment.SANDBOX).size());
        assertEquals(1, beneficiaryService.list(profileId, MoneyEnvironment.LIVE).size());
        String encrypted = jdbc.queryForObject("SELECT account_reference_encrypted FROM beneficiaries WHERE id = ?",
            String.class, sandbox.id());
        assertEquals(false, "237690654321".equals(encrypted));
        beneficiaryService.delete(profileId, MoneyEnvironment.SANDBOX, sandbox.id());
        assertEquals(2, beneficiaryService.list(profileId, MoneyEnvironment.SANDBOX).size());
    }

    @Test
    void sandboxKeysAuthenticateAndPaymentsAreIdempotent() {
        service.reset(profileId, 100_000);
        var keys = new SandboxApiKeyService(new NamedParameterJdbcTemplate(jdbc.getDataSource()));
        var issued = keys.issue(profileId, "Integration key");
        assertEquals(profileId, keys.authenticate(issued.secret()).profileId());
        var first = service.simulate(profileId, SandboxSimulationService.Scenario.DEPOSIT_COMPLETED, 10, "order-1001");
        var retry = service.simulate(profileId, SandboxSimulationService.Scenario.DEPOSIT_COMPLETED, 10, "order-1001");
        assertEquals(first.movementId(), retry.movementId());
        assertEquals(1, jdbc.queryForObject("SELECT COUNT(*) FROM money_movements WHERE customer_id = ? AND environment = 'sandbox' AND idempotency_key = 'order-1001'", Integer.class, customerId));
        assertThrows(ResponseStatusException.class,
            () -> service.simulate(profileId, SandboxSimulationService.Scenario.DEPOSIT_COMPLETED, 11, "order-1001"));
        keys.revoke(profileId, issued.id());
        assertThrows(ResponseStatusException.class, () -> keys.authenticate(issued.secret()));
    }
}
