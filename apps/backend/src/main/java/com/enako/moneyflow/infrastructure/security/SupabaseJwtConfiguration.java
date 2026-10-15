package com.enako.moneyflow.infrastructure.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;

/**
 * Configures verification of Supabase-issued access tokens only when an issuer is supplied.
 * This keeps local development and unconfigured deployments fail-closed for protected routes.
 */
@Configuration
@ConditionalOnProperty(prefix = "app.security.supabase", name = "enabled", havingValue = "true")
public class SupabaseJwtConfiguration {

    @Bean
    public JwtDecoder jwtDecoder(@Value("${app.security.supabase.issuer-uri}") String issuerUri) {
        return JwtDecoders.fromIssuerLocation(issuerUri);
    }
}
