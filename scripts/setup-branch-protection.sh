#!/usr/bin/env bash
set -euo pipefail

# E-NAKO MoneyFlow Branch Protection Enforcer
# Configures strict protection rules on the `main` branch via GitHub CLI

REPO="${1:-}"

if [[ -z "$REPO" ]]; then
  echo "Usage: $0 <owner/repo>"
  echo "Example: $0 enako-group/moneyflow"
  exit 1
fi

echo "🔒 Applying branch protection rules to 'main' for $REPO..."

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/$REPO/branches/main/protection" \
  --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Backend: Build & Compile",
      "Backend: Unit Tests",
      "Backend: Integration Tests",
      "Backend: Architecture Tests",
      "Backend: Sonar Quality Gate",
      "Backend: Dependency Vulnerability Check",
      "Frontend: Frozen Install Check",
      "Frontend: ESLint & Prettier Check",
      "Frontend: TypeScript Type Check",
      "Frontend: Unit & Component Tests",
      "Frontend: Vite & Next.js Production Build",
      "Frontend: Playwright Critical Path Smoke Tests",
      "Security: Gitleaks Secret Scanner",
      "Compliance: Commitlint Conventional Commits"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1,
    "require_last_push_approval": true
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true
}
EOF

echo "✅ Branch protection on 'main' successfully configured and enforced!"
