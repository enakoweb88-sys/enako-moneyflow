package com.enako.moneyflow.modules.customer.api;

import com.enako.moneyflow.modules.customer.application.CustomerReadService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerProfileController {

    private final CustomerReadService customerReadService;

    public CustomerProfileController(CustomerReadService customerReadService) {
        this.customerReadService = customerReadService;
    }

    @GetMapping("/me")
    public CustomerReadService.CustomerProfile customerProfile(@AuthenticationPrincipal Jwt jwt) {
        return customerReadService.customerProfile(UUID.fromString(jwt.getSubject()));
    }

    @PostMapping("/me/onboarding")
    public CustomerReadService.CustomerProfile createCustomerProfile(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody OnboardingRequest request
    ) {
        String email = jwt.getClaimAsString("email");
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("The authenticated account does not include an email address");
        }
        return customerReadService.createCustomerProfile(
            UUID.fromString(jwt.getSubject()),
            email,
            request.displayName(),
            request.phoneE164()
        );
    }

    public record OnboardingRequest(
        @NotBlank @Size(max = 200) String displayName,
        @Size(max = 32) String phoneE164
    ) { }
}
