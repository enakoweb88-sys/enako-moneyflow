package com.enako.moneyflow.modules.platform.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class MoneyEnvironmentTest {
    @Test
    void parsesKnownEnvironmentCaseInsensitively() {
        assertEquals(MoneyEnvironment.SANDBOX, MoneyEnvironment.parse("Sandbox"));
        assertEquals(MoneyEnvironment.LIVE, MoneyEnvironment.parse("live"));
    }

    @Test
    void rejectsUnknownEnvironment() {
        assertThrows(IllegalArgumentException.class, () -> MoneyEnvironment.parse("production"));
    }
}
