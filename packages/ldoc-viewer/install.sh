#!/usr/bin/env bash
# LDOC-Viewer Linux Installer
# J-AI-ENTERPRISES (c) 2026

set -e
INSTALL_DIR="$HOME/.local/share/ldoc-viewer"
BIN_DIR="$HOME/.local/bin"
DESKTOP_DIR="$HOME/.local/share/applications"
ICON_DIR="$HOME/.local/share/icons/hicolor/128x128/apps"

mkdir -p "$INSTALL_DIR" "$BIN_DIR" "$DESKTOP_DIR" "$ICON_DIR"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Installing LDOC Viewer to $INSTALL_DIR..."
cp -rf "$SCRIPT_DIR/"* "$INSTALL_DIR/"
chmod +x "$INSTALL_DIR/ldoc-viewer.sh"

# Install icon if exists
if [ -f "$SCRIPT_DIR/ldoc_logo.png" ]; then
    cp "$SCRIPT_DIR/ldoc_logo.png" "$ICON_DIR/ldoc_viewer.png"
fi

# Link binary
ln -sf "$INSTALL_DIR/ldoc-viewer.sh" "$BIN_DIR/ldoc-viewer"

# Create Desktop Entry
cat <<EOF > "$DESKTOP_DIR/ldoc-viewer.desktop"
[Desktop Entry]
Version=1.0
Type=Application
Name=LDOC Free Viewer
GenericName=Living Document Reader
Comment=Free offline reader for Living Documents (.ldocx)
Exec=$BIN_DIR/ldoc-viewer %U
Icon=ldoc_viewer
Terminal=false
Categories=Office;Viewer;Graphics;
MimeType=application/x-ldocx;application/x-ldoc;
EOF

chmod +x "$DESKTOP_DIR/ldoc-viewer.desktop"

# Update desktop database
if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true
fi

echo "✓ LDOC Viewer installed successfully!"
echo "  Run 'ldoc-viewer' in terminal or launch from Applications menu."
