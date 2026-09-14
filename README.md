# ◈ LDOCX — The Living Document Architecture & Studio

[![Format Version](https://img.shields.io/badge/Format-LDOCX_v3.0.0-blue.svg)](SPEC.md)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Platform: Web | Win | Linux | macOS | iOS | Android](https://img.shields.io/badge/Platform-Web%20%7C%20Win%20%7C%20Linux%20%7C%20macOS%20%7C%20iOS%20%7C%20Android-brightgreen.svg)]()
[![Conformance: 12/12 Passing](https://img.shields.io/badge/Conformance_Tests-12%2F12_100%25-success.svg)](packages/ldoc-sdk/test.js)

> **The next-generation, reactive, and cryptographically verifiable document container format.**
> Replace static PDF documents with reactive, multi-page Living Documents equipped with RFC 6962 Merkle tree verification, AI-native provenance tracking, 20-year archival fallback, 3D WebGL models, fluid dynamics, and reactive DAG compute.

**Built by [J AI ENTERPRISES](https://github.com/coderjay2003-svg)**  
Canonical Repository: [coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT)

---

## ⚡ What's New in v3.1.0 (v2.6.0-free)

- **Deterministic Canvas-Based Text Layout**: Integrated `@chenglou/pretext` (MIT-licensed, Cheng Lou), ensuring 100% bit-for-bit identical line breaks, line counts, and bounding heights between the editor, viewer, and PDF export flattener (**zero drift**).
- **Dynamic 3D Obstacle Text Flow**: Typography automatically wraps line-by-line around spatial 3D WebGL cards, tilt widgets, and images with automatic expansion below obstacles.
- **8.0x Faster Dynamic Reflow**: Pure canvas font segment arithmetic (1.0ms) replaces forced DOM layout loops (8.0ms) with zero main-thread layout thrashing.
- **SDK Layout Public API (`@ldoc/sdk`)**: Added `measureBlock()` for headless pre-mount dimension calculation and `flowAroundExclusion()` for obstacle avoidance.
- **Open-Source `src/` Tree**: Full unminified, readable source code released under `src/` with an automated master build pipeline (`npm run build`).

---

## 🛡️ v3.0.0 Ground-Level Architectural Upgrades

- **True RFC 6962 Binary Merkle Tree Verification**: Deterministic leaf hashing computed per AST block with sub-15ms exact tamper localization.
- **AI-Native Provenance Engine (Axis 9)**: Attribution metadata per block (`author_type: 'human' | 'ai'`, `agent_id`, `prompt_digest`, `confidence`).
- **20-Year Archival Longevity (Axis 6)**: Standalone, zero-dependency `fallback.html` automatically bundled into every `.ldocx` archive, guaranteeing full readability in any standard browser even if proprietary runtimes disappear.
- **Capability-Based Sandboxing (Axis 4)**: Iframe execution boundaries enforced via strict Content-Security-Policy (`connect-src 'none'`, origin isolation).
- **Reactive DAG Compute Engine (Axis 2)**: Topological graph evaluation via Kahn's algorithm for reactive data cells and mathematical formulas.
- **Zero-Breakage Backward & Forward Compatibility Guarantee**: Dual-container serialization ensuring older v1.0, v2.0, and v2.5 viewers open newly compiled files without blank screens or missing blocks.

---

## 🌐 Live Online Demo

Experience the full **LDOC Living Document Studio** online directly in your browser:

- **🚀 Live Studio & Viewer:** [https://jayaraman2212066.github.io/LDOCX-FORMAT-PROJECT-MARK1/](https://jayaraman2212066.github.io/LDOCX-FORMAT-PROJECT-MARK1/)
- **✨ Live Standalone Creator:** [https://jayaraman2212066.github.io/LDOCX-FORMAT-PROJECT-MARK1/creator.html](https://jayaraman2212066.github.io/LDOCX-FORMAT-PROJECT-MARK1/creator.html)

Deploy your own instance with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjayaraman2212066%2FLDOCX-FORMAT-PROJECT-MARK1)

---

## 🌟 Key Highlights & Features

### 1. 👁️ Real-Time Live Presentation Preview (Split View)
- Work side-by-side: View your document live in real time as you edit blocks, change text, and add elements.
- Instant reactive synchronization with debounced AST compilation and 3D depth tilt tracking.
- Toggle between full-width and split-view with a single click.

### 2. ◈ Dynamic LDOC Studios Logo Loader
- Official **◈ ◈ ◈** LDOC Studio triple-diamond insignia with pulsing chromatic glow effects (Gold `#f59e0b`, Nebula Purple `#c084fc`, and Cyan `#38bdf8`).
- Active across all compilation, loading, and export actions.

### 3. ⚜ Living Document Enhancement Wizard (Side Landscape Drawer)
- **Dynamic Landscape View**: Expandable side drawer with a `⤢ Landscape View` toggle for spacious visual exploration.
- **5 Power Enhancer Modules**:
  1. 🌊 **Fluid Temporal Dynamics**: Interactive surface ripple wave simulations reacting to cursor movements and taps.
  2. ✨ **Particle Physics Constellations**: Real-time particle simulations (*Cyber Stardust*, *Hyperspace Warp*, *Golden Embers*, *Crystal Shards*) with mouse gravitational attractor.
  3. ⚡ **Interactive Reactive Sandboxes**: Pre-engineered widgets (*Velocity Dyno Speedometer*, *Wand Spell Matrix*, *Orbital Trajectory Sim*, *ARR Multiple Projector*).
  4. 📐 **3D Holographic Perspective Tilt**: Real-time cursor depth tracking with toggle switch.
  5. 💳 **Smart Action & Stripe Links**: One-click insertions for Stripe checkouts and webhook lead capture forms.

### 4. 💳 Action Routing, Stripe Payment Links & Lead Forms
- **Buttons (`button`)**: Supports direct Stripe payment links (`https://buy.stripe.com/...`), page navigation (`next`, `previous`, page numbers), form submit webhooks, and custom theme designs (*Royal Gold*, *Neon Cyan*, *Purple Nebula*, *Obsidian*).
- **Forms (`form`)**: Webhook endpoint URLs for instant CRM and dispatch notifications.
- **Pre-Order (`preorder`)**: Dedicated tier badges, pricing, perks summary, and direct Stripe checkout redirects.

### 5. ⚡ In-Editor Live Visual Previews
- Experience your interactive widgets directly within the editor block cards:
  - Sandboxed JSX execution with responsive controls.
  - Live particle physics simulations.
  - Interactive water ripple canvas.

### 6. 🛡️ Resilient Error Boundaries
- Graceful error fallbacks (`.ldoc-error-fallback`) wrapped around all WebGL 3D model loaders and dynamic sandbox scripts with one-click retry buttons.

### 7. 🔐 ECDSA P-256 Document Signing
- Documents are cryptographically signed using ECDSA P-256 via the Web Crypto API.
- Signature verification on document load with tamper detection.

### 8. 🌍 Multi-Platform Distribution
- **Windows**: NSIS installer (`setup.exe`) + portable ZIP
- **Linux**: Shell installer + `.tar.gz` / `.zip` bundles
- **macOS**: `.app` bundles + `.dmg` + shell installer
- **iOS**: PWA + Xcode workspace
- **Android**: PWA + sideloadable APK

---

## 📁 Repository Structure

```
LDOCX-FORMAT-PROJECT-MARK1/
├── packages/
│   ├── ldoc-viewer/            # Document viewer (HTML/JS/CSS, ~19K lines)
│   ├── ldoc-editor/            # Document editor (HTML/JS/CSS, ~19K lines)
│   ├── ldoc-studio/            # Full desktop studio — Electron app (~20K lines)
│   └── ldoc-sdk/               # Developer SDK (Node.js)
├── app/
│   └── viewer/                 # Marketing website & landing pages (GitHub Pages)
├── dist/                       # Windows distribution packages
├── linux-dist/                 # Linux distribution packages
├── ios-dist/                   # iOS distribution packages
├── android-dist/               # Android distribution packages
├── specs/                      # Formal LDOCX format specifications & JSON schemas
├── samples/                    # Sample living documents (.ldocx)
├── examples/                   # Document examples and templates
├── backend/                    # Node.js API backend (auth, export, AI, payments)
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions automated Pages deployment
├── index.html                  # Main web studio entry point
├── creator.html                # Standalone document creator
└── vercel.json                 # Vercel deployment configuration
```

---

## 🚀 Quick Start Guide

### Option A: Online Web Usage (No Installation)
Visit [https://jayaraman2212066.github.io/LDOCX-FORMAT-PROJECT-MARK1/](https://jayaraman2212066.github.io/LDOCX-FORMAT-PROJECT-MARK1/) to start creating and viewing living documents immediately.

### Option B: Desktop Application
1. Download the installer for your platform from the [distribution repo](https://github.com/jayaraman2212066/LDOCX-FORMAT-PROJECT-MARK1):
   - **Windows**: `dist/setup.exe`
   - **Linux**: `linux-dist/setup-linux.sh`
   - **macOS**: `mac-dist/setup-mac.sh`
   - **Android**: `android-dist/LDOC-Studio.apk`

2. Or clone and open directly in your browser:
   ```bash
   git clone https://github.com/jayaraman2212066/LDOCX-FORMAT-PROJECT-MARK1.git
   cd LDOCX-FORMAT-PROJECT-MARK1
   # Open index.html in your browser — no server required
   ```

### Option C: Developer SDK (`@ldoc/sdk`)
Install and use the headless SDK with deterministic layout measurement:
```bash
npm install @ldoc/sdk
```
```javascript
const { parse, serialize, measureBlock } = require('@ldoc/sdk');

// Pre-measure any AST block before rendering
const metrics = measureBlock({ type: 'heading', level: 1, text: 'Living Document' }, 800);
console.log(`Height: ${metrics.height}px, Lines: ${metrics.lineCount}`);
```

### Option D: Building from Source
```bash
git clone https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT.git
cd NEW-GEN-LIVING-DOCUMENT-FORMAT
npm install
npm run build     # Compiles src/, synchronizes packages, and builds platform archives
npm test          # Runs SDK and zero-drift cross-surface test suites
```

---

## 📜 Specification & Schema (v3.0.0 Dual-Container Standard)

The `.ldocx` format is an open document archive container based on the PKWare ZIP standard:
- `manifest.json`: Document identity, pages, RFC 6962 binary Merkle tree root and leaf digests, and AI provenance stats.
- `document.json`: Canonical v3.0 standard AST containing all pages, blocks, reactive formula DAG, and provenance tracking.
- `spec.json`: Dual legacy compatibility presentation manifest read by older v2.0/v2.5 desktop apps.
- `fallback.html`: Zero-dependency standalone HTML guaranteeing complete document readability for 20+ years in any standard browser.
- `pages/page_*.json`: Strongly-typed AST pages with dual `blocks` and `content.root.children` for v1.0 compatibility.
- `assets/`: Embedded images, 3D spatial models (`.glb`, `.gltf`, `.obj`, `.stl`), audio, and video.
- `checksum.sha256`: Legacy SHA-256 checksum digest and Merkle root verification.

---

## 📄 License

Distributed under the **Apache License 2.0**. See `LICENSE` for more information.

© 2026 J AI ENTERPRISES. All rights reserved.
