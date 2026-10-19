package com.enako.moneyflow.modules.platform.api;

import com.enako.moneyflow.modules.platform.application.SandboxSimulationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/sandbox")
public class SandboxController {
    private final SandboxSimulationService service;
    public SandboxController(SandboxSimulationService service) { this.service = service; }

    @GetMapping("/state")
    public SandboxSimulationService.SandboxSnapshot state(@AuthenticationPrincipal Jwt jwt) {
        return service.state(UUID.fromString(jwt.getSubject()));
    }

    @PostMapping("/reset")
    public SandboxSimulationService.SandboxState reset(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody ResetRequest request) {
        return service.reset(UUID.fromString(jwt.getSubject()), request.openingBalanceMinor());
    }

    @PostMapping("/simulate")
    public SandboxSimulationService.SimulationResult simulate(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody SimulateRequest request) {
        return service.simulate(UUID.fromString(jwt.getSubject()), request.scenario(), request.amountMinor());
    }

    public record ResetRequest(@Min(0) @Max(100_000_000) long openingBalanceMinor) { }
    public record SimulateRequest(@NotNull SandboxSimulationService.Scenario scenario,
        @Min(1) @Max(100_000_000) long amountMinor) { }
}
