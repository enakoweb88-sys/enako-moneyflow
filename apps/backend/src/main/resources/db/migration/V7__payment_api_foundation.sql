CREATE TYPE payment_provider AS ENUM ('mtn_momo', 'orange_money');
CREATE TYPE payment_intent_status AS ENUM (
    'created', 'pending_customer', 'processing', 'completed', 'failed', 'expired', 'cancelled', 'refunded'
);

CREATE TABLE payment_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers (id) ON DELETE RESTRICT,
    wallet_id UUID NOT NULL,
    movement_id UUID,
    environment money_environment NOT NULL CHECK (environment IN ('pilot_live', 'live')),
    provider payment_provider NOT NULL,
    status payment_intent_status NOT NULL DEFAULT 'created',
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    currency CHAR(3) NOT NULL CHECK (currency = 'XAF'),
    payer_phone_e164 VARCHAR(32) NOT NULL,
    merchant_reference VARCHAR(160) NOT NULL,
    idempotency_key VARCHAR(160) NOT NULL,
    provider_reference VARCHAR(200),
    description VARCHAR(500),
    metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    failure_code VARCHAR(80),
    failure_message VARCHAR(500),
    expires_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payment_intents_wallet_environment_fk
        FOREIGN KEY (wallet_id, customer_id, environment)
        REFERENCES wallets (id, customer_id, environment) ON DELETE RESTRICT,
    CONSTRAINT payment_intents_movement_environment_fk
        FOREIGN KEY (movement_id, customer_id, environment)
        REFERENCES money_movements (id, customer_id, environment) ON DELETE RESTRICT,
    CONSTRAINT payment_intents_customer_environment_idempotency_unique
        UNIQUE (customer_id, environment, idempotency_key),
    CONSTRAINT payment_intents_customer_environment_reference_unique
        UNIQUE (customer_id, environment, merchant_reference)
);

CREATE TABLE provider_callback_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider payment_provider NOT NULL,
    provider_event_id VARCHAR(200) NOT NULL,
    payment_intent_id UUID REFERENCES payment_intents (id) ON DELETE RESTRICT,
    signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
    payload_sha256 CHAR(64) NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    processing_error VARCHAR(500),
    CONSTRAINT provider_callback_events_provider_event_unique UNIQUE (provider, provider_event_id)
);

CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
    environment money_environment NOT NULL,
    event_type VARCHAR(80) NOT NULL,
    aggregate_id UUID NOT NULL,
    payload_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT webhook_events_id_customer_environment_unique UNIQUE (id, customer_id, environment)
);

CREATE TABLE webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    endpoint_id UUID NOT NULL,
    customer_id UUID NOT NULL,
    environment money_environment NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
    status VARCHAR(24) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivering', 'succeeded', 'retry', 'failed')),
    next_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_http_status INTEGER,
    last_error VARCHAR(500),
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT webhook_deliveries_event_fk
        FOREIGN KEY (event_id, customer_id, environment)
        REFERENCES webhook_events (id, customer_id, environment) ON DELETE CASCADE,
    CONSTRAINT webhook_deliveries_endpoint_fk
        FOREIGN KEY (endpoint_id) REFERENCES webhook_endpoints (id) ON DELETE CASCADE,
    CONSTRAINT webhook_deliveries_event_endpoint_unique UNIQUE (event_id, endpoint_id)
);

CREATE INDEX payment_intents_customer_environment_created_idx
    ON payment_intents (customer_id, environment, created_at DESC);
CREATE INDEX payment_intents_provider_reference_idx
    ON payment_intents (provider, provider_reference) WHERE provider_reference IS NOT NULL;
CREATE INDEX webhook_deliveries_due_idx
    ON webhook_deliveries (next_attempt_at) WHERE status IN ('pending', 'retry');

ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_callback_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE payment_intents, provider_callback_events, webhook_events, webhook_deliveries FROM anon, authenticated;
