package com.enako.moneyflow.modules.wallet.api;

import com.enako.moneyflow.modules.wallet.application.WalletReadService;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/wallets")
public class WalletController {

    private final WalletReadService walletReadService;

    public WalletController(WalletReadService walletReadService) {
        this.walletReadService = walletReadService;
    }

    @GetMapping("/me")
    public WalletReadService.CustomerWallets customerWallets(@AuthenticationPrincipal Jwt jwt) {
        return walletReadService.customerWallets(UUID.fromString(jwt.getSubject()));
    }
}
