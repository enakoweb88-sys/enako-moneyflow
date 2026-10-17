-- This file mirrors the Flyway V3 migration used by the MoneyFlow backend.
-- Do not run both migration systems independently against the same database.

CREATE TYPE payment_activation_status AS ENUM (
    'draft',
    'submitted',
    'in_review',
    'approved',
    'changes_requested',
    'rejected'
);

CREATE TYPE payment_activation_channel AS ENUM (
    'mtn_momo',
    'orange_money',
    'bank_settlement'
);

CREATE TABLE payment_activation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles (id) ON DELETE RESTRICT,
    business_use VARCHAR(40) NOT NULL,
    business_country CHAR(2) NOT NULL,
    organisation_type VARCHAR(40) NOT NULL,
    legal_business_name VARCHAR(200) NOT NULL,
    representative_name VARCHAR(200) NOT NULL,
    representative_email VARCHAR(320) NOT NULL,
    representative_phone VARCHAR(32),
    representative_role VARCHAR(120) NOT NULL,
    settlement_currency CHAR(3) NOT NULL DEFAULT 'XAF',
    expected_monthly_volume VARCHAR(40),
    status payment_activation_status NOT NULL DEFAULT 'draft',
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES profiles (id) ON DELETE SET NULL,
    review_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payment_activation_country_uppercase CHECK (business_country = UPPER(business_country)),
    CONSTRAINT payment_activation_currency_uppercase CHECK (settlement_currency = UPPER(settlement_currency)),
    CONSTRAINT payment_activation_status_dates CHECK (
        (status = 'draft' AND submitted_at IS NULL)
        OR (status <> 'draft' AND submitted_at IS NOT NULL)
    )
);

CREATE TABLE payment_activation_channels (
    payment_activation_request_id UUID NOT NULL REFERENCES payment_activation_requests (id) ON DELETE CASCADE,
    channel payment_activation_channel NOT NULL,
    PRIMARY KEY (payment_activation_request_id, channel)
);

CREATE INDEX payment_activation_requests_profile_created_idx
    ON payment_activation_requests (profile_id, created_at DESC);
CREATE INDEX payment_activation_requests_review_queue_idx
    ON payment_activation_requests (status, submitted_at ASC)
    WHERE status IN ('submitted', 'in_review', 'changes_requested');

ALTER TABLE payment_activation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_activation_channels ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE payment_activation_requests, payment_activation_channels FROM anon, authenticated;
