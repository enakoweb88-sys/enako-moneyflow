package com.enako.moneyflow.modules.payment.api;

import com.enako.moneyflow.modules.payment.application.PaymentCollectionService;
import com.enako.moneyflow.modules.payment.application.PaymentProviderGateway.Provider;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/provider-callbacks")
public class ProviderCallbackController {
    private final PaymentCollectionService payments;
    public ProviderCallbackController(PaymentCollectionService payments) { this.payments = payments; }

    @RequestMapping(path = "/mtn/{paymentId}", method = {RequestMethod.POST, RequestMethod.PUT})
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void mtn(@PathVariable UUID paymentId) {
        // MTN's callback is only a wake-up signal. The service independently queries MTN before changing funds.
        payments.reconcileProviderCallback(Provider.MTN_MOMO, paymentId);
    }
}
