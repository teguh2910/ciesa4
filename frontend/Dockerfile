# Optimized Multi-stage Dockerfile for Next.js Frontend
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies
RUN \
  if [ -f package-lock.json ]; then \
    npm ci --only=production --frozen-lockfile; \
  else \
    echo "Lockfile not found." && exit 1; \
  fi

# Build stage - install all dependencies and build
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies)
RUN \
  if [ -f package-lock.json ]; then \
    npm ci --frozen-lockfile; \
  else \
    echo "Lockfile not found." && exit 1; \
  fi

# Copy source code
COPY . .

# Disable telemetry for better performance
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Development image
FROM base AS development
WORKDIR /app

# Install system dependencies for health checks and development
RUN apk add --no-cache \
    wget \
    curl \
    dumb-init

# Install all dependencies (including dev dependencies)
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Disable telemetry to avoid cache write issues
ENV NEXT_TELEMETRY_DISABLED=1

# Copy source code
COPY . .

# Create .next directory for cache with proper permissions
RUN mkdir -p .next/cache && \
    chown -R node:node .next

# Switch to non-root user for security
USER node

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start development server
CMD ["npm", "run", "dev"]

# Production image - optimized for size and security
FROM node:20-alpine AS production
WORKDIR /app

# Install only essential runtime dependencies
RUN apk add --no-cache \
    dumb-init \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy public assets with proper ownership
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Create cache directory with proper permissions
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next

# Copy built application with proper ownership
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user for security
USER nextjs

EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]
