# E-NAKO MoneyFlow Branch Protection Enforcer (PowerShell)
param (
  [Parameter(Mandatory=$true)]
  [string]$Repo
)

$ErrorActionPreference = "Stop"

Write-Host "🔒 Applying branch protection rules to 'main' for $Repo..." -ForegroundColor Cyan

$body = @{
  required_status_checks = @{
    strict = $true
    contexts = @(
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
    )
  }
  enforce_admins = $true
  required_pull_request_reviews = @{
    dismiss_stale_reviews = $true
    require_code_owner_reviews = $true
    required_approving_review_count = 1
    require_last_push_approval = $true
  }
  restrictions = $null
  required_linear_history = $true
  allow_force_pushes = $false
  allow_deletions = $false
  block_creations = $false
  required_conversation_resolution = $true
} | ConvertTo-Json -Depth 5

$tempFile = [System.IO.Path]::GetTempFileName()
Set-Content -Path $tempFile -Value $body

try {
  gh api --method PUT -H "Accept: application/vnd.github+json" "/repos/$Repo/branches/main/protection" --input $tempFile
  Write-Host "✅ Branch protection on 'main' successfully configured and enforced!" -ForegroundColor Green
} finally {
  Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
}
