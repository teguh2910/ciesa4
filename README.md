# GO-CIESA-4.0

A modern, high-performance solution for generating and sending JSON responses to Indonesian customs/import API endpoints. Built with **Next.js frontend** and **Go API backend** for optimal performance, scalability, and user experience.

## 🚀 Quick Start with Docker

The easiest way to get started is using the pre-built Docker image:

```bash
# Pull the Docker image
docker pull teguhyuhono/gociesa:latest

# Run the container
docker run -d \
  --name go-ciesa-app \
  -p 80:80 \
  -v go-ciesa-uploads:/uploads \
  -v go-ciesa-logs:/logs \
  --restart unless-stopped \
  teguhyuhono/gociesa:latest
```

Once running, access the application at:
- **Main Application**: http://localhost
- **API Endpoints**: http://localhost/api/
- **Health Check**: http://localhost/health

### Using Docker Compose

Alternatively, you can use Docker Compose:

```bash
# Create a docker-compose.yml file
cat > docker-compose.yml << EOL
version: '3.8'

services:
  app:
    image: teguhyuhono/gociesa:latest
    container_name: go-ciesa-app
    ports:
      - "80:80"
    environment:
      - TZ=UTC
      - NODE_ENV=production
      - GIN_MODE=release
    volumes:
      - uploads:/uploads
      - logs:/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

volumes:
  uploads:
    driver: local
  logs:
    driver: local
EOL

# Start the application
docker-compose up -d
```

## ✨ Features

### 🌐 Modern Web Interface (Next.js)
- **React-based dashboard** with responsive Tailwind CSS design
- **Step-by-step wizard forms** with real-time validation
- **Drag-and-drop Excel upload** with progress indicators
- **Syntax-highlighted JSON preview** with copy/download functionality
- **Real-time API status monitoring** and health checks
- **Mobile-first responsive design** optimized for all devices

### 🔧 Go API Backend
- **RESTful API** built with Gin framework and CORS support
- **High-performance Excel processing** with excelize library
- **Comprehensive data validation** using Go structs and validation tags
- **Multiple authentication methods** (API Key, Basic Auth, No Auth)
- **OAuth 2.0 Support** for CEISA 4.0 API authentication
- **Automatic Token Refresh** with secure token management

## 📡 API Endpoints

- **Health & Configuration**
  - `GET /api/health` - Health check
  - `GET /api/config` - Get application configuration

- **Excel Operations**
  - `POST /api/upload-excel` - Upload and parse Excel files
  - `GET /api/download-template` - Download Excel template

- **JSON Generation**
  - `POST /api/generate-json` - Generate JSON from form/Excel data
  - `GET /api/sample-data` - Get sample data

- **API Integration**
  - `POST /api/test-connection` - Test API connection
  - `POST /api/send-to-api` - Send data to external API

- **OAuth 2.0 Authentication**
  - `POST /api/oauth/login` - OAuth 2.0 login with CEISA 4.0 credentials
  - `POST /api/oauth/refresh` - Refresh access token
  - `GET /api/oauth/status` - Get current authentication status
  - `GET/POST /api/oauth/config` - Manage OAuth 2.0 configuration
  - `POST /api/oauth/logout` - Clear stored tokens

## 🐳 Container Management

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
```

## 🔍 Troubleshooting

### Container won't start
```bash
# Check container logs
docker logs go-ciesa-app

# Check if ports are available
netstat -tulpn | grep :80
```

### Service not responding
```bash
# Check internal processes
docker exec -it go-ciesa-app supervisorctl status

# Check nginx configuration
docker exec -it go-ciesa-app nginx -t
```

### Permission issues
```bash
# Check volume permissions
docker exec -it go-ciesa-app ls -la /uploads /logs
```

## 🏗️ Architecture

The Docker container includes:

- **Nginx** as reverse proxy (port 80)
- **Go backend API** (internal port 5001)
- **Next.js frontend** (internal port 3000)
- **Supervisor** to manage all processes

The internal Nginx configuration:
- **Frontend**: All requests to `/` are proxied to Next.js (port 3000)
- **API**: All requests to `/api/` are proxied to Go backend (port 5001)
- **Health**: Requests to `/health` are proxied to Go backend
- **Static Files**: Next.js static files are cached for 1 year