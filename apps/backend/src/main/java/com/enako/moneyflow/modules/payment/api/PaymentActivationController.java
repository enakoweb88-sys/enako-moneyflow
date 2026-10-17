package com.enako.moneyflow.modules.payment.api;

import com.enako.moneyflow.modules.payment.application.PaymentActivationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payment-activations/me")
public class PaymentActivationController {
    private final PaymentActivationService service;
    public PaymentActivationController(PaymentActivationService service) { this.service = service; }
    @GetMapping public PaymentActivationService.ActivationRequest latest(@AuthenticationPrincipal Jwt jwt) { return service.latestFor(id(jwt)); }
    @PutMapping public PaymentActivationService.ActivationRequest save(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody SaveRequest request) { return service.saveDraft(id(jwt), request.toDraft()); }
    @PostMapping("/submit") public PaymentActivationService.ActivationRequest submit(@AuthenticationPrincipal Jwt jwt) { return service.submit(id(jwt)); }
    private UUID id(Jwt jwt) { return UUID.fromString(jwt.getSubject()); }
    public record SaveRequest(@NotBlank @Size(max=40) String businessUse,@NotBlank @Pattern(regexp="[A-Z]{2}") String businessCountry,@NotBlank @Size(max=40) String organisationType,@NotBlank @Size(max=200) String legalBusinessName,@NotBlank @Size(max=200) String representativeName,@NotBlank @Email @Size(max=320) String representativeEmail,@Size(max=32) String representativePhone,@NotBlank @Size(max=120) String representativeRole,@NotBlank @Pattern(regexp="[A-Z]{3}") String settlementCurrency,@Size(max=40) String expectedMonthlyVolume,@NotEmpty List<@Pattern(regexp="mtn_momo|orange_money|bank_settlement") String> channels) { PaymentActivationService.ActivationDraft toDraft() { return new PaymentActivationService.ActivationDraft(businessUse,businessCountry,organisationType,legalBusinessName,representativeName,representativeEmail,representativePhone,representativeRole,settlementCurrency,expectedMonthlyVolume,channels); } }
}
