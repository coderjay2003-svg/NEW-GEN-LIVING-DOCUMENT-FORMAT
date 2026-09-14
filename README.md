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

This repository provides the official **Cross-Platform Free Distribution Packages** — a single setup file for each operating system:
- 🪟 **Windows 10 / 11** (`dist/setup.exe`)
- 🍏 **macOS (Apple Silicon & Intel)** (`mac-dist/LDOC-Free-Suite.dmg`)
- 🐧 **Linux (Ubuntu, Debian, Fedora, Arch)** (`linux-dist/ldoc-linux-setup.tar.gz`)
- 📱 **iOS (iPhone & iPad)** (`ios-dist/ldoc-ios-setup.zip`)

---

## 📦 Official Single-Setup Downloads

| Platform | Setup Package | Size | Included Components | Download Link |
|---|---|---|---|---|
| 🪟 **Windows** | `dist/setup.exe` | ~10 MB | LDOC Viewer, LDOC Editor, Developer SDK, Desktop shortcuts & file associations (`.ldocx` / `.ldoc`) | [`dist/setup.exe`](dist/setup.exe) |
| 🍏 **macOS** | `mac-dist/LDOC-Free-Suite.dmg` | ~20 MB | LDOC Free Viewer, LDOC Free Editor, drag-to-Applications installer disk image | [`mac-dist/LDOC-Free-Suite.dmg`](mac-dist/LDOC-Free-Suite.dmg) |
| 🐧 **Linux** | `linux-dist/ldoc-linux-setup.tar.gz` | ~8.3 MB | 1-Click setup script, LDOC Viewer, LDOC Editor, POSIX Dev SDK, system menu shortcuts | [`linux-dist/ldoc-linux-setup.tar.gz`](linux-dist/ldoc-linux-setup.tar.gz) |
| 📱 **iOS** | `ios-dist/ldoc-ios-setup.zip` | ~8.3 MB | 1-Tap offline PWA setup (`setup-ios.html`), LDOC Viewer PWA, LDOC Editor PWA, Swift Xcode workspace | [`ios-dist/ldoc-ios-setup.zip`](ios-dist/ldoc-ios-setup.zip) |

---

## 🚀 Quick Start Guides

### 🪟 Windows Quick Start
1. Download [`dist/setup.exe`](dist/setup.exe).
2. Run the setup executable. It installs **LDOC Viewer**, **LDOC Editor**, and the **Developer SDK**, creates Desktop shortcuts, and associates `.ldocx` files.

### 🍏 macOS Quick Start (MacBook / iMac / Mac mini)
1. Download [`mac-dist/LDOC-Free-Suite.dmg`](mac-dist/LDOC-Free-Suite.dmg).
2. Double-click to mount the disk image.
3. Drag **LDOC Free Viewer** and **LDOC Free Editor** into the **Applications** folder shortcut.
4. Launch directly from **Launchpad** or **Spotlight** (`Cmd + Space`).

### 🐧 Linux Quick Start (Ubuntu / Debian / Fedora / Arch)
1. Download [`linux-dist/ldoc-linux-setup.tar.gz`](linux-dist/ldoc-linux-setup.tar.gz).
2. Extract the archive and run the setup script:
   ```bash
   tar -xzf ldoc-linux-setup.tar.gz
   cd ldoc-linux-setup
   ./setup-linux.sh
   ```
3. Or launch directly: `./ldoc-viewer-linux/ldoc-viewer.sh`.

### 📱 iOS Quick Start (iPhone / iPad)
1. Download and extract [`ios-dist/ldoc-ios-setup.zip`](ios-dist/ldoc-ios-setup.zip).
2. Open `setup-ios.html` in Safari on your iOS device.
3. Tap **Share** -> **"Add to Home Screen"** (`[+]`) to install **LDOC Viewer** and **LDOC Editor** as standalone offline PWAs.
4. (Optional) Build the included native Swift Xcode workspace (`ldoc-ios-xcode-project`) in Xcode.

---

## 🛠️ Developer SDK (`@ldoc/sdk`)

The Developer SDK is included in this repository under [`packages/ldoc-sdk/`](packages/ldoc-sdk/) and at root:
- [`ldoc-parser.js`](ldoc-parser.js) — Standalone core runtime for reading, validating, and writing `.ldocx` archives.
- [`ldoc-text-layout.js`](ldoc-text-layout.js) — Sub-pixel accurate text layout engine with zero text drift across editing and viewing.
- CLI Tool: `npx @ldoc/sdk --help` or run `node packages/ldoc-sdk/bin/ldocx.js` to create, validate, and inspect `.ldocx` files.

---

## 📜 License & Trademarks

Licensed under the [Apache License, Version 2.0](LICENSE).  
Copyright (c) 2026 **J AI ENTERPRISES**. All Rights Reserved.  
*Trademarks "LDOC", "LDOCX", and "Living Document Format" are proprietary to J AI ENTERPRISES.*
