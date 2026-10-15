# E-NAKO MoneyFlow Backend Contract v1

## Current baseline

The Staging deployment is operational, but the application is not yet connected:

- The Spring Boot backend exposes health endpoints only.
- The Customer and Admin portals use local mock contexts.
- `V1__init.sql` only records the schema baseline; it does not create business tables.
- No financial transaction, wallet, customer, or approval endpoint is implemented yet.

This document is the implementation contract for replacing mock state safely. It is intentionally not a database migration and does not authorise production data changes.

## Architectural decisions

1. **The Spring Boot API is the system of record gateway.** Browser applications call `moneyflow-api`; they do not connect directly to PostgreSQL or use a Supabase service key.
2. **Supabase Auth is the identity provider.** The backend will validate Supabase JWTs using the project JWKS endpoint. The service-role key and database password remain server-only.
3. **Authorisation is enforced in the backend.** Roles are stored as controlled application data, never read from editable JWT user metadata.
4. **Money movements are append-only.** Balances are derived from posted ledger entries. No endpoint may directly overwrite a balance.
5. **External payment providers are asynchronous.** Provider callbacks are idempotent, signed, audited, and never trusted from browser input.
6. **Every privileged action is audited.** Audit records include actor, role, action, resource, result, request ID, source IP, and timestamp.

## Roles

| Role               | Primary authority                                                    |
| ------------------ | -------------------------------------------------------------------- |
| Customer           | Own profile, wallets, beneficiaries, payment requests, notifications |
| Operator           | Operational review; cannot approve own work                          |
| Operations Manager | Operational approvals and exception handling                         |
| Finance Manager    | Ledger, fees, settlement, and finance approvals                      |
| Compliance Officer | KYC review and compliance cases                                      |
| Customer Support   | Read-only customer support access, with masking by default           |
| Administrator      | Staff, roles, platform settings; no direct financial posting         |
| CEO                | Read-only executive reporting and designated approvals               |

Maker-checker controls apply to approvals: a requester cannot approve, reject, or post their own action.

## API conventions

- Base path: `/api/v1`
- Authentication: `Authorization: Bearer <Supabase access token>`
- IDs: UUIDs; no sequential public identifiers.
- Monetary values: integer minor units (`amountMinor`) plus ISO 4217 `currency`; never floating-point values.
- Timestamps: UTC ISO-8601.
- Pagination: `?cursor=<opaque>&limit=50`; responses include `nextCursor`.
- Idempotent writes: callers send `Idempotency-Key` for payment, withdrawal, and approval commands.
- Errors: `{ "code", "message", "requestId", "fieldErrors"? }`; never return internal stack traces.

## Module contract

### 1. Identity and staff administration

| Endpoint                           | Audience      | Purpose                                          |
| ---------------------------------- | ------------- | ------------------------------------------------ |
| `GET /me`                          | Authenticated | Current profile, role, permissions, organisation |
| `GET /admin/users`                 | Administrator | Paginated staff directory                        |
| `POST /admin/users`                | Administrator | Invite staff and assign an initial role          |
| `PATCH /admin/users/{userId}/role` | Administrator | Change a staff role; writes an audit entry       |

### 2. Customer and KYC

| Endpoint                            | Audience           | Purpose                                            |
| ----------------------------------- | ------------------ | -------------------------------------------------- |
| `GET /customers/me`                 | Customer           | Own profile and KYC summary                        |
| `PATCH /customers/me`               | Customer           | Update permitted profile fields                    |
| `GET /admin/customers`              | Permitted staff    | Search and filter customers                        |
| `GET /admin/customers/{customerId}` | Permitted staff    | Customer record with masked PII by default         |
| `POST /customers/me/kyc/documents`  | Customer           | Create a signed upload request and document record |
| `POST /admin/kyc/{caseId}/decision` | Compliance Officer | Approve, reject, or request information            |

### 3. Wallets and ledger

| Endpoint                       | Audience             | Purpose                           |
| ------------------------------ | -------------------- | --------------------------------- |
| `GET /wallets/me`              | Customer             | Own wallet balances and holds     |
| `GET /wallets/me/transactions` | Customer             | Own transaction history           |
| `GET /admin/wallets`           | Finance / Operations | Search wallet balances and status |
| `GET /admin/ledger/entries`    | Finance Manager      | Immutable journal entries         |
| `GET /admin/ledger/accounts`   | Finance Manager      | Chart of accounts and balances    |

### 4. Beneficiaries, withdrawals, and remittances

| Endpoint                                          | Audience                | Purpose                                         |
| ------------------------------------------------- | ----------------------- | ----------------------------------------------- |
| `GET /beneficiaries`                              | Customer                | Own beneficiaries                               |
| `POST /beneficiaries`                             | Customer                | Create beneficiary; applies validation/cooldown |
| `POST /withdrawals`                               | Customer                | Request a withdrawal; idempotent                |
| `GET /withdrawals/{withdrawalId}`                 | Owner / permitted staff | Withdrawal status and receipt fields            |
| `POST /admin/withdrawals/{withdrawalId}/decision` | Authorised approver     | Approve or reject; never self-approve           |
| `POST /provider-events/{provider}`                | Provider only           | Signed, idempotent provider callback            |

### 5. Approvals, audit, notifications, and reporting

| Endpoint                                      | Audience                | Purpose                                |
| --------------------------------------------- | ----------------------- | -------------------------------------- |
| `GET /admin/approvals`                        | Authorised staff        | Pending maker-checker queue            |
| `POST /admin/approvals/{approvalId}/decision` | Authorised approver     | Approve or reject a queued action      |
| `GET /admin/audit-events`                     | Administrator / Auditor | Filtered, paginated audit trail        |
| `GET /notifications`                          | Customer / staff        | Own notifications                      |
| `POST /notifications/{notificationId}/read`   | Customer / staff        | Mark own notification read             |
| `GET /admin/dashboard`                        | Authorised staff        | Dashboard KPIs; no browser-side totals |

## First vertical slice: identity, customer profile, and wallet read-only access

The first implementation must be read-only after authentication. It proves the full path without moving money:

1. Configure JWT validation against the Staging Supabase project.
2. Add an application profile table linked to `auth.users` and a controlled role model.
3. Add read-only customer and wallet tables with RLS enabled as defence in depth.
4. Implement `GET /api/v1/me`, `GET /api/v1/customers/me`, and `GET /api/v1/wallets/me`.
5. Replace only the Customer portal profile and wallet mock reads with the API client.
6. Add integration tests for unauthenticated, customer, and staff access.
7. Add audit logging for every staff read of customer data.

No balances, payment commands, provider callbacks, or approval decisions are implemented in this slice.

## Schema sequence

Each step is a separate reviewed Flyway migration and is first applied to Staging only:

1. `profiles`, `staff_roles`, and `organisations`.
2. `customers`, KYC cases, and KYC documents.
3. Chart of accounts, wallets, ledger transactions, and immutable journal entries.
4. Beneficiaries, withdrawal requests, provider events, and idempotency keys.
5. Approval tasks, audit events, notifications, and reports.

Before any migration is created, define indexes, retention requirements, PII masking, RLS policy, rollback/forward-fix plan, and test data strategy. Financial migrations must use forward-only corrections; do not edit an applied migration.

## Definition of done for every module

- API request and response types are added to `packages/api-types`.
- Validation and permission tests cover success and denial cases.
- Database migration is reviewed and passes against an empty Staging schema.
- Audit events exist for privileged operations.
- API errors do not expose internal details or personal data.
- Dashboard UI no longer reads the corresponding mock state.
- Staging health, CI, and the manual Staging verification workflow pass.
