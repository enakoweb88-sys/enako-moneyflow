# Multi-stage build for Vite Admin Dashboard with NGINX
FROM node:20-alpine AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/admin-web/package.json ./apps/admin-web/
COPY apps/customer-web/package.json ./apps/customer-web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/api-types/package.json ./packages/api-types/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile

COPY apps/admin-web ./apps/admin-web
COPY packages ./packages
RUN pnpm --filter @enako/admin-web run build

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/admin-web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
