# Combined Multi-stage Dockerfile for Next.js Frontend + Go Backend
FROM node:20-alpine AS frontend-builder

# Install dependencies for frontend build
RUN apk add --no-cache libc6-compat

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package.json frontend/package-lock.json* ./

# Install frontend dependencies
RUN if [ -f package-lock.json ]; then \
      npm ci --frozen-lockfile; \
    else \
      echo "Frontend lockfile not found." && exit 1; \
    fi

# Copy frontend source code
COPY frontend/ ./

# Disable telemetry and build frontend
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Go backend builder stage
FROM golang:1.22-alpine AS backend-builder

# Install build dependencies
RUN apk add --no-cache \
    git \
    ca-certificates \
    tzdata

WORKDIR /app

# Copy go mod files first for better caching
COPY go.mod go.sum ./

# Download Go dependencies
RUN go mod download && go mod verify

# Copy backend source code
COPY . .

# Build the Go application with optimizations
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -a -installsuffix cgo \
    -ldflags='-w -s -extldflags "-static"' \
    -o main .

# Final production stage - combines both frontend and backend
FROM node:20-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    ca-certificates \
    tzdata \
    nginx \
    supervisor \
    wget \
    && addgroup --system --gid 1001 appgroup \
    && adduser --system --uid 1001 --ingroup appgroup appuser \
    && mkdir -p /app /uploads /logs /var/log/supervisor /etc/nginx/conf.d \
    && chmod 755 /uploads /logs /app \
    && chown -R appuser:appgroup /uploads /logs /app

# Copy timezone data and CA certificates
COPY --from=backend-builder /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=backend-builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copy the Go backend binary
COPY --from=backend-builder /app/main /app/main
RUN chmod +x /app/main && chown appuser:appgroup /app/main

# Copy the built Next.js frontend
COPY --from=frontend-builder /app/frontend/.next/standalone /app/frontend/
COPY --from=frontend-builder /app/frontend/.next/static /app/frontend/.next/static
COPY --from=frontend-builder /app/frontend/public /app/frontend/public

# Set proper ownership for frontend files
RUN chown -R appuser:appgroup /app/frontend

# Copy configuration files
COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf



# Set working directory
WORKDIR /app

# Expose port 80 for the combined application
EXPOSE 80

# Set environment variables
ENV TZ=UTC
ENV NODE_ENV=production
ENV GIN_MODE=release

# Health check for the combined application
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/health || exit 1

# Start supervisor to manage all services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
