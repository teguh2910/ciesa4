# Combined Docker Setup

This project now uses a **single combined Docker container** that runs both the Next.js frontend and Go backend together, with Nginx as a reverse proxy to route requests appropriately.

## Architecture

The new Docker setup includes:

- **Frontend Builder Stage**: Builds the Next.js application
- **Backend Builder Stage**: Builds the Go application
- **Production Stage**: Combines both applications in a single Alpine Linux container with:
  - Nginx as reverse proxy (port 80)
  - Go backend API (internal port 5001)
  - Next.js frontend (internal port 3000)
  - Supervisor to manage all processes

## Quick Start

### Option 1: Using Build Scripts

**Linux/macOS:**
```bash
chmod +x docker-build.sh
./docker-build.sh
```

**Windows (PowerShell):**
```powershell
.\docker-build.ps1
```

### Option 2: Using Docker Compose

```bash
# Build and start the application
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop the application
docker-compose down
```

### Option 3: Manual Docker Commands

```bash
# Build the image
docker build -t go-ciesa-4.0:latest .

# Run the container
docker run -d \
  --name go-ciesa-app \
  -p 80:80 \
  -v go-ciesa-uploads:/uploads \
  -v go-ciesa-logs:/logs \
  --restart unless-stopped \
  go-ciesa-4.0:latest
```

## Access Points

Once running, the application is available at:

- **Main Application**: http://localhost
- **API Endpoints**: http://localhost/api/
- **Health Check**: http://localhost/health

## Build Script Options

### Linux/macOS (docker-build.sh)

```bash
./docker-build.sh [OPTIONS]

Options:
  -t, --tag TAG        Docker image tag (default: latest)
  -p, --port PORT      Host port to bind (default: 80)
  -n, --name NAME      Container name (default: go-ciesa-app)
  --build-only         Only build the image, don't run
  --clean              Clean up existing containers and images
  -h, --help           Show help message
```

### Windows (docker-build.ps1)

```powershell
.\docker-build.ps1 [OPTIONS]

Options:
  -Tag TAG             Docker image tag (default: latest)
  -Port PORT           Host port to bind (default: 80)
  -Name NAME           Container name (default: go-ciesa-app)
  -BuildOnly           Only build the image, don't run
  -Clean               Clean up existing containers and images
  -Help                Show help message
```

## Examples

```bash
# Build with custom tag and port
./docker-build.sh -t v2.0 -p 8080

# Build only (don't run)
./docker-build.sh --build-only

# Clean build (remove existing containers/images first)
./docker-build.sh --clean

# Custom container name
./docker-build.sh -n my-go-ciesa
```

## Container Management

```bash
# View container status
docker ps

# View logs
docker logs go-ciesa-app

# Follow logs in real-time
docker logs -f go-ciesa-app

# Stop container
docker stop go-ciesa-app

# Start stopped container
docker start go-ciesa-app

# Remove container
docker rm go-ciesa-app

# Remove image
docker rmi go-ciesa-4.0:latest
```

## Development Mode

For development with Docker Compose:

```bash
# Start development version (if configured)
docker-compose --profile dev up

# This runs on port 8080 by default
```

## Volumes

The container uses named volumes for persistent data:

- `go-ciesa-uploads`: Stores uploaded files
- `go-ciesa-logs`: Stores application logs

## Health Checks

The container includes built-in health checks:

- **Endpoint**: http://localhost/health
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3
- **Start Period**: 30 seconds

## Nginx Configuration

The internal Nginx configuration:

- **Frontend**: All requests to `/` are proxied to Next.js (port 3000)
- **API**: All requests to `/api/` are proxied to Go backend (port 5001)
- **Health**: Requests to `/health` are proxied to Go backend
- **Static Files**: Next.js static files are cached for 1 year

## Process Management

Supervisor manages three processes:

1. **backend**: Go API server
2. **frontend**: Next.js application
3. **nginx**: Reverse proxy

## Troubleshooting

### Container won't start
```bash
# Check container logs
docker logs go-ciesa-app

# Check if ports are available
netstat -tulpn | grep :80
```

### Build fails
```bash
# Clean build with verbose output
docker build --no-cache --progress=plain -t go-ciesa-4.0:latest .
```

### Permission issues
```bash
# Check volume permissions
docker exec -it go-ciesa-app ls -la /uploads /logs
```

### Service not responding
```bash
# Check internal processes
docker exec -it go-ciesa-app supervisorctl status

# Check nginx configuration
docker exec -it go-ciesa-app nginx -t
```

## Migration from Previous Setup

The new combined setup replaces the previous multi-container setup. Key changes:

1. **Single Container**: Instead of separate frontend/backend containers
2. **Single Port**: Everything accessible through port 80
3. **Internal Routing**: Nginx handles routing between frontend/backend
4. **Simplified Management**: One container to manage instead of multiple

## Performance Benefits

- **Reduced Resource Usage**: Single container vs multiple containers
- **Faster Startup**: No inter-container communication setup
- **Simplified Networking**: No need for Docker networks
- **Better Caching**: Shared filesystem for static assets
