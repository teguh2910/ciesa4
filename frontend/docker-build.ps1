# Docker build script for Next.js frontend
# Usage: .\docker-build.ps1 [development|production] [tag]

param(
    [Parameter(Position=0)]
    [ValidateSet("development", "production")]
    [string]$Target = "production",
    
    [Parameter(Position=1)]
    [string]$Tag = "latest"
)

$ErrorActionPreference = "Stop"

# Configuration
$ImageName = "json-response-generator-frontend"
$FullImageName = "${ImageName}:${Tag}-${Target}"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

Write-Status "Building Docker image for $Target environment..."
Write-Status "Image name: $FullImageName"

try {
    # Build the Docker image
    Write-Status "Starting Docker build..."
    
    docker build `
        --target $Target `
        --tag $FullImageName `
        --tag "${ImageName}:${Target}" `
        --build-arg BUILDKIT_INLINE_CACHE=1 `
        --progress=plain `
        .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Docker image built successfully!"
        Write-Status "Image: $FullImageName"
        
        # Show image size
        $Size = docker images $FullImageName --format "table {{.Size}}" | Select-Object -Last 1
        Write-Status "Image size: $Size"
        
        # Check if dive is available
        if (Get-Command dive -ErrorAction SilentlyContinue) {
            Write-Status "Run 'dive $FullImageName' to analyze image layers"
        } else {
            Write-Warning "Install 'dive' to analyze Docker image layers: https://github.com/wagoodman/dive"
        }
        
        Write-Success "Build completed successfully!"
        Write-Host ""
        Write-Status "To run the container:"
        
        if ($Target -eq "development") {
            Write-Host "  docker run -p 3000:3000 -v `${PWD}:/app $FullImageName"
        } else {
            Write-Host "  docker run -p 3000:3000 $FullImageName"
        }
        
        Write-Host ""
        Write-Status "To push to registry:"
        Write-Host "  docker push $FullImageName"
        
    } else {
        Write-Error "Docker build failed!"
        exit 1
    }
    
} catch {
    Write-Error "An error occurred during the build process: $_"
    exit 1
}
