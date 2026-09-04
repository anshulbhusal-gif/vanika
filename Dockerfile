# ====================================================
# VANIKA COGNITIVE CARE — PRODUCTION DOCKERFILE
# Multi-Stage Build using Node 20 Alpine
# ====================================================

# ── STAGE 1: Build Environment ──
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies for build & Prisma)
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy application source code
COPY . .

# Build production bundle (Vite frontend + esbuild server.cjs)
RUN npm run build

# ── STAGE 2: Production Runtime Environment ──
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install runtime utilities (curl for healthcheck, openssl for Prisma)
RUN apk add --no-cache curl openssl

# Copy package manifests
COPY package.json package-lock.json ./

# Install production dependencies only + prisma CLI for migrations
RUN npm ci --only=production && npm install prisma @prisma/client

# Copy Prisma schema and generated client from builder
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built production assets (dist/ directory containing index.html, assets/, server.cjs)
COPY --from=builder /app/dist ./dist

# Create uploads directory for persistent family memory uploads & set permissions
RUN mkdir -p /app/uploads && chown -R node:node /app

# Copy and setup entrypoint script
COPY scripts/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh && chown node:node /app/docker-entrypoint.sh

# Run as non-root node user for container security
USER node

EXPOSE 5000

# Healthcheck against internal /api/health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:${PORT}/api/health || exit 1

ENTRYPOINT ["/app/docker-entrypoint.sh"]
