# Optimized Multi-stage Dockerfile for Go Backend
FROM golang:1.22-alpine AS base

# Build stage
FROM base AS builder

# Install build dependencies
RUN apk add --no-cache \
    git \
    ca-certificates \
    tzdata

# Set working directory
WORKDIR /app

# Copy go mod files first for better caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download && go mod verify

# Copy source code
COPY . .

# Build the application with optimizations
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -a -installsuffix cgo \
    -ldflags='-w -s -extldflags "-static"' \
    -o main .

# Development stage
FROM base AS development

# Install development tools
RUN apk add --no-cache \
    git \
    ca-certificates \
    wget \
    curl \
    dumb-init

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Create non-root user for development
RUN addgroup --system --gid 1001 golang && \
    adduser --system --uid 1001 --ingroup golang golang

# Set ownership
RUN chown -R golang:golang /app

USER golang

EXPOSE 5001

ENV PORT=5001
ENV HOST=0.0.0.0
ENV GIN_MODE=debug

ENTRYPOINT ["dumb-init", "--"]
CMD ["go", "run", "main.go"]

# Production stage - minimal and secure
FROM alpine:latest AS production

# Install minimal runtime dependencies and create directories
RUN apk add --no-cache ca-certificates tzdata coreutils && \
    addgroup --system --gid 1001 golang && \
    adduser --system --uid 1001 --ingroup golang golang && \
    mkdir -p /tmp /uploads /logs /app /app/temp && \
    chmod 1777 /tmp && \
    chmod 755 /uploads /logs /app /app/temp && \
    chown -R golang:golang /uploads /logs /app

# Copy timezone data and CA certificates
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copy the binary
COPY --from=builder /app/main /app/main
RUN chmod +x /app/main && chown golang:golang /app/main

# Set working directory
WORKDIR /app

# Set non-root user
USER golang:golang

# Expose port
EXPOSE 5001

# Set environment variables
ENV PORT=5001
ENV HOST=0.0.0.0
ENV GIN_MODE=release
ENV TZ=UTC

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD ["/app/main", "--health-check"]

# Run the application
ENTRYPOINT ["/app/main"]
