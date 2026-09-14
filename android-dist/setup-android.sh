#!/usr/bin/env bash
# ==============================================================================
# LDOC Studio — Android ADB Installation & Sideload Script
# Copyright (c) 2026 J AI ENTERPRISES. Apache-2.0 License.
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APK_PATH="${SCRIPT_DIR}/LDOC-Studio.apk"

echo "=========================================================="
echo "  LDOC Studio Android Installer (J AI ENTERPRISES)"
echo "=========================================================="

if ! command -v adb &> /dev/null; then
    echo "Error: 'adb' (Android Debug Bridge) is not installed or not in PATH."
    echo ""
    echo "To install LDOC Studio directly on your Android phone/tablet:"
    echo "  1. Transfer LDOC-Studio.apk to your device via USB or Download"
    echo "  2. Tap LDOC-Studio.apk in Files / Downloads to install"
    echo "  3. Allow 'Install unknown apps' if prompted"
    exit 1
fi

echo "Checking for connected Android devices..."
DEVICES=$(adb devices | grep -v "List of devices" | grep "device$" | awk '{print $1}')

if [ -z "$DEVICES" ]; then
    echo "No authorized Android device detected."
    echo "   - Connect your phone/tablet with a USB cable"
    echo "   - Enable Developer Options and USB Debugging in Settings"
    echo "   - Accept the USB Debugging prompt on your screen"
    exit 1
fi

echo "Connected device(s):"
echo "$DEVICES"
echo ""

echo "Installing LDOC-Studio.apk..."
adb install -r -d "${APK_PATH}"

echo ""
echo "LDOC Studio installed successfully!"
echo "Launching LDOC Studio on your device..."
adb shell am start -n com.jaienterprises.ldocstudio/.MainActivity

echo "Done! Enjoy reading and editing Living Documents on Android."
