package com.enako.moneyflow.modules.platform.application;

import com.enako.moneyflow.modules.platform.domain.MoneyEnvironment;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EnvironmentAccessPolicy {
    public void assertAccessible(UUID profileId, MoneyEnvironment environment) {
        if (environment == MoneyEnvironment.LIVE) {
            throw new ResponseStatusException(HttpStatus.LOCKED, "Live account access has not been approved");
        }
    }
}
