# NEW GEN - LIVING DOCUMENT FORMAT (.ldocx)
### Official Cross-Platform Freemium Suite & Developer SDK
**Developed by J-AI-ENTERPRISES**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Format Version](https://img.shields.io/badge/Format-LDOCX_v3.0.0-blue.svg)](#)
[![Platforms](https://img.shields.io/badge/Platforms-Windows_%7C_Linux_%7C_macOS_%7C_iOS-blueviolet.svg)](#)

---

## 🌟 Overview
**Living Document Format (`.ldoc`, `.ldocx`)** is a next-generation document standard engineered for interactive 3D holograms, real-time quantum simulations, reactive mathematical models, and self-contained execution with SHA-256 cryptographic integrity.

### 🛡️ v3.0.0 Ground-Level Architectural Upgrades
- **True Block-Level Merkle Tree Verification**: Hierarchical RFC 6962 Merkle tree calculated over every AST block with sub-15ms tamper localization.
- **AI-Native Provenance Tracking (Axis 9)**: Block-level attribution tracking for human vs. AI-generated blocks (`agent_id`, `prompt_digest`, `confidence`).
- **20-Year Archival Longevity (Axis 6)**: Standalone, zero-dependency `fallback.html` automatically bundled in every `.ldocx` archive for guaranteed readability even if dedicated viewers disappear.
- **Capability-Based Sandboxing (Axis 4)**: Iframe execution sandbox with strict Content-Security-Policy preventing ambient file or network exfiltration.
- **Reactive DAG Compute Engine (Axis 2)**: Topological graph evaluation for reactive data cells and downstream mathematical formulas.

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
- 🍏 **macOS (MacBook, iMac, Mac mini - Apple Silicon & Intel)** (`mac-dist/`)
- 📱 **iOS (iPhone & iPad)** (`ios-dist/`)

---

## 🪟 1. Windows Freemium Packages (`dist/`)

| Package | Type | Size | Description | Download Link |
|---|---|---|---|---|
| **LDOC Freemium Setup** | 1-Click Windows Setup | ~10 MB | Universal installer: installs Viewer, Editor & SDK, creates Desktop shortcuts and registers `.ldoc`/`.ldocx` file associations. | [`dist/setup.exe`](dist/setup.exe) |
| **LDOC Viewer** | Portable Windows App | ~4.0 MB | Free portable offline reader for `.ldocx` files with high-fidelity Print-to-PDF engine. | [`dist/ldoc-viewer-windows.zip`](dist/ldoc-viewer-windows.zip) |
| **LDOC Editor** | Portable Windows App | ~4.0 MB | Free visual editor with search filter, direct media uploaders & horizontal AST element ribbon. | [`dist/ldoc-editor-windows.zip`](dist/ldoc-editor-windows.zip) |
| **LDOC Dev SDK** | Developer Library | ~238 KB | `@ldoc/sdk` client-side parsing, serialization, JSON schemas, and `ldocx` CLI. | [`dist/ldoc-dev-sdk.zip`](dist/ldoc-dev-sdk.zip) |

---

## 🐧 2. Linux Freemium Packages (`linux-dist/`)

| Package | Format | Size | Description | Download Link |
|---|---|---|---|---|
| **Unified Linux Setup** | Shell Script Installer | ~3.3 KB | 1-Click setup script installing Viewer, Editor, desktop shortcuts & `.ldocx` MIME associations. | [`linux-dist/setup-linux.sh`](linux-dist/setup-linux.sh) |
| **LDOC Viewer (Linux)** | tar.gz / zip | ~4.0 MB | Standalone Linux reader with shell launcher & `.desktop` system menu shortcut. | [`linux-dist/ldoc-viewer-linux.tar.gz`](linux-dist/ldoc-viewer-linux.tar.gz) \| [`zip`](linux-dist/ldoc-viewer-linux.zip) |
| **LDOC Editor (Linux)** | tar.gz / zip | ~4.0 MB | Visual living document editor & converter with native Linux launcher. | [`linux-dist/ldoc-editor-linux.tar.gz`](linux-dist/ldoc-editor-linux.tar.gz) \| [`zip`](linux-dist/ldoc-editor-linux.zip) |
| **LDOC Dev SDK (Linux)** | tar.gz / zip | ~236 KB | POSIX `ldocx` command-line executable wrapper for Linux terminal. | [`linux-dist/ldoc-dev-sdk-linux.tar.gz`](linux-dist/ldoc-dev-sdk-linux.tar.gz) \| [`zip`](linux-dist/ldoc-dev-sdk-linux.zip) |

---

## 🍏 3. macOS Freemium Packages (`mac-dist/`)

| Package | Format | Size | Description | Download Link |
|---|---|---|---|---|
| **LDOC Suite (.dmg)** | Apple Disk Image | ~20 MB | Official macOS drag-to-Applications installer disk image for Viewer & Editor. | [`mac-dist/LDOC-Free-Suite.dmg`](mac-dist/LDOC-Free-Suite.dmg) |
| **LDOC Viewer (macOS)** | Portable App (.zip) | ~9.9 MB | Standalone `LDOC Free Viewer.app` bundle with WebGL discrete GPU rendering. | [`mac-dist/ldoc-viewer-macos.zip`](mac-dist/ldoc-viewer-macos.zip) |
| **LDOC Editor (macOS)** | Portable App (.zip) | ~9.9 MB | Standalone `LDOC Free Editor.app` bundle with 2-tier dock & offline uploaders. | [`mac-dist/ldoc-editor-macos.zip`](mac-dist/ldoc-editor-macos.zip) |
| **LDOC Dev SDK (macOS)**| tar.gz / zip | ~300 KB | Command-line developer SDK and schema validator for macOS Terminal. | [`mac-dist/ldoc-dev-sdk-macos.tar.gz`](mac-dist/ldoc-dev-sdk-macos.tar.gz) \| [`zip`](mac-dist/ldoc-dev-sdk-macos.zip) |
| **macOS Terminal Setup**| Shell Script | ~2 KB | 1-Command terminal installation script to `/Applications`. | [`mac-dist/setup-mac.sh`](mac-dist/setup-mac.sh) |

---

## 📱 4. iOS Freemium Packages (`ios-dist/`)

| Package | Type | Size | Description | Download Link |
|---|---|---|---|---|
| **iOS 1-Tap Setup** | Offline PWA Setup | Web | Automated Home Screen installer with offline service worker pre-caching. | [`ios-dist/setup-ios.html`](ios-dist/setup-ios.html) |
| **LDOC Viewer (iOS PWA)** | Offline PWA Bundle | ~3.9 MB | 100% offline Safari Progressive Web App with Apple touch icons & touch gestures. | [`ios-dist/ldoc-viewer-ios.zip`](ios-dist/ldoc-viewer-ios.zip) |
| **LDOC Editor (iOS PWA)** | Offline PWA Bundle | ~3.9 MB | Mobile touch-optimized editor for iPad & iPhone with AST dock. | [`ios-dist/ldoc-editor-ios.zip`](ios-dist/ldoc-editor-ios.zip) |
| **Native Xcode Swift App** | Xcode Workspace | ~3.9 MB | Native Swift WKWebView project with iOS Files app (`UIDocumentPicker`) import. | [`ios-dist/ldoc-ios-xcode-project.zip`](ios-dist/ldoc-ios-xcode-project.zip) |
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
3. Or run `./setup-linux.sh` to add it to your Application menu.

### macOS Quick Start (MacBook / iMac / Mac mini)
1. Download [`mac-dist/LDOC-Free-Suite.dmg`](mac-dist/LDOC-Free-Suite.dmg).
2. Double-click to mount the disk image.
3. Drag **LDOC Free Viewer** and **LDOC Free Editor** into the **Applications** folder shortcut.
4. Launch from **Launchpad** or **Spotlight** (`Cmd + Space`).

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
| **Windows, Linux, macOS & iOS Support** | ✅ Included | ✅ Included |
| **Offline PowerPoint (.pptx) Converter** | ❌ Studio Pro | ✅ Included |
| **PDF & Word (.docx) Universal Converter** | ❌ Studio Pro | ✅ Included |
| **3D Asset Converter (.glb, .obj, .stl)** | ❌ Studio Pro | ✅ Included |
| **120Hz & 120 FPS Video Playback Engine** | ❌ Studio Pro | ✅ Included |
| **Studio Creator & Enterprise Blueprints**| ❌ Studio Pro | ✅ Included |

---

## 📜 License & Trademarks

Licensed under the [Apache License, Version 2.0](LICENSE).  
Copyright (c) 2026 **J AI ENTERPRISES**. All Rights Reserved.  
*Trademarks "LDOC", "LDOCX", and "Living Document Format" are proprietary to J AI ENTERPRISES.*
