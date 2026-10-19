package com.enako.moneyflow.infrastructure.security;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class AccountReferenceCipher {
    private static final SecureRandom RANDOM = new SecureRandom();
    private final String secret;

    public AccountReferenceCipher(@Value("${app.security.data-encryption-secret:}") String secret) {
        this.secret = secret;
    }

    public String encrypt(String value) {
        if (secret == null || secret.length() < 24) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                "Beneficiary encryption is not configured for this environment");
        }
        try {
            byte[] nonce = new byte[12];
            RANDOM.nextBytes(nonce);
            byte[] key = MessageDigest.getInstance("SHA-256").digest(secret.getBytes(StandardCharsets.UTF_8));
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(key, "AES"), new GCMParameterSpec(128, nonce));
            byte[] encrypted = cipher.doFinal(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(ByteBuffer.allocate(nonce.length + encrypted.length)
                .put(nonce).put(encrypted).array());
        } catch (Exception exception) {
            throw new IllegalStateException("Beneficiary reference encryption failed", exception);
        }
    }
}
