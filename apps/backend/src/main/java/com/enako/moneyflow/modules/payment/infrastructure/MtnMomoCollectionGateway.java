package com.enako.moneyflow.modules.payment.infrastructure;

import com.enako.moneyflow.modules.payment.application.PaymentProviderGateway;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Component
@ConditionalOnProperty(name = "app.payments.providers.mtn.enabled", havingValue = "true")
public class MtnMomoCollectionGateway implements PaymentProviderGateway {
    private final RestClient client;
    private final String subscriptionKey;
    private final String apiUser;
    private final String apiKey;
    private final String targetEnvironment;
    private final String callbackBaseUrl;

    public MtnMomoCollectionGateway(RestClient.Builder builder,
        @Value("${app.payments.providers.mtn.base-url}") String baseUrl,
        @Value("${app.payments.providers.mtn.subscription-key}") String subscriptionKey,
        @Value("${app.payments.providers.mtn.api-user}") String apiUser,
        @Value("${app.payments.providers.mtn.api-key}") String apiKey,
        @Value("${app.payments.providers.mtn.target-environment:mtncameroon}") String targetEnvironment,
        @Value("${app.payments.providers.mtn.callback-base-url}") String callbackBaseUrl) {
        require("MTN base URL", baseUrl); require("MTN subscription key", subscriptionKey);
        require("MTN API user", apiUser); require("MTN API key", apiKey); require("MTN callback URL", callbackBaseUrl);
        this.client = builder.baseUrl(stripTrailingSlash(baseUrl)).build();
        this.subscriptionKey = subscriptionKey; this.apiUser = apiUser; this.apiKey = apiKey;
        this.targetEnvironment = targetEnvironment; this.callbackBaseUrl = stripTrailingSlash(callbackBaseUrl);
    }

    @Override public boolean supports(Provider provider) { return provider == Provider.MTN_MOMO; }

    @Override
    public InitiationResult initiate(InitiationCommand command) {
        String reference = command.paymentId().toString();
        String token = token();
        client.post().uri("/collection/v1_0/requesttopay")
            .header("Ocp-Apim-Subscription-Key", subscriptionKey)
            .header("X-Target-Environment", targetEnvironment)
            .header("X-Reference-Id", reference)
            .header("X-Callback-Url", callbackBaseUrl + "/" + command.paymentId())
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .body(Map.of(
                "amount", BigDecimal.valueOf(command.amountMinor()).toPlainString(),
                "currency", command.currency(),
                "externalId", command.merchantReference(),
                "payer", Map.of("partyIdType", "MSISDN", "partyId", normalizePhone(command.payerPhone())),
                "payerMessage", safeText(command.description(), "MoneyFlow payment"),
                "payeeNote", command.merchantReference()))
            .retrieve().toBodilessEntity();
        return new InitiationResult(reference, "pending_customer");
    }

    @Override
    public ProviderStatus status(String providerReference) {
        MtnStatus response = client.get().uri("/collection/v1_0/requesttopay/{reference}", providerReference)
            .header("Ocp-Apim-Subscription-Key", subscriptionKey)
            .header("X-Target-Environment", targetEnvironment)
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + token())
            .retrieve().body(MtnStatus.class);
        if (response == null || response.status() == null)
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "MTN returned an invalid payment status");
        return new ProviderStatus(providerReference, response.status(), response.financialTransactionId(),
            response.reason() == null ? null : response.reason().message());
    }

    private String token() {
        String basic = Base64.getEncoder().encodeToString((apiUser + ":" + apiKey).getBytes(StandardCharsets.UTF_8));
        TokenResponse response = client.post().uri("/collection/token/")
            .header("Ocp-Apim-Subscription-Key", subscriptionKey)
            .header(HttpHeaders.AUTHORIZATION, "Basic " + basic)
            .contentType(MediaType.APPLICATION_JSON).retrieve().body(TokenResponse.class);
        if (response == null || response.accessToken() == null || response.accessToken().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "MTN did not return an access token");
        return response.accessToken();
    }

    private static String normalizePhone(String phone) { return phone.startsWith("+") ? phone.substring(1) : phone; }
    private static String safeText(String value, String fallback) {
        String result = value == null || value.isBlank() ? fallback : value.trim();
        return result.substring(0, Math.min(160, result.length()));
    }
    private static String stripTrailingSlash(String value) { return value.endsWith("/") ? value.substring(0, value.length() - 1) : value; }
    private static void require(String name, String value) {
        if (value == null || value.isBlank()) throw new IllegalStateException(name + " must be configured when MTN collections are enabled");
    }

    private record TokenResponse(@JsonProperty("access_token") String accessToken, @JsonProperty("token_type") String tokenType,
        @JsonProperty("expires_in") long expiresIn) { }
    private record MtnStatus(String financialTransactionId, String externalId, String amount, String currency,
        Payer payer, String payerMessage, String payeeNote, String status, Reason reason) { }
    private record Payer(String partyIdType, String partyId) { }
    private record Reason(String code, String message) { }
}
