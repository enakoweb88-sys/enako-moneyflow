package com.enako.moneyflow.modules.platform.api;

import com.enako.moneyflow.modules.platform.application.SandboxApiKeyService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/developer/keys")
public class DeveloperApiKeyController {
    private final SandboxApiKeyService service;
    public DeveloperApiKeyController(SandboxApiKeyService service) { this.service = service; }
    @GetMapping public List<SandboxApiKeyService.KeyView> list(@AuthenticationPrincipal Jwt jwt) {
        return service.list(UUID.fromString(jwt.getSubject()));
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public SandboxApiKeyService.IssuedKey issue(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody IssueRequest request) {
        return service.issue(UUID.fromString(jwt.getSubject()), request.label());
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revoke(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
        service.revoke(UUID.fromString(jwt.getSubject()), id);
    }
    public record IssueRequest(String label) { }
}
