#!/usr/bin/env bash
# LDOC-Editor — Native Linux Free Editor Launcher
# Copyright (c) 2026 J-AI-ENTERPRISES. All Rights Reserved.
# Licensed under Apache License, Version 2.0.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Locate Editor HTML
EDITOR_HTML=""
if [ -f "$SCRIPT_DIR/index.html" ]; then
    EDITOR_HTML="$SCRIPT_DIR/index.html"
elif [ -f "$SCRIPT_DIR/packages/ldoc-editor/index.html" ]; then
    EDITOR_HTML="$SCRIPT_DIR/packages/ldoc-editor/index.html"
elif [ -f "$SCRIPT_DIR/editor.html" ]; then
    EDITOR_HTML="$SCRIPT_DIR/editor.html"
fi

if [ -z "$EDITOR_HTML" ]; then
    echo "Error: Could not locate LDOC Editor index.html in $SCRIPT_DIR" >&2
    exit 1
fi

URL="file://$EDITOR_HTML"

if [ -n "$1" ]; then
    ABS_TARGET="$(realpath "$1" 2>/dev/null || echo "$1")"
    if [ -f "$ABS_TARGET" ]; then
        URL="$URL?open=file://$ABS_TARGET"
    fi
fi

BROWSERS=("google-chrome" "chromium" "chromium-browser" "microsoft-edge" "brave-browser" "firefox" "xdg-open")
CHOSEN_BIN=""

for b in "${BROWSERS[@]}"; do
    if command -v "$b" >/dev/null 2>&1; then
        CHOSEN_BIN="$b"
        break
    fi
done

if [ -z "$CHOSEN_BIN" ]; then
    echo "Error: No suitable web browser found." >&2
    exit 1
fi

if [[ "$CHOSEN_BIN" =~ chrome|chromium|edge|brave ]]; then
    exec "$CHOSEN_BIN" --app="$URL" --allow-file-access-from-files --window-size=1440,940 "$@" >/dev/null 2>&1 &
elif [ "$CHOSEN_BIN" = "firefox" ]; then
    exec firefox --new-window "$URL" >/dev/null 2>&1 &
else
    exec xdg-open "$URL" >/dev/null 2>&1 &
fi
