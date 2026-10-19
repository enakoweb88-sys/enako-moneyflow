package com.enako.moneyflow.modules.payment.api;

import com.enako.moneyflow.modules.payment.application.WebhookEndpointService;
import com.enako.moneyflow.modules.platform.domain.MoneyEnvironment;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/developer/webhook-endpoints")
public class WebhookEndpointController {
    private final WebhookEndpointService service;
    public WebhookEndpointController(WebhookEndpointService service) { this.service = service; }
    @GetMapping public List<WebhookEndpointService.EndpointView> list(@AuthenticationPrincipal Jwt jwt,
        @RequestParam(defaultValue = "pilot_live") String environment) {
        return service.list(UUID.fromString(jwt.getSubject()), MoneyEnvironment.parse(environment));
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public WebhookEndpointService.IssuedEndpoint create(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody CreateRequest request) {
        return service.create(UUID.fromString(jwt.getSubject()), MoneyEnvironment.parse(request.environment()), request.endpointUrl());
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
        service.delete(UUID.fromString(jwt.getSubject()), id);
    }
    @GetMapping("/deliveries")
    public List<WebhookEndpointService.DeliveryView> deliveries(@AuthenticationPrincipal Jwt jwt,
        @RequestParam(defaultValue = "pilot_live") String environment) {
        return service.deliveries(UUID.fromString(jwt.getSubject()), MoneyEnvironment.parse(environment));
    }
    public record CreateRequest(@NotBlank String environment, @NotBlank String endpointUrl) { }
}
