# Combined Docker Build Script for GO-CIESA-4.0 (PowerShell)
# This script builds and runs the combined frontend + backend container

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [string]$Tag = "latest",

    [Parameter(Mandatory=$false)]
    [int]$Port = 80,

    [Parameter(Mandatory=$false)]
    [string]$Name = "go-ciesa-app",

    [Parameter(Mandatory=$false)]
    [switch]$BuildOnly,

    [Parameter(Mandatory=$false)]
    [switch]$Clean,

    [Parameter(Mandatory=$false)]
    [switch]$Help
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Cyan"

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

# Show help
if ($Help) {
    Write-Host "Usage: .\docker-build.ps1 [OPTIONS]"
    Write-Host "Options:"
    Write-Host "  -Tag TAG             Docker image tag (default: latest)"
    Write-Host "  -Port PORT           Host port to bind (default: 80)"
    Write-Host "  -Name NAME           Container name (default: go-ciesa-app)"
    Write-Host "  -BuildOnly           Only build the image, don't run"
    Write-Host "  -Clean               Clean up existing containers and images"
    Write-Host "  -Help                Show this help message"
    exit 0
}

$ImageName = "go-ciesa-4.0"
$ContainerName = $Name

# Clean up if requested
if ($Clean) {
    Write-Status "Cleaning up existing containers and images..."
    
    # Stop and remove existing container
    $existingContainer = docker ps -a --format "table {{.Names}}" | Select-String "^$ContainerName$"
    if ($existingContainer) {
        Write-Status "Stopping and removing existing container: $ContainerName"
        docker stop $ContainerName 2>$null
        docker rm $ContainerName 2>$null
    }
    
    # Remove existing image
    $existingImage = docker images --format "table {{.Repository}}:{{.Tag}}" | Select-String "^${ImageName}:${Tag}$"
    if ($existingImage) {
        Write-Status "Removing existing image: ${ImageName}:${Tag}"
        docker rmi "${ImageName}:${Tag}" 2>$null
    }
    
    Write-Success "Cleanup completed"
}

# Build the Docker image
Write-Status "Building Docker image: ${ImageName}:${Tag}"
Write-Status "This may take several minutes..."

$buildResult = docker build -t "${ImageName}:${Tag}" .
if ($LASTEXITCODE -eq 0) {
    Write-Success "Docker image built successfully: ${ImageName}:${Tag}"
} else {
    Write-Error "Failed to build Docker image"
    exit 1
}

# Exit if build-only mode
if ($BuildOnly) {
    Write-Success "Build completed. Use 'docker run' to start the container."
    exit 0
}

# Stop existing container if running
$runningContainer = docker ps --format "table {{.Names}}" | Select-String "^$ContainerName$"
if ($runningContainer) {
    Write-Warning "Stopping existing container: $ContainerName"
    docker stop $ContainerName
}

# Remove existing container if exists
$existingContainer = docker ps -a --format "table {{.Names}}" | Select-String "^$ContainerName$"
if ($existingContainer) {
    Write-Status "Removing existing container: $ContainerName"
    docker rm $ContainerName
}

# Run the container
Write-Status "Starting container: $ContainerName on port $Port"

$runResult = docker run -d `
    --name $ContainerName `
    -p "${Port}:80" `
    -v "go-ciesa-uploads:/uploads" `
    -v "go-ciesa-logs:/logs" `
    --restart unless-stopped `
    "${ImageName}:${Tag}"

if ($LASTEXITCODE -eq 0) {
    Write-Success "Container started successfully!"
    Write-Status "Application is available at: http://localhost:$Port"
    Write-Status "API endpoints are available at: http://localhost:$Port/api/"
    Write-Status "Health check: http://localhost:$Port/health"
    
    # Show container status
    Write-Host ""
    Write-Status "Container status:"
    docker ps --filter "name=$ContainerName" --format "table {{.Names}}`t{{.Status}}`t{{.Ports}}"
    
    # Show logs
    Write-Host ""
    Write-Status "Container logs (last 10 lines):"
    docker logs --tail 10 $ContainerName
    
    Write-Host ""
    Write-Status "To view live logs: docker logs -f $ContainerName"
    Write-Status "To stop container: docker stop $ContainerName"
    
} else {
    Write-Error "Failed to start container"
    exit 1
}
