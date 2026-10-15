-- Foundation for the first read-only vertical slice.
-- The API is the only client data gateway; do not grant browser roles direct table access.

CREATE TYPE app_role AS ENUM (
    'customer',
    'operator',
    'operations_manager',
    'finance_manager',
    'compliance_officer',
    'customer_support',
    'administrator',
    'ceo'
);

CREATE TYPE kyc_status AS ENUM (
    'not_started',
    'pending',
    'verified',
    'more_info_required',
    'rejected'
);

CREATE TYPE wallet_status AS ENUM (
    'active',
    'suspended',
    'closed'
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    email VARCHAR(320) NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    phone_e164 VARCHAR(32),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX profiles_email_lower_unique ON profiles (LOWER(email));

CREATE TABLE staff_role_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    role app_role NOT NULL,
    assigned_by UUID REFERENCES profiles (id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT staff_role_assignments_not_customer CHECK (role <> 'customer')
);

CREATE UNIQUE INDEX staff_role_assignments_active_unique
    ON staff_role_assignments (profile_id, role)
    WHERE revoked_at IS NULL;

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles (id) ON DELETE RESTRICT,
    customer_number VARCHAR(40) NOT NULL UNIQUE,
    kyc_status kyc_status NOT NULL DEFAULT 'not_started',
    kyc_tier SMALLINT NOT NULL DEFAULT 1 CHECK (kyc_tier BETWEEN 1 AND 3),
    status VARCHAR(32) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'suspended', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers (id) ON DELETE RESTRICT,
    currency CHAR(3) NOT NULL,
    status wallet_status NOT NULL DEFAULT 'active',
    balance_minor BIGINT NOT NULL DEFAULT 0 CHECK (balance_minor >= 0),
    held_minor BIGINT NOT NULL DEFAULT 0 CHECK (held_minor >= 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT wallets_balance_covers_held CHECK (balance_minor >= held_minor),
    CONSTRAINT wallets_customer_currency_unique UNIQUE (customer_id, currency),
    CONSTRAINT wallets_currency_uppercase CHECK (currency = UPPER(currency))
);

CREATE INDEX customers_status_kyc_idx ON customers (status, kyc_status);
CREATE INDEX wallets_customer_idx ON wallets (customer_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE profiles, staff_role_assignments, customers, wallets FROM anon, authenticated;
