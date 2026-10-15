package com.enako.moneyflow.modules.identity.api;

import com.enako.moneyflow.modules.identity.application.AuthenticatedUserService;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class CurrentUserController {

    private final AuthenticatedUserService authenticatedUserService;

    public CurrentUserController(AuthenticatedUserService authenticatedUserService) {
        this.authenticatedUserService = authenticatedUserService;
    }

    @GetMapping("/me")
    public AuthenticatedUserService.CurrentUser currentUser(@AuthenticationPrincipal Jwt jwt) {
        return authenticatedUserService.currentUser(UUID.fromString(jwt.getSubject()));
    }
}
