-- Financial environment isolation. The browser never receives direct table grants;
-- the backend selects one environment per authenticated request.

CREATE TYPE money_environment AS ENUM ('sandbox', 'live');
CREATE TYPE money_movement_status AS ENUM ('draft', 'pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE money_movement_direction AS ENUM ('credit', 'debit');

ALTER TABLE wallets ADD COLUMN environment money_environment NOT NULL DEFAULT 'sandbox';
ALTER TABLE wallets DROP CONSTRAINT wallets_customer_currency_unique;
ALTER TABLE wallets ADD CONSTRAINT wallets_customer_environment_currency_unique UNIQUE (customer_id, environment, currency);
ALTER TABLE wallets ADD CONSTRAINT wallets_id_environment_unique UNIQUE (id, environment);
ALTER TABLE wallets ADD CONSTRAINT wallets_id_customer_environment_unique UNIQUE (id, customer_id, environment);
CREATE INDEX wallets_customer_environment_idx ON wallets (customer_id, environment);

ALTER TABLE payment_activation_requests ADD COLUMN environment money_environment NOT NULL DEFAULT 'live';
CREATE INDEX payment_activation_requests_profile_environment_idx ON payment_activation_requests (profile_id, environment, created_at DESC);

CREATE TABLE beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers (id) ON DELETE RESTRICT,
    environment money_environment NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    provider VARCHAR(80) NOT NULL,
    account_reference_encrypted TEXT NOT NULL,
    account_reference_masked VARCHAR(80) NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cooldown', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT beneficiaries_id_environment_unique UNIQUE (id, environment),
    CONSTRAINT beneficiaries_id_customer_environment_unique UNIQUE (id, customer_id, environment)
);

CREATE TABLE money_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers (id) ON DELETE RESTRICT,
    wallet_id UUID NOT NULL,
    beneficiary_id UUID,
    environment money_environment NOT NULL,
    direction money_movement_direction NOT NULL,
    movement_type VARCHAR(40) NOT NULL CHECK (movement_type IN ('deposit', 'withdrawal', 'transfer', 'fee', 'adjustment', 'reversal')),
    status money_movement_status NOT NULL DEFAULT 'draft',
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    fee_minor BIGINT NOT NULL DEFAULT 0 CHECK (fee_minor >= 0),
    currency CHAR(3) NOT NULL CHECK (currency = UPPER(currency)),
    external_reference VARCHAR(160),
    idempotency_key VARCHAR(160),
    description VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT money_movements_wallet_environment_fk FOREIGN KEY (wallet_id, customer_id, environment) REFERENCES wallets (id, customer_id, environment) ON DELETE RESTRICT,
    CONSTRAINT money_movements_beneficiary_environment_fk FOREIGN KEY (beneficiary_id, customer_id, environment) REFERENCES beneficiaries (id, customer_id, environment) ON DELETE RESTRICT,
    CONSTRAINT money_movements_id_customer_environment_unique UNIQUE (id, customer_id, environment),
    CONSTRAINT money_movements_customer_environment_idempotency_unique UNIQUE (customer_id, environment, idempotency_key)
);

CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers (id) ON DELETE RESTRICT,
    wallet_id UUID NOT NULL,
    movement_id UUID NOT NULL,
    environment money_environment NOT NULL,
    direction money_movement_direction NOT NULL,
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    balance_after_minor BIGINT NOT NULL CHECK (balance_after_minor >= 0),
    currency CHAR(3) NOT NULL CHECK (currency = UPPER(currency)),
    entry_sequence BIGINT GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ledger_entries_wallet_environment_fk FOREIGN KEY (wallet_id, customer_id, environment) REFERENCES wallets (id, customer_id, environment) ON DELETE RESTRICT,
    CONSTRAINT ledger_entries_movement_environment_fk FOREIGN KEY (movement_id, customer_id, environment) REFERENCES money_movements (id, customer_id, environment) ON DELETE RESTRICT,
    CONSTRAINT ledger_entries_sequence_unique UNIQUE (wallet_id, environment, entry_sequence)
);

CREATE TABLE transaction_disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers (id) ON DELETE RESTRICT,
    movement_id UUID NOT NULL,
    environment money_environment NOT NULL,
    reason VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'in_review', 'resolved', 'rejected', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT disputes_movement_environment_fk FOREIGN KEY (movement_id, customer_id, environment) REFERENCES money_movements (id, customer_id, environment) ON DELETE RESTRICT
);

CREATE TABLE api_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
    environment money_environment NOT NULL,
    key_prefix VARCHAR(32) NOT NULL,
    secret_hash VARCHAR(255) NOT NULL,
    label VARCHAR(120) NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT api_credentials_prefix_unique UNIQUE (key_prefix)
);

CREATE TABLE webhook_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
    environment money_environment NOT NULL,
    endpoint_url TEXT NOT NULL,
    signing_secret_hash VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT webhook_endpoints_customer_environment_url_unique UNIQUE (customer_id, environment, endpoint_url)
);

CREATE INDEX beneficiaries_customer_environment_idx ON beneficiaries (customer_id, environment, created_at DESC);
CREATE INDEX money_movements_customer_environment_created_idx ON money_movements (customer_id, environment, created_at DESC);
CREATE INDEX ledger_entries_wallet_environment_created_idx ON ledger_entries (wallet_id, environment, created_at DESC);
CREATE INDEX disputes_customer_environment_created_idx ON transaction_disputes (customer_id, environment, created_at DESC);
CREATE INDEX api_credentials_customer_environment_idx ON api_credentials (customer_id, environment) WHERE revoked_at IS NULL;
CREATE INDEX webhook_endpoints_customer_environment_idx ON webhook_endpoints (customer_id, environment) WHERE enabled;

ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE money_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE beneficiaries, money_movements, ledger_entries, transaction_disputes, api_credentials, webhook_endpoints FROM anon, authenticated;
