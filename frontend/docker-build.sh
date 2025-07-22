#!/bin/bash

# Docker build script for Next.js frontend
# Usage: ./docker-build.sh [development|production] [tag]

set -e

# Default values
TARGET=${1:-production}
TAG=${2:-latest}
IMAGE_NAME="json-response-generator-frontend"

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

# Validate target
if [[ "$TARGET" != "development" && "$TARGET" != "production" ]]; then
    print_error "Invalid target: $TARGET. Use 'development' or 'production'"
    exit 1
fi

print_status "Building Docker image for $TARGET environment..."
print_status "Image name: $IMAGE_NAME:$TAG-$TARGET"

# Build the Docker image
docker build \
    --target $TARGET \
    --tag $IMAGE_NAME:$TAG-$TARGET \
    --tag $IMAGE_NAME:$TARGET \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    --progress=plain \
    .

if [ $? -eq 0 ]; then
    print_success "Docker image built successfully!"
    print_status "Image: $IMAGE_NAME:$TAG-$TARGET"
    
    # Show image size
    SIZE=$(docker images $IMAGE_NAME:$TAG-$TARGET --format "table {{.Size}}" | tail -n 1)
    print_status "Image size: $SIZE"
    
    # Show image layers (optional)
    if command -v dive &> /dev/null; then
        print_status "Run 'dive $IMAGE_NAME:$TAG-$TARGET' to analyze image layers"
    else
        print_warning "Install 'dive' to analyze Docker image layers: https://github.com/wagoodman/dive"
    fi
    
else
    print_error "Docker build failed!"
    exit 1
fi

print_success "Build completed successfully!"
echo
print_status "To run the container:"
if [[ "$TARGET" == "development" ]]; then
    echo "  docker run -p 3000:3000 -v \$(pwd):/app $IMAGE_NAME:$TAG-$TARGET"
else
    echo "  docker run -p 3000:3000 $IMAGE_NAME:$TAG-$TARGET"
fi
echo
print_status "To push to registry:"
echo "  docker push $IMAGE_NAME:$TAG-$TARGET"
