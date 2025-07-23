#!/bin/bash

# Combined Docker Build Script for GO-CIESA-4.0
# This script builds and runs the combined frontend + backend container

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Default values
IMAGE_NAME="go-ciesa-4.0"
TAG="latest"
CONTAINER_NAME="go-ciesa-app"
PORT="80"
BUILD_ONLY=false
CLEAN=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--tag)
            TAG="$2"
            shift 2
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -n|--name)
            CONTAINER_NAME="$2"
            shift 2
            ;;
        --build-only)
            BUILD_ONLY=true
            shift
            ;;
        --clean)
            CLEAN=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -t, --tag TAG        Docker image tag (default: latest)"
            echo "  -p, --port PORT      Host port to bind (default: 80)"
            echo "  -n, --name NAME      Container name (default: json-generator-app)"
            echo "  --build-only         Only build the image, don't run"
            echo "  --clean              Clean up existing containers and images"
            echo "  -h, --help           Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Clean up if requested
if [ "$CLEAN" = true ]; then
    print_status "Cleaning up existing containers and images..."
    
    # Stop and remove existing container
    if docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_status "Stopping and removing existing container: $CONTAINER_NAME"
        docker stop "$CONTAINER_NAME" 2>/dev/null || true
        docker rm "$CONTAINER_NAME" 2>/dev/null || true
    fi
    
    # Remove existing image
    if docker images --format 'table {{.Repository}}:{{.Tag}}' | grep -q "^${IMAGE_NAME}:${TAG}$"; then
        print_status "Removing existing image: $IMAGE_NAME:$TAG"
        docker rmi "$IMAGE_NAME:$TAG" 2>/dev/null || true
    fi
    
    print_success "Cleanup completed"
fi

# Build the Docker image
print_status "Building Docker image: $IMAGE_NAME:$TAG"
print_status "This may take several minutes..."

if docker build -t "$IMAGE_NAME:$TAG" .; then
    print_success "Docker image built successfully: $IMAGE_NAME:$TAG"
else
    print_error "Failed to build Docker image"
    exit 1
fi

# Exit if build-only mode
if [ "$BUILD_ONLY" = true ]; then
    print_success "Build completed. Use 'docker run' to start the container."
    exit 0
fi

# Stop existing container if running
if docker ps --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    print_warning "Stopping existing container: $CONTAINER_NAME"
    docker stop "$CONTAINER_NAME"
fi

# Remove existing container if exists
if docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    print_status "Removing existing container: $CONTAINER_NAME"
    docker rm "$CONTAINER_NAME"
fi

# Run the container
print_status "Starting container: $CONTAINER_NAME on port $PORT"

if docker run -d \
    --name "$CONTAINER_NAME" \
    -p "$PORT:80" \
    -v go-ciesa-uploads:/uploads \
    -v go-ciesa-logs:/logs \
    --restart unless-stopped \
    "$IMAGE_NAME:$TAG"; then
    
    print_success "Container started successfully!"
    print_status "Application is available at: http://localhost:$PORT"
    print_status "API endpoints are available at: http://localhost:$PORT/api/"
    print_status "Health check: http://localhost:$PORT/health"
    
    # Show container status
    echo ""
    print_status "Container status:"
    docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    # Show logs
    echo ""
    print_status "Container logs (last 10 lines):"
    docker logs --tail 10 "$CONTAINER_NAME"
    
    echo ""
    print_status "To view live logs: docker logs -f $CONTAINER_NAME"
    print_status "To stop container: docker stop $CONTAINER_NAME"
    
else
    print_error "Failed to start container"
    exit 1
fi
