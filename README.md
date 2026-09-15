# LDOC Freemium Suite — New Generation Living Document Format

Welcome to the official **LDOC Freemium Suite** distribution repository for the Living Document Format (`.ldoc` / `.ldocx`).

Living Document Format (LDOC) bridges interactive web-native visual execution, 3D Canvas rendering, embedded intelligence, and rich presentation documents into a single portable container.

---

## ?? Distribution Packages & Installers

This repository contains official 1-click standalone setup installers, native executables, and command-line SDKs for all major platforms:

### ?? Windows (`01_WINDOWS_FREEMIUM/`)
- **`Setup-LDOC-Freemium-Suite.exe`** (112.6 MB): Self-contained 1-click installer bundling LDOC Viewer, LDOC Editor & Converter, and LDOCX CLI.
- **`Install-LDOC-Suite.bat`**: Automated desktop shortcut & `.ldoc` / `.ldocx` file association setup script.
- **`LDOC-SDK-Windows/`**: Command-line developer SDK (`ldoc`, `ldocx`), JSON schemas, examples, and `setup.exe`.

### ?? macOS (`02_MACOS_FREEMIUM/`)
- **`Setup-LDOC-Freemium-Suite-macOS.command`** (259.4 MB): Self-contained macOS installer bundling LDOC Viewer.app, LDOC Editor.app, and developer CLI.
- **`Install-LDOC-Suite-Mac.command`** & **`setup-mac.sh`**: Helper installation shell scripts.
- **`LDOC-SDK-Mac/`**: Developer SDK with UNIX CLI binaries and test suites.

### ?? Linux (`03_LINUX_FREEMIUM/`)
- **`Setup-LDOC-Freemium-Suite-Linux.run`** (130.4 MB): All-in-one Linux executable installer bundling the 120Hz Electron engine, desktop shortcuts, MIME associations, and CLI tools.
- **`LDOC-SDK-Linux/`**: Developer SDK for Linux x86_64 environments.

### ?? Android (`05_ANDROID_FREEMIUM/`)
- **`LDOC-Editor.apk`** (4.2 MB): Full mobile editing & conversion studio APK for Android.
- **`LDOC-Viewer.apk`** (4.2 MB): High-performance mobile viewer APK for Android devices.
- **`sdk/`**: Lightweight cross-platform SDK and sample `.ldocx` documents.

---

## ?? Quick Start & Installation

### Windows
1. Double-click `Setup-LDOC-Freemium-Suite.exe` (or run `Install-LDOC-Suite.bat` as Administrator).
2. Desktop shortcuts for **LDOC Viewer** and **LDOC Editor & Converter** will be created.
3. System file associations for `.ldoc` and `.ldocx` are automatically configured.

### macOS
1. Open Terminal or double-click `Setup-LDOC-Freemium-Suite-macOS.command`.
2. Applications will be installed into `/Applications` (or `~/Applications`).

### Linux
1. Grant execute permissions:
   ```bash
   chmod +x Setup-LDOC-Freemium-Suite-Linux.run
   ./Setup-LDOC-Freemium-Suite-Linux.run
   ```
2. Launch via application launcher or terminal (`ldoc`, `ldocx`).

### Android
1. Sideload `LDOC-Editor.apk` and `LDOC-Viewer.apk` onto your Android device.
2. Enable "Install from unknown sources" if prompted, then open and enjoy.

---

## ? Git Large File Storage (Git LFS)

Large standalone installers (`.exe`, `.command`, `.run`, `.apk`) in this repository are tracked via [Git LFS](https://git-lfs.github.com/).

To clone this repository with all binaries:
```bash
git lfs install
git clone https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT.git
```

Direct binary downloads are also available under [GitHub Releases](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases).

---

## ?? License

Licensed under the [Apache License, Version 2.0](LICENSE).
