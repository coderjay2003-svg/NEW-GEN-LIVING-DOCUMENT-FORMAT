# LDOC Release v2.6.0-free (Engine v3.1.0)

> **Tag**: `v2.6.0-free`  
> **Format Specification**: `LDOCX v3.0.0` (RFC 6962 Merkle tree, AI provenance, dual-container backward compatibility)  
> **Release Date**: September 14, 2026  
> **Target Repository**: [coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT)

---

## ⚡ What's New

### 1. Unified Pretext Text Layout Engine (Zero Drift Guarantee)
- Integrated `@chenglou/pretext` (`0.0.9`, MIT) into `LdocTextLayout` as the platform-wide pure canvas font segment measurement and line breaking primitive.
- Eliminates cross-surface text measurement drift: **The interactive Editor, responsive Viewer, and vector PDF export flattener produce 100% bit-for-bit identical line breaks, line counts, and bounding heights across all scripts**.
- Built-in headless `OffscreenCanvas` proportional font metric polyfill for Node.js server-side CLI, CI, and PDF compilation with zero C++ compilation dependencies.

### 2. Dynamic 3D Obstacle Text Flow
- Typography automatically wraps line-by-line around spatial 3D WebGL model cards, depth-tilt widgets, and visual obstacles with automated horizontal slot carving and clean expansion below obstacles.

### 3. 8.0x Faster Dynamic Reflow & Zero Forced Layout Thrashing
- Pure canvas font segment arithmetic (1.0ms) replaces forced DOM measurement loops (8.0ms) with zero GPU main-thread jank.
- Initial mount for heavy documents bundling WebGL shaders, 3D cards, 4K video, and 10 text blocks completes in **46.8ms**.

### 4. SDK Layout Public API (`@ldoc/sdk`)
- `measureBlock(block, width, options)`: Pre-calculate rendered dimensions and wrapped lines for any AST block before mounting.
- `flowAroundExclusion(text, font, width, exclusions, lineHeight)`: Route text around obstacles with custom padding.
- `LdocTextLayout`: Direct access to underlying Pretext layout streams, segmenters, and locale switches.

### 5. Open-Source Source Tree (`src/`) & Automated Build Pipeline
- Released unminified, readable source code under `src/` (`ldoc-text-layout.js`, `ldoc-editor-core.js`, `ldoc-parser.js`, `ldoc-export-engine.js`, `ldoc-shared-modals.js`, `ldoc-toast.js`, `ldoc-config.js`).
- Master build pipeline: `npm run build` (`node build.js`).
- Added `CONTRIBUTING.md`, `AGENTS.md`, and `THIRD_PARTY_LICENSES.md`.

---

## 📦 Multi-Platform Downloads

| Platform | Package | Download Asset | Size | SHA-256 Digest |
| :--- | :--- | :--- | :--- | :--- |
| **Windows** | Desktop Editor | [`ldoc-editor-windows.zip`](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v2.6.0-free/ldoc-editor-windows.zip) | ~4.1 MB | Automated release asset |
| **Windows** | Presentation Viewer | [`ldoc-viewer-windows.zip`](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v2.6.0-free/ldoc-viewer-windows.zip) | ~4.1 MB | Automated release asset |
| **Linux** | Desktop Editor | [`ldoc-editor-linux.tar.gz`](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v2.6.0-free/ldoc-editor-linux.tar.gz) | ~4.1 MB | Automated release asset |
| **Linux** | Presentation Viewer | [`ldoc-viewer-linux.tar.gz`](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v2.6.0-free/ldoc-viewer-linux.tar.gz) | ~4.1 MB | Automated release asset |
| **macOS** | Desktop Editor | [`ldoc-editor-macos.zip`](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v2.6.0-free/ldoc-editor-macos.zip) | ~4.1 MB | Automated release asset |
| **macOS** | Presentation Viewer | [`ldoc-viewer-macos.zip`](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v2.6.0-free/ldoc-viewer-macos.zip) | ~4.1 MB | Automated release asset |
| **iOS** | Xcode Project / PWA | [`ldoc-editor-ios.zip`](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v2.6.0-free/ldoc-editor-ios.zip) | ~4.1 MB | Automated release asset |
| **Node.js** | Developer SDK | [`ldoc-dev-sdk.zip`](https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT/releases/download/v2.6.0-free/ldoc-dev-sdk.zip) | ~113 KB | Automated release asset |

---

## 🧪 Verification & Conformance

- **SDK Conformance**: 16/16 tests passing (`packages/ldoc-sdk/test.js`).
- **Master Test Suite**: 10/10 sections passing (`tests/run_all_pretext_master_tests.js`).
- **Architecture Check**: 0 foreign imports of `@chenglou/pretext`; strictly pinned to `"0.0.9"`.
