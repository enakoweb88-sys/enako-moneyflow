package com.enako.moneyflow.modules.platform.api;

import com.enako.moneyflow.modules.platform.application.BeneficiaryService;
import com.enako.moneyflow.modules.platform.domain.MoneyEnvironment;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/beneficiaries")
public class BeneficiaryController {
    private final BeneficiaryService service;
    public BeneficiaryController(BeneficiaryService service) { this.service = service; }

    @GetMapping
    public List<BeneficiaryService.BeneficiaryView> list(@AuthenticationPrincipal Jwt jwt,
        @RequestHeader(value = "X-MoneyFlow-Environment", defaultValue = "sandbox") String environment) {
        return service.list(UUID.fromString(jwt.getSubject()), MoneyEnvironment.parse(environment));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BeneficiaryService.BeneficiaryView create(@AuthenticationPrincipal Jwt jwt,
        @RequestHeader(value = "X-MoneyFlow-Environment", defaultValue = "sandbox") String environment,
        @Valid @RequestBody CreateBeneficiaryRequest request) {
        return service.create(UUID.fromString(jwt.getSubject()), MoneyEnvironment.parse(environment),
            request.displayName(), request.provider(), request.accountReference());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal Jwt jwt,
        @RequestHeader(value = "X-MoneyFlow-Environment", defaultValue = "sandbox") String environment,
        @PathVariable UUID id) {
        service.delete(UUID.fromString(jwt.getSubject()), MoneyEnvironment.parse(environment), id);
    }

    public record CreateBeneficiaryRequest(@NotBlank String displayName, @NotBlank String provider,
        @NotBlank String accountReference) { }
}
