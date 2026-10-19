package com.enako.moneyflow.modules.payment.api;

import com.enako.moneyflow.modules.payment.application.PaymentProviderRouter;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/developer/provider-readiness")
public class ProviderReadinessController {
    private final PaymentProviderRouter providers;
    public ProviderReadinessController(PaymentProviderRouter providers) { this.providers = providers; }
    @GetMapping public Map<String, Boolean> readiness() { return providers.readiness(); }
}
