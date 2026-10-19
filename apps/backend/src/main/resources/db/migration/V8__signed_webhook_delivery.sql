ALTER TABLE webhook_endpoints
    ADD COLUMN signing_secret_encrypted TEXT,
    ADD COLUMN secret_prefix VARCHAR(20),
    ADD COLUMN subscribed_events TEXT[] NOT NULL DEFAULT ARRAY['payment.completed']::TEXT[];

ALTER TABLE webhook_deliveries
    ADD COLUMN response_body_excerpt VARCHAR(500);

CREATE INDEX webhook_events_customer_created_idx
    ON webhook_events (customer_id, environment, created_at DESC);
