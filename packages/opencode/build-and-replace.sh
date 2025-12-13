#!/bin/bash

# OpenCode Build and Replace Script
# This script builds OpenCode and replaces the binary automatically

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo -e "${BLUE}🔨 OpenCode Build and Replace Script${NC}"
echo -e "${BLUE}===================================${NC}"

# Check if running from correct directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    print_error "This script must be run from the opencode package directory"
    exit 1
fi

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    print_error "Bun is not installed or not in PATH"
    exit 1
fi

print_status "Using Bun version: $(bun --version)"

# Step 1: Install dependencies
print_status "Step 1: Installing dependencies..."
bun install

# Step 2: Build OpenCode
print_status "Step 2: Building OpenCode..."
OPENCODE_CHANNEL=latest OPENCODE_VERSION=1.0.150 bun run ./script/build.ts --single

# Check if build was successful
BINARY_PATH="./dist/opencode-linux-x64/bin/opencode"
if [ ! -f "$BINARY_PATH" ]; then
    print_error "Build failed - binary not found: $BINARY_PATH"
    exit 1
fi

# Get build version
BUILD_VERSION=$("$BINARY_PATH" --version 2>/dev/null || echo "unknown")
print_status "Build completed - Version: $BUILD_VERSION"

# Step 3: Replace binary
print_status "Step 3: Replacing system binary..."

# Run the replacement script
if [ -f "./replace-opencode.sh" ]; then
    print_status "Running replacement script..."
    ./replace-opencode.sh linux-x64
else
    print_error "replace-opencode.sh not found"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Build and replace completed successfully!${NC}"
echo -e "${GREEN}📍 You can now use your custom OpenCode build${NC}"