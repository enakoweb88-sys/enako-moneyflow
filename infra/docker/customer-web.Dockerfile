# Multi-stage build for Next.js Customer Web Portal
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/admin-web/package.json ./apps/admin-web/
COPY apps/customer-web/package.json ./apps/customer-web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/api-types/package.json ./packages/api-types/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile

COPY apps/customer-web ./apps/customer-web
COPY packages ./packages
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_MONEYFLOW_API_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_MONEYFLOW_API_URL=$NEXT_PUBLIC_MONEYFLOW_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @enako/customer-web run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/customer-web/public ./apps/customer-web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/customer-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/customer-web/.next/static ./apps/customer-web/.next/static
WORKDIR /app/apps/customer-web
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
