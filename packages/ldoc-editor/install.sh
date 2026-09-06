#!/usr/bin/env bash
# LDOC-Editor Linux Installer
# J-AI-ENTERPRISES (c) 2026

set -e
INSTALL_DIR="$HOME/.local/share/ldoc-editor"
BIN_DIR="$HOME/.local/bin"
DESKTOP_DIR="$HOME/.local/share/applications"
ICON_DIR="$HOME/.local/share/icons/hicolor/128x128/apps"

mkdir -p "$INSTALL_DIR" "$BIN_DIR" "$DESKTOP_DIR" "$ICON_DIR"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Installing LDOC Editor to $INSTALL_DIR..."
cp -rf "$SCRIPT_DIR/"* "$INSTALL_DIR/"
chmod +x "$INSTALL_DIR/ldoc-editor.sh"

if [ -f "$SCRIPT_DIR/ldoc_logo.png" ]; then
    cp "$SCRIPT_DIR/ldoc_logo.png" "$ICON_DIR/ldoc_editor.png"
fi

ln -sf "$INSTALL_DIR/ldoc-editor.sh" "$BIN_DIR/ldoc-editor"

cat <<EOF > "$DESKTOP_DIR/ldoc-editor.desktop"
[Desktop Entry]
Version=1.0
Type=Application
Name=LDOC Free Editor
GenericName=Living Document Editor & Converter
Comment=Visual editor and Markdown/Text/CSV converter for Living Documents (.ldocx)
Exec=$BIN_DIR/ldoc-editor %U
Icon=ldoc_editor
Terminal=false
Categories=Office;Development;Graphics;
MimeType=application/x-ldocx;application/x-ldoc;
EOF

chmod +x "$DESKTOP_DIR/ldoc-editor.desktop"

if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true
fi

echo "✓ LDOC Editor installed successfully!"
echo "  Run 'ldoc-editor' in terminal or launch from Applications menu."
