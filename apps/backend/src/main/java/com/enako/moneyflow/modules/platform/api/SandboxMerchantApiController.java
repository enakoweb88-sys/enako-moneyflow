package com.enako.moneyflow.modules.platform.api;

import com.enako.moneyflow.modules.platform.application.SandboxApiKeyService;
import com.enako.moneyflow.modules.platform.application.SandboxSimulationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sandbox-api")
public class SandboxMerchantApiController {
    private final SandboxApiKeyService keys;
    private final SandboxSimulationService sandbox;
    public SandboxMerchantApiController(SandboxApiKeyService keys, SandboxSimulationService sandbox) {
        this.keys = keys; this.sandbox = sandbox;
    }
    @PostMapping("/payments")
    public SandboxSimulationService.SimulationResult create(
        @RequestHeader("X-MoneyFlow-Key") String key,
        @RequestHeader("Idempotency-Key") String idempotencyKey,
        @Valid @RequestBody PaymentRequest request) {
        var principal = keys.authenticate(key);
        return sandbox.simulate(principal.profileId(), request.outcome().scenario(), request.amountMinor(), idempotencyKey);
    }
    @GetMapping("/payments/{id}")
    public SandboxSimulationService.SimulationResult status(@RequestHeader("X-MoneyFlow-Key") String key,
        @PathVariable UUID id) {
        var principal = keys.authenticate(key);
        return sandbox.payment(principal.profileId(), id);
    }
    public record PaymentRequest(@Min(1) @Max(100_000_000) long amountMinor, @NotNull Outcome outcome,
        String customerReference) { }
    public enum Outcome {
        SUCCESS, PENDING, FAILED;
        SandboxSimulationService.Scenario scenario() {
            return switch (this) {
                case SUCCESS -> SandboxSimulationService.Scenario.DEPOSIT_COMPLETED;
                case PENDING -> SandboxSimulationService.Scenario.DEPOSIT_PENDING;
                case FAILED -> SandboxSimulationService.Scenario.DEPOSIT_FAILED;
            };
        }
    }
}
