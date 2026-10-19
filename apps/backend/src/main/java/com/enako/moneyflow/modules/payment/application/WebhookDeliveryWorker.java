package com.enako.moneyflow.modules.payment.application;

import com.enako.moneyflow.infrastructure.security.WebhookSecretCipher;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

@Service
@ConditionalOnProperty(name = "app.payments.webhooks.delivery-enabled", havingValue = "true", matchIfMissing = true)
public class WebhookDeliveryWorker {
    private static final long[] RETRY_SECONDS = {60, 300, 1_800, 7_200, 28_800, 86_400};
    private final NamedParameterJdbcTemplate jdbc;
    private final RestClient client;
    private final WebhookSecretCipher cipher;
    private final WebhookEndpointService endpointService;

    public WebhookDeliveryWorker(NamedParameterJdbcTemplate jdbc, RestClient.Builder builder,
        WebhookSecretCipher cipher, WebhookEndpointService endpointService) {
        this.jdbc = jdbc; this.client = builder.build(); this.cipher = cipher; this.endpointService = endpointService;
    }

    @Scheduled(fixedDelayString = "${app.payments.webhooks.worker-delay-ms:15000}")
    @Transactional
    public void deliverDue() {
        var deliveries = jdbc.query("""
            SELECT d.id, d.attempt_count, e.id event_id, e.event_type, e.payload_json::text payload,
                   w.endpoint_url, w.signing_secret_encrypted
            FROM webhook_deliveries d
            JOIN webhook_events e ON e.id = d.event_id
            JOIN webhook_endpoints w ON w.id = d.endpoint_id
            WHERE d.status IN ('pending', 'retry') AND d.next_attempt_at <= CURRENT_TIMESTAMP
              AND w.enabled AND w.signing_secret_encrypted IS NOT NULL
            ORDER BY d.next_attempt_at ASC
            LIMIT 20 FOR UPDATE OF d SKIP LOCKED
            """, new MapSqlParameterSource(), (rs, row) -> new Delivery(
                rs.getObject("id", UUID.class), rs.getInt("attempt_count"), rs.getObject("event_id", UUID.class),
                rs.getString("event_type"), rs.getString("payload"), rs.getString("endpoint_url"),
                rs.getString("signing_secret_encrypted")));
        for (Delivery delivery : deliveries) deliver(delivery);
    }

    private void deliver(Delivery delivery) {
        int nextAttempt = delivery.attemptCount() + 1;
        try {
            endpointService.validatePublicHttps(delivery.endpointUrl());
            long timestamp = Instant.now().getEpochSecond();
            String signature = "v1=" + sign(cipher.decrypt(delivery.encryptedSecret()), timestamp + "." + delivery.payload());
            Result result = client.post().uri(delivery.endpointUrl()).contentType(MediaType.APPLICATION_JSON)
                .header("MoneyFlow-Event-Id", delivery.eventId().toString())
                .header("MoneyFlow-Event-Type", delivery.eventType())
                .header("MoneyFlow-Timestamp", Long.toString(timestamp))
                .header("MoneyFlow-Signature", signature)
                .body(delivery.payload()).exchange((request, response) -> new Result(
                    response.getStatusCode().value(), excerpt(new String(response.getBody().readAllBytes(), StandardCharsets.UTF_8))));
            if (result.status() >= 200 && result.status() < 300) {
                jdbc.update("""
                    UPDATE webhook_deliveries SET status = 'succeeded', attempt_count = :attempt,
                        last_http_status = :status, response_body_excerpt = :body, delivered_at = CURRENT_TIMESTAMP,
                        updated_at = CURRENT_TIMESTAMP WHERE id = :id
                    """, deliveryParams(delivery.id(), nextAttempt).addValue("status", result.status()).addValue("body", result.body()));
            } else scheduleRetry(delivery.id(), nextAttempt, result.status(), "Endpoint returned HTTP " + result.status(), result.body());
        } catch (Exception exception) {
            scheduleRetry(delivery.id(), nextAttempt, null, safeMessage(exception), null);
        }
    }

    private void scheduleRetry(UUID id, int attempt, Integer httpStatus, String error, String body) {
        boolean exhausted = attempt >= RETRY_SECONDS.length;
        long seconds = RETRY_SECONDS[Math.min(attempt - 1, RETRY_SECONDS.length - 1)];
        jdbc.update("""
            UPDATE webhook_deliveries SET status = :status, attempt_count = :attempt,
                next_attempt_at = CURRENT_TIMESTAMP + (:seconds * INTERVAL '1 second'),
                last_http_status = :httpStatus, last_error = :error, response_body_excerpt = :body,
                updated_at = CURRENT_TIMESTAMP WHERE id = :id
            """, deliveryParams(id, attempt).addValue("status", exhausted ? "failed" : "retry")
            .addValue("seconds", seconds).addValue("httpStatus", httpStatus).addValue("error", error).addValue("body", body));
    }

    private MapSqlParameterSource deliveryParams(UUID id, int attempt) {
        return new MapSqlParameterSource().addValue("id", id).addValue("attempt", attempt);
    }
    private String sign(String secret, String message) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return HexFormat.of().formatHex(mac.doFinal(message.getBytes(StandardCharsets.UTF_8)));
    }
    private static String excerpt(String value) { return value == null ? null : value.substring(0, Math.min(500, value.length())); }
    private static String safeMessage(Exception exception) {
        String value = exception.getMessage() == null ? exception.getClass().getSimpleName() : exception.getMessage();
        return excerpt(value);
    }
    private record Delivery(UUID id, int attemptCount, UUID eventId, String eventType, String payload,
        String endpointUrl, String encryptedSecret) { }
    private record Result(int status, String body) { }
}
