#!/bin/bash

# Script to replace OpenCode binary with custom build
# Usage: ./replace-opencode.sh [variant]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VARIANT="${1:-linux-x64}"
BINARY_PATH="/home/son/.opencode/bin/opencode"
BUILD_DIR="./dist"
PROJECT_DIR="/home/son/project/opencode/packages/opencode"

echo -e "${BLUE}🔄 OpenCode Binary Replacement Script${NC}"
echo -e "${BLUE}=======================================${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running from correct directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    print_error "This script must be run from the opencode package directory"
    exit 1
fi

# Change to project directory
cd "$PROJECT_DIR"

# Check if build exists
BINARY_NAME="opencode-${VARIANT}"
BINARY_PATH_BUILD="${BUILD_DIR}/${BINARY_NAME}/bin/opencode"

if [ ! -f "$BINARY_PATH_BUILD" ]; then
    print_error "Binary not found: $BINARY_PATH_BUILD"
    echo -e "${YELLOW}Available variants:${NC}"
    ls -1 "$BUILD_DIR" 2>/dev/null | grep "^opencode-" || echo "No builds found"
    echo ""
    echo -e "${BLUE}To build the binary first, run:${NC}"
    echo -e "  ./script/build.ts --single"
    exit 1
fi

print_status "Using variant: $BINARY_NAME"
print_status "Source binary: $BINARY_PATH_BUILD"
print_status "Target binary: $BINARY_PATH"

# Check if target binary exists
if [ ! -f "$BINARY_PATH" ]; then
    print_error "Target binary not found: $BINARY_PATH"
    exit 1
fi

# Get current version
if [ -f "$BINARY_PATH" ]; then
    CURRENT_VERSION=$("$BINARY_PATH" --version 2>/dev/null || echo "unknown")
    print_status "Current version: $CURRENT_VERSION"
fi

# Get new version
NEW_VERSION=$("$BINARY_PATH_BUILD" --version 2>/dev/null || echo "unknown")
print_status "New version: $NEW_VERSION"

# Check if opencode processes are running
OPENCODE_PIDS=$(pgrep -f "$BINARY_PATH" 2>/dev/null || true)
if [ -n "$OPENCODE_PIDS" ]; then
    print_warning "OpenCode processes are running. Stopping them..."
    echo "$OPENCODE_PIDS" | xargs -r kill -TERM
    sleep 2
    
    # Force kill if still running
    REMAINING_PIDS=$(pgrep -f "$BINARY_PATH" 2>/dev/null || true)
    if [ -n "$REMAINING_PIDS" ]; then
        print_warning "Force killing remaining processes..."
        echo "$REMAINING_PIDS" | xargs -r kill -9
        sleep 1
    fi
else
    print_status "No OpenCode processes running"
fi

# Replace binary
print_status "Replacing binary..."
cp "$BINARY_PATH_BUILD" "$BINARY_PATH"
chmod +x "$BINARY_PATH"

# Verify replacement
if [ -f "$BINARY_PATH" ]; then
    VERIFIED_VERSION=$("$BINARY_PATH" --version 2>/dev/null || echo "verification failed")
    if [ "$VERIFIED_VERSION" = "$NEW_VERSION" ]; then
        print_status "Binary replacement successful!"
        print_status "Verified version: $VERIFIED_VERSION"
        
        # Show binary info
        BINARY_SIZE=$(du -h "$BINARY_PATH" | cut -f1)
        print_status "Binary size: $BINARY_SIZE"
        
        # Test basic functionality
        print_status "Testing basic functionality..."
        if "$BINARY_PATH" --help >/dev/null 2>&1; then
            print_status "Help command works ✓"
        else
            print_warning "Help command failed"
        fi
        
        if "$BINARY_PATH" models >/dev/null 2>&1; then
            print_status "Models command works ✓"
        else
            print_warning "Models command failed"
        fi
        
    else
        print_error "Version verification failed!"
        print_error "Expected: $NEW_VERSION"
        print_error "Got: $VERIFIED_VERSION"
        exit 1
    fi
else
    print_error "Binary replacement failed - file not found"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ OpenCode binary replacement completed successfully!${NC}"
echo -e "${GREEN}📍 Location: $BINARY_PATH${NC}"
echo -e "${GREEN}🔢 Version: $VERIFIED_VERSION${NC}"
echo ""
echo -e "${BLUE}You can now use:${NC}"
echo -e "  opencode --version"
echo -e "  opencode --help"
echo -e "  opencode models"