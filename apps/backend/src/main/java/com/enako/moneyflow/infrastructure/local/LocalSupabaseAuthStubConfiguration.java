package com.enako.moneyflow.infrastructure.local;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Mirrors identities from verified Supabase JWTs into the plain-PostgreSQL
 * auth.users stub. Managed environments never load this local-only component.
 */
@Component
@Profile("local")
public class LocalSupabaseAuthStubConfiguration implements ApplicationRunner {
    private final JdbcTemplate jdbc;

    public LocalSupabaseAuthStubConfiguration(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(ApplicationArguments arguments) {
        jdbc.execute("""
            CREATE OR REPLACE FUNCTION public.moneyflow_local_mirror_auth_user()
            RETURNS TRIGGER
            LANGUAGE plpgsql
            AS $function$
            BEGIN
                INSERT INTO auth.users (id, email)
                VALUES (NEW.id, NEW.email)
                ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
                RETURN NEW;
            END;
            $function$
            """);
        jdbc.execute("DROP TRIGGER IF EXISTS moneyflow_local_mirror_auth_user ON public.profiles");
        jdbc.execute("""
            CREATE TRIGGER moneyflow_local_mirror_auth_user
            BEFORE INSERT ON public.profiles
            FOR EACH ROW EXECUTE FUNCTION public.moneyflow_local_mirror_auth_user()
            """);
    }
}
