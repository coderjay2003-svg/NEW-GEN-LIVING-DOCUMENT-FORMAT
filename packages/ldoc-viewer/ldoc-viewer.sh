#!/usr/bin/env bash
# LDOC-Viewer — Native Linux Free Reader Launcher
# Copyright (c) 2026 J-AI-ENTERPRISES. All Rights Reserved.
# Licensed under Apache License, Version 2.0.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Locate Viewer HTML
VIEWER_HTML=""
if [ -f "$SCRIPT_DIR/index.html" ]; then
    VIEWER_HTML="$SCRIPT_DIR/index.html"
elif [ -f "$SCRIPT_DIR/packages/ldoc-viewer/index.html" ]; then
    VIEWER_HTML="$SCRIPT_DIR/packages/ldoc-viewer/index.html"
elif [ -f "$SCRIPT_DIR/viewer.html" ]; then
    VIEWER_HTML="$SCRIPT_DIR/viewer.html"
fi

if [ -z "$VIEWER_HTML" ]; then
    echo "Error: Could not locate LDOC Viewer index.html in $SCRIPT_DIR" >&2
    exit 1
fi

URL="file://$VIEWER_HTML"

# Check if an .ldocx file was passed as argument
if [ -n "$1" ]; then
    ABS_TARGET="$(realpath "$1" 2>/dev/null || echo "$1")"
    if [ -f "$ABS_TARGET" ]; then
        URL="$URL?open=file://$ABS_TARGET"
    fi
fi

# Detect available browsers (prefer chromium-based for standalone app mode)
BROWSERS=("google-chrome" "chromium" "chromium-browser" "microsoft-edge" "brave-browser" "firefox" "xdg-open")
CHOSEN_BIN=""

for b in "${BROWSERS[@]}"; do
    if command -v "$b" >/dev/null 2>&1; then
        CHOSEN_BIN="$b"
        break
    fi
done

if [ -z "$CHOSEN_BIN" ]; then
    echo "Error: No suitable web browser found. Please install Chromium, Chrome, or Firefox." >&2
    exit 1
fi

if [[ "$CHOSEN_BIN" =~ chrome|chromium|edge|brave ]]; then
    exec "$CHOSEN_BIN" --app="$URL" --allow-file-access-from-files --window-size=1380,900 "$@" >/dev/null 2>&1 &
elif [ "$CHOSEN_BIN" = "firefox" ]; then
    exec firefox --new-window "$URL" >/dev/null 2>&1 &
else
    exec xdg-open "$URL" >/dev/null 2>&1 &
fi
