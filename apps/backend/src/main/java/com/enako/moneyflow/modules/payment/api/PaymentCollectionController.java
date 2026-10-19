package com.enako.moneyflow.modules.payment.api;

import com.enako.moneyflow.modules.payment.application.PaymentCollectionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentCollectionController {
    private final PaymentCollectionService service;
    public PaymentCollectionController(PaymentCollectionService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public PaymentCollectionService.PaymentView create(
        @RequestHeader(value = "Authorization", required = false) String authorization,
        @RequestHeader(value = "X-MoneyFlow-Key", required = false) String legacyKey,
        @RequestHeader("Idempotency-Key") String idempotencyKey,
        @Valid @RequestBody PaymentRequest request) {
        return service.create(secret(authorization, legacyKey), idempotencyKey,
            new PaymentCollectionService.CreatePayment(request.amount(), request.currency(), request.provider(),
                request.payer().phone(), request.merchantReference(), request.description(), request.metadata()));
    }

    @GetMapping("/{id}")
    public PaymentCollectionService.PaymentView get(
        @RequestHeader(value = "Authorization", required = false) String authorization,
        @RequestHeader(value = "X-MoneyFlow-Key", required = false) String legacyKey,
        @PathVariable UUID id) {
        return service.get(secret(authorization, legacyKey), id);
    }

    private String secret(String authorization, String legacyKey) {
        if (authorization != null && authorization.startsWith("Bearer ")) return authorization.substring(7).trim();
        if (legacyKey != null && !legacyKey.isBlank()) return legacyKey.trim();
        throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "MoneyFlow API key is required");
    }

    public record PaymentRequest(@Min(1) long amount, @NotBlank String currency,
        @NotNull com.enako.moneyflow.modules.payment.application.PaymentProviderGateway.Provider provider,
        @NotNull @Valid Payer payer, @NotBlank String merchantReference, String description,
        Map<String, Object> metadata) { }
    public record Payer(@NotBlank String phone) { }
}
