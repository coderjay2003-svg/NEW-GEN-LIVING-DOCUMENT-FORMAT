#!/usr/bin/env bash
# ===========================================================
#   LDOC Freemium Suite — Unified Linux Setup Wizard
#   J-AI-ENTERPRISES (c) 2026 | Apache License 2.0
# ===========================================================

set -e

echo ""
echo "==========================================================="
echo "   LDOC Freemium Suite — Linux Installer Wizard"
echo "   Living Document (.ldocx) Free Viewer, Editor & SDK"
echo "   J-AI-ENTERPRISES (c) 2026"
echo "==========================================================="
echo ""

INSTALL_PREFIX="${1:-$HOME/.local}"
BIN_DIR="$INSTALL_PREFIX/bin"
SHARE_DIR="$INSTALL_PREFIX/share"
DESKTOP_DIR="$HOME/.local/share/applications"
MIME_DIR="$HOME/.local/share/mime/packages"

mkdir -p "$BIN_DIR" "$SHARE_DIR" "$DESKTOP_DIR" "$MIME_DIR"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. Install Viewer
if [ -d "$SCRIPT_DIR/packages/ldoc-viewer" ]; then
    echo "--> Installing LDOC Free Viewer..."
    mkdir -p "$SHARE_DIR/ldoc-viewer"
    cp -rf "$SCRIPT_DIR/packages/ldoc-viewer/"* "$SHARE_DIR/ldoc-viewer/"
    chmod +x "$SHARE_DIR/ldoc-viewer/ldoc-viewer.sh" 2>/dev/null || true
    ln -sf "$SHARE_DIR/ldoc-viewer/ldoc-viewer.sh" "$BIN_DIR/ldoc-viewer"
fi

# 2. Install Editor
if [ -d "$SCRIPT_DIR/packages/ldoc-editor" ]; then
    echo "--> Installing LDOC Free Editor..."
    mkdir -p "$SHARE_DIR/ldoc-editor"
    cp -rf "$SCRIPT_DIR/packages/ldoc-editor/"* "$SHARE_DIR/ldoc-editor/"
    chmod +x "$SHARE_DIR/ldoc-editor/ldoc-editor.sh" 2>/dev/null || true
    ln -sf "$SHARE_DIR/ldoc-editor/ldoc-editor.sh" "$BIN_DIR/ldoc-editor"
fi

# 3. Install SDK CLI
if [ -d "$SCRIPT_DIR/packages/ldoc-sdk" ]; then
    echo "--> Installing LDOC Developer SDK & CLI..."
    mkdir -p "$SHARE_DIR/ldoc-sdk"
    cp -rf "$SCRIPT_DIR/packages/ldoc-sdk/"* "$SHARE_DIR/ldoc-sdk/"
    chmod +x "$SHARE_DIR/ldoc-sdk/bin/ldocx" 2>/dev/null || true
    ln -sf "$SHARE_DIR/ldoc-sdk/bin/ldocx" "$BIN_DIR/ldocx"
    ln -sf "$SHARE_DIR/ldoc-sdk/bin/ldocx" "$BIN_DIR/ldoc"
fi

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

# 5. Check PATH
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    echo ""
    echo "Note: $BIN_DIR is not in your current PATH."
    echo "Add the following line to your ~/.bashrc or ~/.zshrc:"
    echo "  export PATH="\$HOME/.local/bin:\$PATH""
fi

echo ""
echo "==========================================================="
echo "   ✓ LDOC Freemium Suite Installed Successfully!"
echo "   Commands available in terminal:"
echo "     - ldoc-viewer [file.ldocx]"
echo "     - ldoc-editor [file.ldocx]"
echo "     - ldocx --help"
echo "==========================================================="
echo ""
