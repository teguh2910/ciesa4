# Windows PowerShell commands for JSON Response Generator (Go + Next.js)
# This script provides Windows alternatives to the Makefile commands

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

$ErrorActionPreference = "Stop"

# Configuration
$APP_NAME = "json-response-generator"
$BINARY_NAME = "json-response-generator.exe"
$REGISTRY = "ghcr.io"
$IMAGE_NAME = "$REGISTRY/$APP_NAME"
$VERSION = if (git describe --tags --always --dirty 2>$null) { git describe --tags --always --dirty } else { "latest" }
$BUILD_DATE = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
$DOCKER_COMPOSE = "docker-compose"
$DOCKER = "docker"

function Show-Help {
    Write-Host @"
JSON Response Generator - Windows Commands (Go + Next.js)
========================================================

Usage: .\scripts\windows-commands.ps1 <command>

Available commands:
  build          - Build Go binary
  build-docker   - Build Docker image
  build-nc       - Build Docker image without cache
  up             - Start all services with docker-compose
  down           - Stop all services
  restart        - Restart all services
  test           - Run Go tests
  test-frontend  - Run frontend tests
  run            - Build and run Go application locally
  dev            - Run with hot reload (requires air)
  logs           - Show logs for all services
  logs-api       - Show logs for API service
  logs-frontend  - Show logs for frontend service
  clean          - Clean up containers and volumes
  clean-all      - Clean up everything including images
  status         - Show service status
  deps           - Download Go dependencies
  help           - Show this help message

Examples:
  .\scripts\windows-commands.ps1 up
  .\scripts\windows-commands.ps1 build
  .\scripts\windows-commands.ps1 run
  .\scripts\windows-commands.ps1 logs
"@
}

function Build-Go {
    Write-Host "Building Go application..." -ForegroundColor Yellow
    go build -o $BINARY_NAME -v ./...
    Write-Host "✅ Go build completed: $BINARY_NAME" -ForegroundColor Green
}

function Build-Image {
    Write-Host "Building Docker image..." -ForegroundColor Yellow
    & $DOCKER build -t "$IMAGE_NAME`:$VERSION" `
        --build-arg "BUILD_DATE=$BUILD_DATE" `
        --build-arg "GIT_COMMIT=$(git rev-parse --short HEAD 2>$null || 'unknown')" `
        --build-arg "VERSION=$VERSION" `
        .
    Write-Host "✅ Build completed: $IMAGE_NAME`:$VERSION" -ForegroundColor Green
}

function Build-Image-NoCache {
    Write-Host "Building Docker image without cache..." -ForegroundColor Yellow
    & $DOCKER build --no-cache -t "$IMAGE_NAME`:$VERSION" `
        --build-arg "BUILD_DATE=$BUILD_DATE" `
        --build-arg "GIT_COMMIT=$(git rev-parse --short HEAD 2>$null || 'unknown')" `
        --build-arg "VERSION=$VERSION" `
        .
    Write-Host "✅ Build completed: $IMAGE_NAME`:$VERSION" -ForegroundColor Green
}

function Start-Services {
    Write-Host "Starting services..." -ForegroundColor Yellow
    & $DOCKER_COMPOSE up -d
    Write-Host "✅ Services started" -ForegroundColor Green
}

function Stop-Services {
    Write-Host "Stopping services..." -ForegroundColor Yellow
    & $DOCKER_COMPOSE down
    Write-Host "✅ Services stopped" -ForegroundColor Green
}

function Restart-Services {
    Stop-Services
    Start-Services
}

function Run-GoTests {
    Write-Host "Running Go tests..." -ForegroundColor Yellow
    go test -v ./...
    Write-Host "✅ Go tests completed" -ForegroundColor Green
}

function Run-FrontendTests {
    Write-Host "Running frontend tests..." -ForegroundColor Yellow
    Set-Location frontend
    npm test
    Set-Location ..
    Write-Host "✅ Frontend tests completed" -ForegroundColor Green
}

function Run-GoApp {
    Write-Host "Building and running Go application..." -ForegroundColor Yellow
    go build -o $BINARY_NAME -v ./...
    & ".\$BINARY_NAME"
}

function Download-Dependencies {
    Write-Host "Downloading Go dependencies..." -ForegroundColor Yellow
    go mod download
    go mod tidy
    Write-Host "✅ Dependencies updated" -ForegroundColor Green
}

function Show-Logs {
    & $DOCKER_COMPOSE logs -f
}

function Show-AppLogs {
    & $DOCKER_COMPOSE logs -f app
}

function Clean-Up {
    Write-Host "Cleaning up..." -ForegroundColor Yellow
    & $DOCKER_COMPOSE down -v --remove-orphans
    & $DOCKER system prune -f
    Write-Host "✅ Cleanup completed" -ForegroundColor Green
}

function Clean-UpAll {
    Write-Host "Cleaning up everything..." -ForegroundColor Yellow
    & $DOCKER_COMPOSE down -v --remove-orphans --rmi all
    & $DOCKER system prune -af
    Write-Host "✅ Complete cleanup completed" -ForegroundColor Green
}

function Show-Status {
    Write-Host "Service status:" -ForegroundColor Yellow
    & $DOCKER_COMPOSE ps
}

function Open-Shell {
    & $DOCKER_COMPOSE exec app sh
}

# Main command switch
switch ($Command.ToLower()) {
    "build" { Build-Go }
    "build-docker" { Build-Image }
    "build-nc" { Build-Image-NoCache }
    "up" { Start-Services }
    "down" { Stop-Services }
    "restart" { Restart-Services }
    "test" { Run-GoTests }
    "test-frontend" { Run-FrontendTests }
    "run" { Run-GoApp }
    "dev" {
        Write-Host "Starting development mode with air..." -ForegroundColor Yellow
        air
    }
    "deps" { Download-Dependencies }
    "logs" { Show-Logs }
    "logs-api" { Show-Logs }
    "logs-frontend" { Show-Logs }
    "clean" { Clean-Up }
    "clean-all" { Clean-UpAll }
    "status" { Show-Status }
    "help" { Show-Help }
    default {
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Show-Help
    }
}