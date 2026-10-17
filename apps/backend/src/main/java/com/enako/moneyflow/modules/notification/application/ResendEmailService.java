package com.enako.moneyflow.modules.notification.application;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/** Sends operational email only when a server-side Resend key and sender are configured. */
@Service
public class ResendEmailService {
    private static final Logger log = LoggerFactory.getLogger(ResendEmailService.class);
    private final String apiKey;
    private final String from;
    private final String replyTo;
    private final RestTemplate http;

    public ResendEmailService(
        @Value("${app.email.resend.api-key:}") String apiKey,
        @Value("${app.email.resend.from:}") String from,
        @Value("${app.email.resend.reply-to:}") String replyTo,
        RestTemplateBuilder restTemplateBuilder
    ) {
        this.apiKey = apiKey;
        this.from = from;
        this.replyTo = replyTo;
        this.http = restTemplateBuilder.build();
    }

    public void paymentActivationSubmitted(String recipient, String businessName) {
        if (apiKey.isBlank() || from.isBlank()) {
            log.info("Payment activation confirmation email skipped: Resend is not configured");
            return;
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> body = Map.of(
            "from", from,
            "to", new String[] {recipient},
            "reply_to", replyTo.isBlank() ? from : replyTo,
            "subject", "We received your E-NAKO MoneyFlow payment activation request",
            "html", "<p>Hello,</p><p>We received the payment activation request for <strong>"
                + escape(businessName) + "</strong>.</p><p>Our team will review it before enabling any payment channels or credentials.</p>"
        );
        try {
            http.postForEntity("https://api.resend.com/emails", new HttpEntity<>(body, headers), Void.class);
        } catch (RestClientException exception) {
            // Email delivery must not undo a successfully recorded customer request.
            log.warn("Payment activation confirmation email could not be sent", exception);
        }
    }

    private String escape(String value) {
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
