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
public class WebhookSecretCipher {
    private static final SecureRandom RANDOM = new SecureRandom();
    private final byte[] key;
    public WebhookSecretCipher(@Value("${app.security.data-encryption-secret:}") String secret) {
        if (secret == null || secret.length() < 24) { this.key = null; return; }
        try { this.key = MessageDigest.getInstance("SHA-256").digest(("webhooks:" + secret).getBytes(StandardCharsets.UTF_8)); }
        catch (Exception exception) { throw new IllegalStateException(exception); }
    }
    public String encrypt(String value) { return crypt(Cipher.ENCRYPT_MODE, value); }
    public String decrypt(String value) { return crypt(Cipher.DECRYPT_MODE, value); }
    private String crypt(int mode, String value) {
        if (key == null) throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Webhook encryption is not configured");
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            if (mode == Cipher.ENCRYPT_MODE) {
                byte[] nonce = new byte[12]; RANDOM.nextBytes(nonce);
                cipher.init(mode, new SecretKeySpec(key, "AES"), new GCMParameterSpec(128, nonce));
                byte[] encrypted = cipher.doFinal(value.getBytes(StandardCharsets.UTF_8));
                return Base64.getEncoder().encodeToString(ByteBuffer.allocate(nonce.length + encrypted.length).put(nonce).put(encrypted).array());
            }
            byte[] combined = Base64.getDecoder().decode(value);
            byte[] nonce = java.util.Arrays.copyOfRange(combined, 0, 12);
            byte[] encrypted = java.util.Arrays.copyOfRange(combined, 12, combined.length);
            cipher.init(mode, new SecretKeySpec(key, "AES"), new GCMParameterSpec(128, nonce));
            return new String(cipher.doFinal(encrypted), StandardCharsets.UTF_8);
        } catch (Exception exception) { throw new IllegalStateException("Webhook secret encryption failed", exception); }
    }
}
