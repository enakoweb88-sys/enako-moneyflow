package com.enako.moneyflow.modules.customer.api;

import com.enako.moneyflow.modules.customer.application.CustomerReadService;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
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
}
