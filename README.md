# ? LDOCX — The Living Document Architecture & Studio

[![Release](https://img.shields.io/github/v/release/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT?label=Release&color=blue)](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform: Windows | macOS | Linux | Android](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Android-brightgreen.svg)]()
[![Git LFS](https://img.shields.io/badge/Git_LFS-Enabled-orange.svg)](https://git-lfs.github.com/)

> **The next-generation, reactive, and interactive document container format for the web and desktop.**
> Replace static PDF documents with enchanting, reactive, multi-page Living Documents equipped with 3D WebGL holograms, real-time audio/video soundtracks, fluid dynamics, autonomous particle physics, reactive JSX sandboxes, and integrated Stripe payments.

---

## ?? Direct Downloads & Standalone Installers (v3.2.0 Freemium)

| Platform | Installer Package | Size | Direct Download |
| :--- | :--- | :--- | :--- |
| **?? Windows Setup** | `Setup-LDOC-Freemium-Suite.exe` | 112.6 MB | [?? Download Windows Setup](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/Setup-LDOC-Freemium-Suite.exe) |
| **?? Windows (1-Click BAT)** | `Install-LDOC-Suite.bat` | 3.3 KB | [?? Download Batch Installer](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/Install-LDOC-Suite.bat) |
| **?? macOS Suite** | `Setup-LDOC-Freemium-Suite-macOS.command` | 259.4 MB | [?? Download macOS Suite](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/Setup-LDOC-Freemium-Suite-macOS.command) |
| **?? Linux Suite** | `Setup-LDOC-Freemium-Suite-Linux.run` | 130.4 MB | [?? Download Linux Suite](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/Setup-LDOC-Freemium-Suite-Linux.run) |
| **?? Android Editor** | `LDOC-Editor.apk` | 4.0 MB | [?? Download Editor APK](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/LDOC-Editor.apk) |
| **?? Android Viewer** | `LDOC-Viewer.apk` | 4.0 MB | [?? Download Viewer APK](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/LDOC-Viewer.apk) |

---

## ?? Key Highlights & Features

### 1. ??? Real-Time Live Presentation Preview (Split View)
- Work side-by-side: View your document live in real time as you edit blocks, change text, and add elements.
- Instant reactive synchronization with debounced AST compilation and 3D depth tilt tracking.
- Toggle between full-width and split-view with a single click.

### 2. ? Dynamic LDOC Studios Logo Loader
- Official **? ? ?** LDOC Studio triple-diamond insignia with pulsing chromatic glow effects (Gold `#f59e0b`, Nebula Purple `#c084fc`, and Cyan `#38bdf8`).
- Active across all compilation, loading, and export actions.

### 3. ? Living Document Enhancement Wizard (Side Landscape Drawer)
- **Dynamic Landscape View**: Expandable side drawer with a `? Landscape View` toggle for spacious visual exploration.
- **5 Power Enhancer Modules**:
  1. ?? **Fluid Temporal Dynamics**: Interactive surface ripple wave simulations reacting to cursor movements and taps.
  2. ? **Particle Physics Constellations**: Real-time particle simulations (*Cyber Stardust*, *Hyperspace Warp*, *Golden Embers*, *Crystal Shards*) with mouse gravitational attractor.
  3. ? **Interactive Reactive Sandboxes**: Pre-engineered widgets (*Velocity Dyno Speedometer*, *Wand Spell Matrix*, *Orbital Trajectory Sim*, *ARR Multiple Projector*).
  4. ?? **3D Holographic Perspective Tilt**: Real-time cursor depth tracking with toggle switch.
  5. ?? **Smart Action & Stripe Links**: One-click insertions for Stripe checkouts and webhook lead capture forms.

### 4. ?? Action Routing, Stripe Payment Links & Lead Forms
- **Buttons (`button`)**: Supports direct Stripe payment links (`https://buy.stripe.com/...`), page navigation (`next`, `previous`, page numbers), form submit webhooks, and custom theme designs (*Royal Gold*, *Neon Cyan*, *Purple Nebula*, *Obsidian*).
- **Forms (`form`)**: Webhook endpoint URLs for instant CRM and dispatch notifications.
- **Pre-Order (`preorder`)**: Dedicated tier badges, pricing, perks summary, and direct Stripe checkout redirects.

### 5. ? In-Editor Live Visual Previews
- Experience your interactive widgets directly within the editor block cards:
  - Live JSX sandbox with responsive controls.
  - Live particle physics simulations.
  - Interactive water ripple canvas.

### 6. ??? Resilient Error Boundaries
- Graceful error fallbacks (`.ldoc-error-fallback`) wrapped around all WebGL 3D model loaders and dynamic sandbox scripts with one-click retry buttons.

---

## ?? Repository Structure

```
NEW-GEN-LIVING-DOCUMENT-FORMAT/
+-- 01_WINDOWS_FREEMIUM/
¦   +-- Setup-LDOC-Freemium-Suite.exe   # Standalone Windows 1-Click All-in-One Installer
¦   +-- Install-LDOC-Suite.bat          # Desktop shortcut & file association script
¦   +-- LDOC-SDK-Windows/               # Windows CLI tools (ldoc, ldocx), schemas & examples
+-- 02_MACOS_FREEMIUM/
¦   +-- Setup-LDOC-Freemium-Suite-macOS.command # Self-extracting macOS bundle installer
¦   +-- Install-LDOC-Suite-Mac.command  # Quick install script
¦   +-- setup-mac.sh                    # Helper installation script
¦   +-- LDOC-SDK-Mac/                   # macOS CLI binaries & developer SDK
+-- 03_LINUX_FREEMIUM/
¦   +-- Setup-LDOC-Freemium-Suite-Linux.run     # Linux 120Hz Electron bundle self-extracting installer
¦   +-- LDOC-SDK-Linux/                 # Linux x86_64 CLI tools & developer SDK
+-- 05_ANDROID_FREEMIUM/
¦   +-- LDOC-Editor.apk                 # Full mobile editor & converter studio APK
¦   +-- LDOC-Viewer.apk                 # High-performance mobile living document viewer APK
¦   +-- sdk/                            # Cross-platform mobile SDK & sample .ldocx files
+-- .gitattributes                      # Git LFS tracking configuration for large binaries
+-- .gitignore                          # Git ignore rules
+-- LICENSE                             # MIT License
+-- README.md                           # Master documentation
```

---

## ?? Quick Start Guide

### Option A: Windows Desktop Suite (Zero Config)
1. Download [Setup-LDOC-Freemium-Suite.exe](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/Setup-LDOC-Freemium-Suite.exe) (or run `Install-LDOC-Suite.bat` as Administrator).
2. Desktop shortcuts for **LDOC Viewer** and **LDOC Editor & Converter** will be created automatically.
3. System file associations for `.ldoc` and `.ldocx` are automatically configured.

### Option B: macOS Desktop Application
1. Download [Setup-LDOC-Freemium-Suite-macOS.command](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/Setup-LDOC-Freemium-Suite-macOS.command).
2. Run from Terminal or double-click:
   ```bash
   chmod +x Setup-LDOC-Freemium-Suite-macOS.command
   ./Setup-LDOC-Freemium-Suite-macOS.command
   ```
3. Applications (`LDOC Viewer.app` and `LDOC Editor & Converter.app`) will be installed into `/Applications`.

### Option C: Linux Native Installation
1. Download [Setup-LDOC-Freemium-Suite-Linux.run](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/Setup-LDOC-Freemium-Suite-Linux.run).
2. Grant execute permissions and run:
   ```bash
   chmod +x Setup-LDOC-Freemium-Suite-Linux.run
   ./Setup-LDOC-Freemium-Suite-Linux.run
   ```
3. Launch via your desktop application launcher or terminal (`ldoc`, `ldocx`).

### Option D: Android Mobile App
1. Download [LDOC-Editor.apk](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/LDOC-Editor.apk) and [LDOC-Viewer.apk](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v3.2.0-freemium/LDOC-Viewer.apk).
2. Sideload onto your Android device and install.

### Option E: Developer SDK & CLI Tools
The command-line tools `ldoc` and `ldocx` provide headless document creation, unpacking, validation, and conversion:
```bash
# Validate an LDOCX document
ldoc validate my-document.ldocx

# Unpack document to JSON AST & assets
ldoc unpack my-document.ldocx ./output

# Pack folder to signed LDOCX container
ldoc pack ./output my-document.ldocx
```

---

## ?? Specification & Schema

The `.ldocx` format is an open, cryptographically verified document archive container:
- `manifest.json`: Document identity, pages, permissions, signatures, and theme metadata.
- `content.ast`: Strongly-typed Abstract Syntax Tree representing interactive components, headings, media, and reactive sandboxes.
- `assets/`: Embedded images, 3D meshes (`.obj`, `.stl`, `.gltf`), audio loops, and video streams.
- `signatures/`: Ed25519 cryptographic signatures validating document authenticity and tamper resistance.

---

## ?? License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

Copyright (c) 2026 Jayaraman K
