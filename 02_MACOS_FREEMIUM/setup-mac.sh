#!/bin/bash
# ==============================================================================
# LDOC Living Document Suite - macOS 1-Click Installer
# Copyright (c) 2026 J AI ENTERPRISES. All Rights Reserved.
# ==============================================================================

set -e

echo "========================================================"
echo "   LDOC Living Document Suite - macOS Installer"
echo "   Vendor: J AI ENTERPRISES"
echo "========================================================"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APPS_DIR="/Applications"
USER_APPS_DIR="$HOME/Applications"

TARGET_DIR="$APPS_DIR"
if [ ! -w "$APPS_DIR" ]; then
    echo "Notice: /Applications requires administrator permissions. Installing to $USER_APPS_DIR instead."
    mkdir -p "$USER_APPS_DIR"
    TARGET_DIR="$USER_APPS_DIR"
fi

echo "Installing to: $TARGET_DIR"

# Copy LDOC Free Viewer.app
if [ -d "$SCRIPT_DIR/LDOC Free Viewer.app" ]; then
    echo "-> Installing LDOC Free Viewer..."
    rm -rf "$TARGET_DIR/LDOC Free Viewer.app"
    cp -R "$SCRIPT_DIR/LDOC Free Viewer.app" "$TARGET_DIR/"
    chmod +x "$TARGET_DIR/LDOC Free Viewer.app/Contents/MacOS/ldoc-viewer"
    xattr -cr "$TARGET_DIR/LDOC Free Viewer.app" 2>/dev/null || true
    echo "   ✓ LDOC Free Viewer installed successfully."
fi

# Copy LDOC Free Editor.app
if [ -d "$SCRIPT_DIR/LDOC Free Editor.app" ]; then
    echo "-> Installing LDOC Free Editor..."
    rm -rf "$TARGET_DIR/LDOC Free Editor.app"
    cp -R "$SCRIPT_DIR/LDOC Free Editor.app" "$TARGET_DIR/"
    chmod +x "$TARGET_DIR/LDOC Free Editor.app/Contents/MacOS/ldoc-editor"
    xattr -cr "$TARGET_DIR/LDOC Free Editor.app" 2>/dev/null || true
    echo "   ✓ LDOC Free Editor installed successfully."
fi

echo ""
echo "========================================================"
echo "Installation complete! Applications are ready in $TARGET_DIR."
echo "You can launch them from Launchpad or Finder -> Applications."
echo "========================================================"
