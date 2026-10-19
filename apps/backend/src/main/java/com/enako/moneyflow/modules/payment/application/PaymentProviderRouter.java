package com.enako.moneyflow.modules.payment.application;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PaymentProviderRouter {
    private final List<PaymentProviderGateway> gateways;
    public PaymentProviderRouter(List<PaymentProviderGateway> gateways) { this.gateways = gateways; }

    public PaymentProviderGateway gateway(PaymentProviderGateway.Provider provider) {
        return gateways.stream().filter(candidate -> candidate.supports(provider)).findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                provider + " collections are not configured on this MoneyFlow server"));
    }

    public boolean configured(PaymentProviderGateway.Provider provider) {
        return gateways.stream().anyMatch(candidate -> candidate.supports(provider));
    }

    public Map<String, Boolean> readiness() {
        return Map.of(
            "mtnMomo", configured(PaymentProviderGateway.Provider.MTN_MOMO),
            "orangeMoney", configured(PaymentProviderGateway.Provider.ORANGE_MONEY));
    }
}
