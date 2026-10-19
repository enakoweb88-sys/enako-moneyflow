package com.enako.moneyflow.modules.payment.api;

import com.enako.moneyflow.modules.payment.application.PaymentApiKeyService;
import com.enako.moneyflow.modules.platform.domain.MoneyEnvironment;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/developer/payment-keys")
public class PaymentApiKeyController {
    private final PaymentApiKeyService service;
    public PaymentApiKeyController(PaymentApiKeyService service) { this.service = service; }

    @GetMapping
    public List<PaymentApiKeyService.KeyView> list(@AuthenticationPrincipal Jwt jwt,
        @RequestParam(defaultValue = "pilot_live") String environment) {
        return service.list(subject(jwt), parse(environment));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentApiKeyService.IssuedKey issue(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody IssueRequest request) {
        return service.issue(subject(jwt), parse(request.environment()), request.label());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revoke(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id,
        @RequestParam(defaultValue = "pilot_live") String environment) {
        service.revoke(subject(jwt), parse(environment), id);
    }

    private UUID subject(Jwt jwt) { return UUID.fromString(jwt.getSubject()); }
    private MoneyEnvironment parse(String value) {
        MoneyEnvironment environment = MoneyEnvironment.parse(value);
        if (environment == MoneyEnvironment.SANDBOX) throw new IllegalArgumentException("Use the Sandbox key endpoint");
        return environment;
    }
    public record IssueRequest(String environment, String label) { }
}
