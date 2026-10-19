package com.enako.moneyflow.modules.payment.application;

import java.util.UUID;

/** Provider-specific implementations are supplied only after the provider contract is configured. */
public interface PaymentProviderGateway {
    boolean supports(Provider provider);
    InitiationResult initiate(InitiationCommand command);
    ProviderStatus status(String providerReference);

    enum Provider { MTN_MOMO, ORANGE_MONEY }
    record InitiationCommand(UUID paymentId, long amountMinor, String currency, String payerPhone,
        String merchantReference, String description) { }
    record InitiationResult(String providerReference, String status) { }
    record ProviderStatus(String providerReference, String status, String financialTransactionId, String reason) { }
}
