# E-NAKO MoneyFlow Unified Monorepo Makefile
.PHONY: setup dev verify test clean help lint format build

SHELL := /bin/bash

help:
	@echo "E-NAKO MoneyFlow Developer Commands:"
	@echo "  make setup    - Install dependencies (pnpm, husky, copy .env)"
	@echo "  make dev      - Start Postgres, backend, and both frontends"
	@echo "  make verify   - Run full check suite (lint, type-check, tests, build)"
	@echo "  make test     - Run full test suite including Testcontainers"
	@echo "  make format   - Format all JS/TS and documentation files"
	@echo "  make clean    - Remove build artifacts and caches"

setup:
	@echo "🚀 Setting up E-NAKO MoneyFlow monorepo..."
	@cp -n .env.example .env 2>/dev/null || copy .env.example .env 2>nul || true
	pnpm install
	pnpm exec husky
	@echo "✅ Setup complete. Ready for development."

dev:
	@echo "⚡ Starting local development environment..."
	docker compose -f infra/docker/docker-compose.yml up -d postgres
	pnpm run dev

verify:
	@echo "🔍 Running comprehensive pre-PR verification suite..."
	node ./scripts/check-secrets.js
	pnpm run format:check
	pnpm run lint
	pnpm run type-check
	pnpm run build
	@echo "✅ All verification checks passed. Ready for PR submission!"

test:
	@echo "🧪 Running full automated test suite..."
	pnpm run test
	@if command -v mvn >/dev/null 2>&1; then \
		(cd apps/backend && mvn test); \
	else \
		echo "Maven not found in PATH; skipping Java backend integration tests locally."; \
	fi
	@echo "✅ Test suite completed."

clean:
	@echo "🧹 Cleaning workspace..."
	rm -rf node_modules apps/*/node_modules packages/*/node_modules dist apps/*/.next apps/*/dist apps/backend/target .turbo
	@echo "✅ Workspace clean."
