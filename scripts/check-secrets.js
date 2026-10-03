#!/usr/bin/env node

/**
 * E-NAKO MoneyFlow Local Pre-commit Secret Scanner
 * Ensures no credentials, API keys, or private certificates reach git commits.
 */

const { execSync } = require("child_process");

const SECRET_PATTERNS = [
  {
    name: "Private Key",
    regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/,
  },
  {
    name: "AWS Access Key ID",
    regex:
      /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/,
  },
  {
    name: "AWS Secret Key",
    regex: /aws_secret_access_key\s*=\s*['"][a-zA-Z0-9\/+=]{40}['"]/i,
  },
  {
    name: "Generic Password/Secret Assignment",
    regex:
      /(?:apiKey|api_key|client_secret|jwt_secret|private_key|db_password)\s*[:=]\s*['"][a-zA-Z0-9\-_]{16,}['"]/i,
  },
  {
    name: "Database URL with Password",
    regex:
      /(?:postgres|postgresql|mysql):\/\/[a-zA-Z0-9_\-\.]+:[^@\s]+@[a-zA-Z0-9_\-\.]+/i,
  },
];

function scanDiff() {
  try {
    const diff = execSync("git diff --cached --unified=0", {
      encoding: "utf-8",
    });
    if (!diff) process.exit(0);

    const lines = diff.split("\n");
    let currentFile = "";
    let violations = [];

    for (const line of lines) {
      if (line.startsWith("+++ b/")) {
        currentFile = line.substring(6).trim();
      } else if (line.startsWith("+") && !line.startsWith("+++")) {
        const addedText = line.substring(1);
        for (const pattern of SECRET_PATTERNS) {
          if (pattern.regex.test(addedText)) {
            // Check if file is in allowlist
            if (
              currentFile.includes(".env.example") ||
              currentFile.includes("mock/") ||
              currentFile.includes("check-secrets.js") ||
              currentFile.includes(".gitleaks.toml")
            ) {
              continue;
            }

            violations.push({
              file: currentFile,
              pattern: pattern.name,
              line: addedText.trim().substring(0, 80),
            });
          }
        }
      }
    }

    if (violations.length > 0) {
      console.error(
        "\n🚨 [GITLEAKS / SECURITY GATE] Potential secret or credential detected in staged commit:",
      );
      for (const v of violations) {
        console.error(`   - File: ${v.file}`);
        console.error(`     Rule: ${v.pattern}`);
        console.error(`     Snippet: ${v.line}...\n`);
      }
      console.error("⛔ Commit blocked by E-NAKO MoneyFlow security policy.");
      console.error(
        "   Please remove credentials and use environment variables.\n",
      );
      process.exit(1);
    }
  } catch (err) {
    // If not in git or error, allow through
    process.exit(0);
  }
}

scanDiff();
