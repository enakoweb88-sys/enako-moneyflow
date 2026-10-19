package com.enako.moneyflow.modules.wallet.api;

import com.enako.moneyflow.modules.wallet.application.WalletReadService;
import com.enako.moneyflow.modules.platform.domain.MoneyEnvironment;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/wallets")
public class WalletController {

    private final WalletReadService walletReadService;

    public WalletController(WalletReadService walletReadService) {
        this.walletReadService = walletReadService;
    }

    @GetMapping("/me")
    public WalletReadService.CustomerWallets customerWallets(@AuthenticationPrincipal Jwt jwt,
            @RequestHeader(value = "X-MoneyFlow-Environment", defaultValue = "sandbox") String environment) {
        try {
            return walletReadService.customerWallets(UUID.fromString(jwt.getSubject()), MoneyEnvironment.parse(environment));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage(), exception);
        }
    }
}
