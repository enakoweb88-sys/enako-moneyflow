package com.enako.moneyflow.modules.platform.domain;

public enum MoneyEnvironment {
    SANDBOX("sandbox"), PILOT_LIVE("pilot_live"), LIVE("live");

    private final String value;
    MoneyEnvironment(String value) { this.value = value; }
    public String value() { return value; }

    public static MoneyEnvironment parse(String value) {
        for (MoneyEnvironment environment : values()) {
            if (environment.value.equalsIgnoreCase(value)) return environment;
        }
        throw new IllegalArgumentException("Unsupported MoneyFlow environment");
    }
}
