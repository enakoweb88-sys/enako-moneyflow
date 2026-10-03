## Description of Change

<!-- Provide a clear, concise summary of what was changed and why. -->

## Related Requirement / Ticket

- **Issue/Ticket ID**: `ENAKO-`
- **Module Affected**: `[ledger | wallet | remittance | withdrawal | approval | fx | fee | recon | customer-web | admin-web | infra]`

## Type of Change

- [ ] `feat`: New customer-facing or administrative capability
- [ ] `fix`: Bug fix in processing logic or UI
- [ ] `refactor`: Internal refactoring with zero API drift
- [ ] `test`: New integration or architecture tests added
- [ ] `ci`: Pipeline or workflow modification
- [ ] `docs`: Documentation, ADR, or runbook update

---

## Financial Platform Definition of Done (DoD) Checklist

_Please confirm every item below before requesting review. Incomplete PRs will be rejected._

- [ ] **Tests Pass**: `make verify` passes locally (unit tests, integration tests, type checks, lint).
- [ ] **Ledger Integrity**: No ledger tables or records are modified, updated, or deleted outside the immutable `ledger` module.
- [ ] **Zero Secrets**: Checked that no real API keys, credentials, private certificates, or internal URLs are committed.
- [ ] **Contract Alignment**: If an API endpoint or DTO changed, the OpenAPI spec (`packages/api-types/openapi.json`) was updated and types re-generated.
- [ ] **Backward-Compatible Migrations**: Any Flyway migration (`V*.sql`) is backward-compatible with previous application instances.
- [ ] **Audit Trail**: Any high-value administrative action produces an immutable audit log record.
- [ ] **Conventional Commits**: All commit messages follow the `feat:`, `fix:`, `chore:`, etc. format.

---

## Evidence of Verification

<!-- Include test outputs, screenshot of make verify or terminal logs -->

```bash
$ make verify
# paste output summary here
```
