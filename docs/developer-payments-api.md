# MoneyFlow Payments API

Status: Sandbox is available. The Pilot Live key, payment, isolated wallet, limit, idempotency, held-balance, and event foundation is implemented locally. Provider adapters and verified callbacks must be configured before real collections are enabled. Live remains approval-gated.

## 1. Environments

| Environment | Key prefix | Money         | Collections                                            | Withdrawals                                                     |
| ----------- | ---------- | ------------- | ------------------------------------------------------ | --------------------------------------------------------------- |
| Sandbox     | `mf_sbx_`  | Simulated XAF | Available now with deterministic outcomes              | Simulated in the portal only                                    |
| Pilot Live  | `mf_plt_`  | Real XAF      | API foundation available; provider connection required | Disabled; collected funds remain held                           |
| Live        | `mf_live_` | Real XAF      | Planned after account approval                         | Planned after identity, MFA, operational, and provider approval |

Keys are environment-specific and must never be interchangeable. Store them only on the merchant's server. Never put a secret key in browser JavaScript, a mobile application, Git, screenshots, support messages, or logs.

The current Sandbox key that has been exposed anywhere must be revoked and replaced before further testing.

## 2. The checkout flow

```text
Shopper -> Merchant website -> MoneyFlow API -> MTN/Orange
   ^              |                  |             |
   |              |                  |<-- status --|
   |              |<-- webhook ------|             |
   |<-- receipt --|                                phone confirmation
```

1. The shopper chooses a product and selects MTN MoMo or Orange Money.
2. The merchant backend creates a MoneyFlow payment with a unique `Idempotency-Key`.
3. MoneyFlow validates the merchant key and creates the payment as `pending`.
4. For Pilot Live or Live, MoneyFlow requests a collection through the selected provider.
5. The provider authenticates the payer using the flow enabled for that merchant contract. This may be an approval prompt, USSD, or OTP; it must not be assumed to be the same for every provider.
6. The provider sends a callback to MoneyFlow. MoneyFlow verifies it and, where necessary, checks the transaction directly with the provider.
7. MoneyFlow records the immutable ledger entry, changes the payment to `completed` or `failed`, and sends a signed webhook to the merchant.
8. The merchant verifies the webhook signature and marks the order paid only when it receives `payment.completed`. A synchronous create-payment response is never proof of payment.

## 3. Sandbox quick start (available now)

The Sandbox never contacts MTN or Orange and never moves real money. It is used to develop order state, retries, error handling, and status polling.

### Create a simulated payment

```bash
curl -X POST "https://staging.moneyflow.enako.cm/api/v1/sandbox-api/payments" \
  -H "Content-Type: application/json" \
  -H "$MONEYFLOW_KEY_HEADER" \
  -H "Idempotency-Key: shop-order-1001" \
  -d '{
    "amountMinor": 25,
    "outcome": "SUCCESS",
    "customerReference": "ORDER-1001"
  }'
```

Set `MONEYFLOW_KEY_HEADER` in your terminal to an `X-MoneyFlow-Key` header containing the Sandbox key shown once in the developer portal. Keep the key outside source control.

`amountMinor` is an integer number of XAF. Because XAF has no fractional minor unit, `25` means 25 XAF. The current accepted range is 1 to 100,000,000 XAF.

Sandbox outcomes:

- `SUCCESS`: returns a completed simulated deposit and credits the Sandbox wallet.
- `PENDING`: returns a pending payment without crediting the wallet.
- `FAILED`: returns a failed payment without crediting the wallet.

Example response:

```json
{
  "movementId": "30719885-84cb-41df-a021-ff2d24b8d6e2",
  "reference": "SBX-2A17A851BF03",
  "scenario": "deposit_completed",
  "status": "completed",
  "amountMinor": 25,
  "balanceMinor": 100025
}
```

### Retrieve status

```bash
curl "https://staging.moneyflow.enako.cm/api/v1/sandbox-api/payments/30719885-84cb-41df-a021-ff2d24b8d6e2" \
  -H "$MONEYFLOW_KEY_HEADER"
```

### Idempotency

Use one stable `Idempotency-Key` per merchant order. A network retry with the same key and amount returns the existing payment rather than creating another one. Reusing that key with a different amount is rejected with `409 Conflict`.

## 4. Pilot Live contract (foundation implemented; providers not connected)

Pilot Live is a controlled real-money collection environment. It is not an unverified production shortcut.

Proposed rules:

- The merchant organisation and provider account must first pass the minimum onboarding required by MTN/Orange and applicable law.
- A shopper can pay without creating or verifying a MoneyFlow account; the mobile-money provider authenticates the shopper.
- The merchant receives a revocable `mf_plt_` server key only after Pilot approval.
- The proposed minimum collection is 10 XAF, but it must remain configuration-driven until both providers approve it contractually.
- Per-payment and daily limits are enforced server-side.
- Real collected funds are recorded in a separate Pilot ledger and held from withdrawal.
- The merchant can withdraw only after full Live activation. Release of held funds must pass compliance review and reconciliation.
- Refund, chargeback, abandoned-payment, expiry, and provider-timeout rules must be approved before launch.

Pilot Live cannot be enabled until MoneyFlow has provider credentials, signed callback verification, duplicate-callback protection, reconciliation, alerting, and an approved safeguarding/settlement process.

## 5. Unified real-payment API (planned)

The same API shape should serve Pilot Live and Live; the key determines the environment.

### Create payment

`POST /api/v1/payments`

```http
Authorization: Bearer mf_plt_REPLACE_ME
Idempotency-Key: shop-order-1001
Content-Type: application/json
```

```json
{
  "amount": 25,
  "currency": "XAF",
  "provider": "MTN_MOMO",
  "payer": { "phone": "+237670000000" },
  "merchantReference": "ORDER-1001",
  "description": "Test product",
  "metadata": { "cartId": "CART-51" }
}
```

Proposed initial response (`202 Accepted`):

```json
{
  "id": "pay_01J...",
  "reference": "MF-01J...",
  "status": "pending",
  "environment": "pilot_live",
  "amount": 25,
  "currency": "XAF",
  "provider": "MTN_MOMO",
  "merchantReference": "ORDER-1001",
  "expiresAt": "2026-10-19T15:10:00Z"
}
```

### Get payment

`GET /api/v1/payments/{paymentId}` returns the authoritative current status. Recommended states are `created`, `pending_customer`, `processing`, `completed`, `failed`, `expired`, `cancelled`, and `refunded`.

Do not repeatedly poll faster than the documented rate limit. Webhooks are the primary notification mechanism; status retrieval is the recovery mechanism.

## 6. Webhooks

Suggested events:

- `payment.pending`
- `payment.completed`
- `payment.failed`
- `payment.expired`
- `payment.refunded`

Suggested headers:

```http
MoneyFlow-Event-Id: evt_01J...
MoneyFlow-Timestamp: 1792418400
MoneyFlow-Signature: v1=HEX_HMAC_SHA256
```

The signed message is `<timestamp>.<raw_request_body>`. Verify HMAC-SHA256 with the endpoint signing secret using a constant-time comparison, reject stale timestamps, and store the event ID so duplicate deliveries do not repeat fulfilment.

Return any `2xx` response only after persisting the event. MoneyFlow retries non-`2xx` deliveries after approximately 1 minute, 5 minutes, 30 minutes, 2 hours, 8 hours and 24 hours. Delivery status, attempt count and the last HTTP response are available in the developer portal. Endpoint signing secrets are displayed once and encrypted at rest.

Example handler outline:

```ts
const rawBody = await readRawBody(request);
verifyMoneyFlowSignature(
  rawBody,
  request.headers,
  process.env.MONEYFLOW_WEBHOOK_SECRET!,
);

const event = JSON.parse(rawBody);
if (await hasProcessed(event.id)) return new Response("ok");

await transaction(async () => {
  await rememberEvent(event.id);
  if (event.type === "payment.completed") {
    await markOrderPaid(event.data.merchantReference, event.data.id);
  }
});

return new Response("ok");
```

## 7. Live activation

After identity verification, verified contact details, MFA, intended-use review, risk/compliance review, provider readiness, and operational approval, the merchant may create a `mf_live_` key. Live keys call the same real-payment API but use the Live ledger, Live limits, and enabled withdrawal routes. Sandbox and Pilot records must never be copied into the Live ledger as if they were Live transactions.

## 8. Implementation gates

Before Pilot Live can accept one real franc, complete these gates:

1. Execute merchant/aggregator agreements and obtain MTN MoMo Cameroon and Orange Money Cameroon production or approved pilot credentials.
2. Confirm provider-supported minimums, fees, limits, payer authentication flow, settlement timing, refunds, and callback security.
3. Obtain legal/compliance approval for collecting and holding funds before the MoneyFlow merchant completes full verification.
4. Implement environment-scoped key issuance, hashing, rotation, revocation, permissions, expiry, and audit logs.
5. Implement the payment state machine, provider adapters, callback verification, idempotent ledger posting, and reconciliation jobs.
6. Implement signed merchant webhooks, retries, replay protection, delivery logs, and webhook-secret rotation.
7. Add monitoring for provider latency, callback failures, ledger/provider mismatches, limit breaches, and suspicious activity.
8. Pass automated tests, provider certification, controlled internal transactions, finance reconciliation, and rollback testing.

Until provider connectivity and callback gates pass, Pilot keys may be created for integration preparation but real collection requests must return unavailable. Live keys remain unavailable until every Live gate passes.

## 9. Provider credential mapping

Provider secrets belong only in the backend secret environment. They are never merchant-facing MoneyFlow keys.

### MTN MoMo Cameroon

| Environment name                                         | Purpose                                                                                                             |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `PRIMARY_KEY`                                            | Active MTN Collections subscription key                                                                             |
| `SECONDARY_KEY`                                          | Collections key rotation/failover; not sent alongside the primary key                                               |
| `DEPOSIT_API_USER`                                       | Collections OAuth API user                                                                                          |
| `DEPOSIT_API_KEY`                                        | Collections OAuth API key                                                                                           |
| `DISBURSEMENT_PRIMARY_KEY`, `DISBURSEMENT_SECONDARY_KEY` | Future Live payouts only; prohibited in Pilot                                                                       |
| `PAYMENTS_API_USER`, `PAYMENTS_API_KEY`                  | Separate contracted Payments product; do not substitute for Collections without confirming the MTN product contract |

The configured MTN production base is `https://momoapi.momo.africa`, with target environment `mtncameroon`. MoneyFlow must obtain a bearer token, submit an asynchronous RequestToPay with a unique reference, receive or poll the final state, and credit the ledger only after a verified successful state.

MoneyFlow implements this callback defensively: the MTN callback only wakes the reconciliation process. MoneyFlow then requests the payment state directly from MTN and changes the ledger only for an authoritative `SUCCESSFUL` result. Set `MTN_MOMO_ENABLED=true` only after every MTN variable and the public HTTPS callback URL have been configured.

### PixiPay / Orange Cameroon

| Environment name                       | Purpose                                                          |
| -------------------------------------- | ---------------------------------------------------------------- |
| `PIX_PAY_API_KEY`                      | MoneyFlow's server-to-server PixiPay credential                  |
| `PIX_PAY_ORANGE_CM_CASHIN_SERVICE_ID`  | Orange Cameroon collection route used by Pilot and Live deposits |
| `PIX_PAY_ORANGE_CM_CASHOUT_SERVICE_ID` | Future approved Live withdrawals; prohibited in Pilot            |

PixiPay's base URL, authentication header, cash-in request schema, callback signature scheme, final status values, and status-query endpoint must be copied from the authenticated partner portal contract. MoneyFlow must not guess these values from the credential names.
