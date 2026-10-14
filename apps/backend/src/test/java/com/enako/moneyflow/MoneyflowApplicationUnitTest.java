package com.enako.moneyflow;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MoneyflowApplicationUnitTest {

    @Test
    void applicationDeclaresItsExpectedName() {
        assertEquals("MoneyflowApplication", MoneyflowApplication.class.getSimpleName());
    }
}
