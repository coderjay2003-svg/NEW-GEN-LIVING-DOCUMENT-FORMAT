# NEW GEN - LIVING DOCUMENT FORMAT (.ldocx)
### Official Cross-Platform Freemium Suite & Developer SDK
**Developed by J-AI-ENTERPRISES**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Format Version](https://img.shields.io/badge/Format-LDOCX_v2.5.0-gold.svg)](#)
[![Platforms](https://img.shields.io/badge/Platforms-Windows_%7C_Linux_%7C_iOS-blueviolet.svg)](#)

---

## 🌟 Overview
**Living Document Format (`.ldoc`, `.ldocx`)** is a next-generation document standard engineered for interactive 3D holograms, real-time quantum simulations, reactive mathematical models, and self-contained execution with SHA-256 cryptographic integrity.

### ✈️ 100% Offline & Airplane Mode Certified
All freemium distribution packages run **completely offline with zero external network dependencies**:
- **Offline Rich Media Upload & Search**: Instant real-time filtering across 20+ elements and direct local offline file uploads for 4K Videos (`.mp4, .webm, .mov`), Atmospheric Soundtracks (`.mp3, .wav, .ogg`), 3D Models (`.glb, .gltf, .obj, .stl`), Images (`.png, .jpg, .webp`), and Live Sandbox code (`.jsx, .js, .html`). All media is embedded directly inside `.ldocx` packages with zero server requirements.
- **FX Wizard**: Living water wave background shaders, multi-mode particle physics engines (`stardust`, `warp`, `embers`, `shards`).
- **Interactive Reactive Sandboxes**: Full telemetry dyno speedometer, orbital trajectory simulator, ARR SaaS projector, 3D holographic tilt card, and arcane spell matrix.
- **Offline JSX & React Compiler**: Standalone offline Babel compilation (`vendor/babel.min.js`) and React/ReactDOM runtime evaluation.
- **Local 3D & Vector Graphics**: Offline Three.js (`vendor/three.min.js`, `GLTFLoader`, `OBJLoader`, `STLLoader`) and Chart.js.
- **Local PDF Engine**: High-fidelity PDF rendering with local web worker (`vendor/pdf.worker.min.js`).

This repository provides the official **Cross-Platform Freemium Distribution Packages** for:
- 🪟 **Windows 10 / 11** (`dist/`)
- 🐧 **Linux Desktop (Ubuntu, Debian, Fedora, Arch)** (`linux-dist/`)
- 📱 **iOS (iPhone & iPad)** (`ios-dist/`)

---

## 🪟 1. Windows Freemium Packages (`dist/`)

| Package | Type | Size | Description | Download Link |
|---|---|---|---|---|
| **LDOC Viewer** | Portable Windows App | ~3.4 MB | Free offline reader for `.ldocx` files with high-fidelity Print-to-PDF engine. | [`dist/ldoc-viewer-windows.zip`](dist/ldoc-viewer-windows.zip) |
| **LDOC Editor** | Portable Windows App | ~3.4 MB | Free visual editor & converter for Markdown (`.md`), Text (`.txt`), and CSV (`.csv`). | [`dist/ldoc-editor-windows.zip`](dist/ldoc-editor-windows.zip) |
| **LDOC Dev SDK** | Developer Library | ~60 KB | `@ldoc/sdk` client-side parsing, serialization, JSON schemas, and `ldocx` CLI. | [`dist/ldoc-dev-sdk.zip`](dist/ldoc-dev-sdk.zip) |
| **LDOC SDK Setup** | Windows Installer | ~183 KB | Standalone installer with embedded SDK, CLI batch launchers, and automatic `PATH` setup. | [`dist/setup.exe`](dist/setup.exe) |

---

## 🐧 2. Linux Freemium Packages (`linux-dist/`)

| Package | Format | Size | Description | Download Link |
|---|---|---|---|---|
| **LDOC Viewer (Linux)** | tar.gz / zip | ~3.3 MB | Standalone Linux reader with shell launcher & `.desktop` system menu shortcut. | [`linux-dist/ldoc-viewer-linux.tar.gz`](linux-dist/ldoc-viewer-linux.tar.gz) |
| **LDOC Editor (Linux)** | tar.gz / zip | ~3.3 MB | Visual living document editor & converter with native Linux launcher. | [`linux-dist/ldoc-editor-linux.tar.gz`](linux-dist/ldoc-editor-linux.tar.gz) |
| **LDOC Dev SDK (Linux)** | tar.gz / zip | ~60 KB | POSIX `ldocx` command-line executable wrapper for Linux terminal. | [`linux-dist/ldoc-dev-sdk-linux.tar.gz`](linux-dist/ldoc-dev-sdk-linux.tar.gz) |
| **Unified Linux Setup** | Bash Script | ~3 KB | Installs Viewer, Editor, and SDK CLI into `~/.local/share` & `~/.local/bin`. | [`linux-dist/setup-linux.sh`](linux-dist/setup-linux.sh) |

---

## 📱 3. iOS Freemium Packages (`ios-dist/`)

| Package | Type | Size | Description | Download Link |
|---|---|---|---|---|
| **LDOC Viewer (iOS PWA)** | Offline PWA | ~3.3 MB | 100% offline Safari Progressive Web App with Apple touch icons & touch gestures. | [`ios-dist/ldoc-viewer-ios.zip`](ios-dist/ldoc-viewer-ios.zip) |
| **LDOC Editor (iOS PWA)** | Offline PWA | ~3.3 MB | Mobile touch-optimized editor for iPad & iPhone. | [`ios-dist/ldoc-editor-ios.zip`](ios-dist/ldoc-editor-ios.zip) |
| **Native Xcode Swift App** | Xcode Workspace | ~3.3 MB | Native Swift WKWebView project with iOS Files app (`UIDocumentPicker`) import. | [`ios-dist/ldoc-ios-xcode-project.zip`](ios-dist/ldoc-ios-xcode-project.zip) |
| **iOS Install Guide** | Markdown | ~2 KB | Step-by-step guide for Safari "Add to Home Screen" and Xcode build. | [`ios-dist/IOS_INSTALL_GUIDE.md`](ios-dist/IOS_INSTALL_GUIDE.md) |

---

## 🚀 Quick Start Guides

### Windows Quick Start
1. Download [`dist/ldoc-viewer-windows.zip`](dist/ldoc-viewer-windows.zip) or [`dist/ldoc-editor-windows.zip`](dist/ldoc-editor-windows.zip).
2. Extract the archive and launch `LDOC-Viewer.exe` or `LDOC-Editor.exe`.
3. To install the Developer SDK globally, run [`dist/setup.exe`](dist/setup.exe).

### Linux Quick Start
1. Download [`linux-dist/ldoc-viewer-linux.tar.gz`](linux-dist/ldoc-viewer-linux.tar.gz).
2. Extract and launch:
   ```bash
   tar -xzf ldoc-viewer-linux.tar.gz
   cd ldoc-viewer-linux
   ./ldoc-viewer.sh
   ```
3. Or run `./install.sh` to add it to your Ubuntu/Debian/Fedora Application menu.

### iOS Quick Start (iPhone / iPad)
1. Open Safari on your iOS device.
2. Tap the **Share** button and select **"Add to Home Screen"** (`[+]`).
3. Launch **LDOC Viewer** directly from your iOS Home Screen with full offline support!

---

## 💎 Freemium vs. Studio Pro Comparison

| Feature | Freemium Suite (This Repo) | LDOC Studio Pro (Paid) |
|---|:---:|:---:|
| **Living Document Viewer** | ✅ Included | ✅ Included |
| **Visual Document Editor** | ✅ Included | ✅ Included |
| **Developer SDK & CLI** | ✅ Included | ✅ Included |
| **Markdown / TXT / CSV Converter** | ✅ Included | ✅ Included |
| **Print-to-PDF High-Fidelity Engine** | ✅ Included | ✅ Included |
| **Windows, Linux & iOS Support** | ✅ Included | ✅ Included |
| **Offline PowerPoint (.pptx) Converter** | ❌ Studio Pro | ✅ Included |
| **PDF & Word (.docx) Universal Converter** | ❌ Studio Pro | ✅ Included |
| **3D Asset Converter (.glb, .obj, .stl)** | ❌ Studio Pro | ✅ Included |
| **120Hz & 120 FPS Video Playback Engine** | ❌ Studio Pro | ✅ Included |
| **Studio Creator & Enterprise Blueprints**| ❌ Studio Pro | ✅ Included |

---

## 📜 License & Trademarks

Licensed under the [Apache License, Version 2.0](LICENSE).  
Copyright (c) 2026 **J-AI-ENTERPRISES**. All Rights Reserved.  
*Trademarks "LDOC", "LDOCX", and "Living Document Format" are proprietary to J-AI-ENTERPRISES.*
