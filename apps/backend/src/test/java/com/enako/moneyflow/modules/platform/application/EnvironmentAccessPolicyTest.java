package com.enako.moneyflow.modules.platform.application;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.enako.moneyflow.modules.platform.domain.MoneyEnvironment;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class EnvironmentAccessPolicyTest {
    private final EnvironmentAccessPolicy policy = new EnvironmentAccessPolicy();
    private final UUID profileId = UUID.randomUUID();

    @Test
    void sandboxIsAccessible() {
        assertDoesNotThrow(() -> policy.assertAccessible(profileId, MoneyEnvironment.SANDBOX));
    }

    @Test
    void liveRemainsServerLockedUntilEligibilityIsImplemented() {
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
            () -> policy.assertAccessible(profileId, MoneyEnvironment.LIVE));
        assertEquals(HttpStatus.LOCKED, error.getStatusCode());
    }
}
