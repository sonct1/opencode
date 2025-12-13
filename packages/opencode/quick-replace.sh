#!/bin/bash

OPENCODE_BIN="/home/son/.opencode/bin/opencode"
BUILD_BIN="./dist/opencode-linux-x64/bin/opencode"

echo "🔄 Replacing OpenCode binary..."

pkill -f "$OPENCODE_BIN" 2>/dev/null || true
sleep 2

cp "$BUILD_BIN" "$OPENCODE_BIN"
chmod +x "$OPENCODE_BIN"

NEW_VERSION=$("$OPENCODE_BIN" --version 2>/dev/null)
echo "✅ Done! New version: $NEW_VERSION"