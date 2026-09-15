#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "======================================================="
echo "  LDOC Freemium Suite — macOS 1-Click Installer"
echo "  Installs: LDOC Viewer, LDOC Editor, and LDOCX SDK"
echo "======================================================="
echo ""

echo "--> Installing LDOC Viewer.app to /Applications..."
if [ -d "$DIR/LDOC-Viewer-Mac/LDOC Viewer.app" ]; then
    cp -R "$DIR/LDOC-Viewer-Mac/LDOC Viewer.app" /Applications/
fi

echo "--> Installing LDOC Editor & Converter.app to /Applications..."
if [ -d "$DIR/LDOC-Editor-Converter-Mac/LDOC Editor & Converter.app" ]; then
    cp -R "$DIR/LDOC-Editor-Converter-Mac/LDOC Editor & Converter.app" /Applications/
fi

echo "--> Installing LDOCX CLI tools to /usr/local/bin..."
TARGET_BIN="/usr/local/bin"
if [ ! -w "$TARGET_BIN" ]; then
    TARGET_BIN="$HOME/.local/bin"
    mkdir -p "$TARGET_BIN"
fi
cp -f "$DIR/LDOC-SDK-Mac/bin/ldoc" "$TARGET_BIN/ldoc" 2>/dev/null || true
cp -f "$DIR/LDOC-SDK-Mac/bin/ldocx" "$TARGET_BIN/ldocx" 2>/dev/null || true
chmod +x "$TARGET_BIN/ldoc" "$TARGET_BIN/ldocx" 2>/dev/null || true

echo ""
echo "======================================================="
echo "  [OK] LDOC Freemium Suite Installed Successfully!"
echo "  - Applications: /Applications/LDOC Viewer.app"
echo "  - Applications: /Applications/LDOC Editor & Converter.app"
echo "  - CLI Tools: $TARGET_BIN/ldoc and ldocx"
echo "======================================================="
echo ""
read -p "Press enter to exit..."
