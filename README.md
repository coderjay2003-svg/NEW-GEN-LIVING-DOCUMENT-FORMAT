# LDOC Freemium Suite — New Generation Living Document Format

Welcome to the official **LDOC Freemium Suite** distribution repository for the Living Document Format (`.ldoc` / `.ldocx`).

Living Document Format (LDOC) bridges interactive web-native visual execution, 3D Canvas rendering, embedded intelligence, and rich presentation documents into a single portable container.

---

## ? Direct Download Links (v3.2.0 Freemium)

| Platform | Installer / Package | Size | Direct Download |
| :--- | :--- | :--- | :--- |
| **?? Windows** | `Setup-LDOC-Freemium-Suite.exe` | 112.6 MB | [?? Download Windows Setup](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/Setup-LDOC-Freemium-Suite.exe) |
| **?? Windows (Batch)** | `Install-LDOC-Suite.bat` | 3.3 KB | [?? Download Batch Installer](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/Install-LDOC-Suite.bat) |
| **?? macOS** | `Setup-LDOC-Freemium-Suite-macOS.command` | 259.4 MB | [?? Download macOS Suite](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/Setup-LDOC-Freemium-Suite-macOS.command) |
| **?? Linux** | `Setup-LDOC-Freemium-Suite-Linux.run` | 130.4 MB | [?? Download Linux Suite](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/Setup-LDOC-Freemium-Suite-Linux.run) |
| **?? Android Editor** | `LDOC-Editor.apk` | 4.0 MB | [?? Download Editor APK](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/LDOC-Editor.apk) |
| **?? Android Viewer** | `LDOC-Viewer.apk` | 4.0 MB | [?? Download Viewer APK](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/LDOC-Viewer.apk) |

---

## ?? Distribution Packages in Repository

This repository contains standalone setup installers, native executables, and command-line SDKs for all major platforms:

### ?? Windows (`01_WINDOWS_FREEMIUM/`)
- **`Setup-LDOC-Freemium-Suite.exe`**: Self-contained 1-click installer bundling LDOC Viewer, LDOC Editor & Converter, and LDOCX CLI.
- **`Install-LDOC-Suite.bat`**: Automated desktop shortcut & `.ldoc` / `.ldocx` file association setup script.
- **`LDOC-SDK-Windows/`**: Command-line developer SDK (`ldoc`, `ldocx`), JSON schemas, examples, and `setup.exe`.

### ?? macOS (`02_MACOS_FREEMIUM/`)
- **`Setup-LDOC-Freemium-Suite-macOS.command`**: Self-contained macOS installer bundling LDOC Viewer.app, LDOC Editor.app, and developer CLI.
- **`Install-LDOC-Suite-Mac.command`** & **`setup-mac.sh`**: Helper installation shell scripts.
- **`LDOC-SDK-Mac/`**: Developer SDK with UNIX CLI binaries and test suites.

### ?? Linux (`03_LINUX_FREEMIUM/`)
- **`Setup-LDOC-Freemium-Suite-Linux.run`**: All-in-one Linux executable installer bundling the 120Hz Electron engine, desktop shortcuts, MIME associations, and CLI tools.
- **`LDOC-SDK-Linux/`**: Developer SDK for Linux x86_64 environments.

### ?? Android (`05_ANDROID_FREEMIUM/`)
- **`LDOC-Editor.apk`**: Full mobile editing & conversion studio APK for Android.
- **`LDOC-Viewer.apk`**: High-performance mobile viewer APK for Android devices.
- **`sdk/`**: Lightweight cross-platform SDK and sample `.ldocx` documents.

---

## ?? Quick Start & Installation Instructions

### Windows
1. Download [Setup-LDOC-Freemium-Suite.exe](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/Setup-LDOC-Freemium-Suite.exe) and run the installer.
2. Desktop shortcuts for **LDOC Viewer** and **LDOC Editor & Converter** will be created.
3. System file associations for `.ldoc` and `.ldocx` are automatically configured.

### macOS
1. Download [Setup-LDOC-Freemium-Suite-macOS.command](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/Setup-LDOC-Freemium-Suite-macOS.command).
2. Double-click or run from Terminal:
   ```bash
   chmod +x Setup-LDOC-Freemium-Suite-macOS.command
   ./Setup-LDOC-Freemium-Suite-macOS.command
   ```
3. Applications will be installed into `/Applications` (or `~/Applications`).

### Linux
1. Download [Setup-LDOC-Freemium-Suite-Linux.run](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/Setup-LDOC-Freemium-Suite-Linux.run).
2. Grant execute permissions and run:
   ```bash
   chmod +x Setup-LDOC-Freemium-Suite-Linux.run
   ./Setup-LDOC-Freemium-Suite-Linux.run
   ```
3. Launch via application launcher or terminal (`ldoc`, `ldocx`).

### Android
1. Download [LDOC-Editor.apk](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/LDOC-Editor.apk) and [LDOC-Viewer.apk](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/LDOC-Viewer.apk).
2. Sideload onto your device and install.

---

## ? Git Large File Storage (Git LFS)

Large standalone installers (`.exe`, `.command`, `.run`) in this repository are tracked via [Git LFS](https://git-lfs.github.com/).

To clone this repository with all binaries:
```bash
git lfs install
git clone https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT.git
```

---

## ?? License

Licensed under the [Apache License, Version 2.0](LICENSE).
