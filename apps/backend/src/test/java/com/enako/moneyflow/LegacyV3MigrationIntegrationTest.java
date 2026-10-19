package com.enako.moneyflow;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.nio.charset.StandardCharsets;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.testcontainers.containers.PostgreSQLContainer;

class LegacyV3MigrationIntegrationTest {
    @Test
    void adoptsMatchingUntrackedV3ObjectsAndContinuesThroughLatestMigration() throws Exception {
        try (PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("moneyflow")
            .withUsername("postgres")
            .withPassword("postgres")
            .withInitScript("supabase-auth-stub.sql")) {
            postgres.start();
            DriverManagerDataSource dataSource = new DriverManagerDataSource(
                postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword());
            Flyway.configure().dataSource(dataSource).locations("classpath:db/migration")
                .target("2").load().migrate();

            String legacySql = new String(
                new ClassPathResource("legacy-v3-untracked.sql").getInputStream().readAllBytes(),
                StandardCharsets.UTF_8);
            JdbcTemplate jdbc = new JdbcTemplate(dataSource);
            jdbc.execute(legacySql);

            Flyway.configure().dataSource(dataSource).locations("classpath:db/migration").load().migrate();

            assertEquals("8", jdbc.queryForObject(
                "SELECT version FROM flyway_schema_history WHERE success ORDER BY installed_rank DESC LIMIT 1",
                String.class));
            assertEquals(1, jdbc.queryForObject(
                "SELECT COUNT(*) FROM flyway_schema_history WHERE version = '3' AND success",
                Integer.class));
        }
    }
}
