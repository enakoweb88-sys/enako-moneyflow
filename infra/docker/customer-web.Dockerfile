# Multi-stage build for Next.js Customer Web Portal
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/customer-web/package.json ./apps/customer-web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/api-types/package.json ./packages/api-types/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile

COPY apps/customer-web ./apps/customer-web
COPY packages ./packages
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @enako/customer-web run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/customer-web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/customer-web/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
USER nextjs
EXPOSE 3000
CMD ["node_modules/.bin/next", "start", "-p", "3000"]
