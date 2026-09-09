#!/usr/bin/env bash
# ===========================================================
#   LDOC Freemium Suite — Unified Linux Setup Wizard
#   J AI ENTERPRISES (c) 2026 | Apache License 2.0
# ===========================================================

set -e

echo ""
echo "==========================================================="
echo "   [*] LDOC Freemium Suite — Linux Setup Wizard"
echo "   Living Document (.ldocx) Free Viewer, Editor & SDK"
echo "   J AI ENTERPRISES (c) 2026"
echo "==========================================================="
echo ""

INSTALL_PREFIX="${1:-$HOME/.local}"
BIN_DIR="$INSTALL_PREFIX/bin"
SHARE_DIR="$INSTALL_PREFIX/share/ldoc"
DESKTOP_DIR="$HOME/.local/share/applications"
MIME_DIR="$HOME/.local/share/mime/packages"

mkdir -p "$BIN_DIR" "$SHARE_DIR" "$DESKTOP_DIR" "$MIME_DIR"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. Install Viewer
echo "--> Installing LDOC Free Viewer..."
mkdir -p "$SHARE_DIR/viewer"
if [ -f "$SCRIPT_DIR/ldoc-viewer-linux.tar.gz" ]; then
    tar -xzf "$SCRIPT_DIR/ldoc-viewer-linux.tar.gz" -C "$SHARE_DIR/viewer/"
elif [ -d "$SCRIPT_DIR/../packages/ldoc-viewer" ]; then
    cp -rf "$SCRIPT_DIR/../packages/ldoc-viewer/"* "$SHARE_DIR/viewer/"
fi
chmod +x "$SHARE_DIR/viewer/ldoc-viewer.sh" 2>/dev/null || true
ln -sf "$SHARE_DIR/viewer/ldoc-viewer.sh" "$BIN_DIR/ldoc-viewer"

# 2. Install Editor
echo "--> Installing LDOC Free Editor..."
mkdir -p "$SHARE_DIR/editor"
if [ -f "$SCRIPT_DIR/ldoc-editor-linux.tar.gz" ]; then
    tar -xzf "$SCRIPT_DIR/ldoc-editor-linux.tar.gz" -C "$SHARE_DIR/editor/"
elif [ -d "$SCRIPT_DIR/../packages/ldoc-editor" ]; then
    cp -rf "$SCRIPT_DIR/../packages/ldoc-editor/"* "$SHARE_DIR/editor/"
fi
chmod +x "$SHARE_DIR/editor/ldoc-editor.sh" 2>/dev/null || true
ln -sf "$SHARE_DIR/editor/ldoc-editor.sh" "$BIN_DIR/ldoc-editor"

# 3. Create .desktop menu shortcuts
cat <<EOF > "$DESKTOP_DIR/ldoc-viewer.desktop"
[Desktop Entry]
Name=LDOC Free Viewer
Comment=View Living Documents (.ldoc, .ldocx) with 3D Holograms
Exec=$BIN_DIR/ldoc-viewer %U
Icon=$SHARE_DIR/viewer/app.ico
Terminal=false
Type=Application
Categories=Office;Viewer;Graphics;
MimeType=application/x-ldocx;application/x-ldoc;
EOF

cat <<EOF > "$DESKTOP_DIR/ldoc-editor.desktop"
[Desktop Entry]
Name=LDOC Free Editor
Comment=Create & Edit Living Documents (.ldocx)
Exec=$BIN_DIR/ldoc-editor %U
Icon=$SHARE_DIR/editor/app.ico
Terminal=false
Type=Application
Categories=Office;Development;
MimeType=application/x-ldocx;application/x-ldoc;
EOF

# 4. Register MIME type for .ldoc and .ldocx
cat <<'EOF' > "$MIME_DIR/ldocx.xml"
<?xml version="1.0" encoding="UTF-8"?>
<mime-info xmlns="http://www.freedesktop.org/standards/shared-mime-info">
  <mime-type type="application/x-ldocx">
    <comment>Living Document (.ldocx)</comment>
    <glob pattern="*.ldocx"/>
  </mime-type>
  <mime-type type="application/x-ldoc">
    <comment>Living Document (.ldoc)</comment>
    <glob pattern="*.ldoc"/>
  </mime-type>
</mime-info>
EOF

if command -v update-mime-database >/dev/null 2>&1; then
    update-mime-database "$HOME/.local/share/mime" 2>/dev/null || true
fi
if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true
fi

# 5. Check PATH
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    echo ""
    echo "Note: $BIN_DIR is not in your current PATH."
    echo "Add the following line to your ~/.bashrc or ~/.zshrc:"
    echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
fi

echo ""
echo "==========================================================="
echo "   [OK] LDOC Freemium Suite Installed Successfully on Linux!"
echo "   Launch from Applications menu or terminal:"
echo "     - ldoc-viewer [file.ldocx]"
echo "     - ldoc-editor [file.ldocx]"
echo "==========================================================="
echo ""
