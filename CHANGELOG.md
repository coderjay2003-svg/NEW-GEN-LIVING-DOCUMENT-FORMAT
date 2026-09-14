# Changelog

All notable changes to the LDOC living document specification, studio suite, and developer SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.1.0] - 2026-09-14

### Added
- **Unified Pretext Text Layout Engine (`LdocTextLayout`)**:
  - Integrated `@chenglou/pretext` (`0.0.9`, MIT) as the platform-wide pure canvas font segment measurement and line breaking primitive.
  - Guarantees **100% bit-for-bit identical line breaks, line counts, and bounding heights** across the Editor, Viewer, and Print/PDF export surfaces (**zero drift**).
  - Headless OffscreenCanvas proportional font measurement polyfill for Node.js server-side CLI, CI, and PDF compilation.
- **Dynamic 3D Obstacle Text Flow (`flowAroundExclusion`)**:
  - Real-time line-by-line slot carving around spatial 3D model cards, tilt widgets, and images with automatic expansion below obstacles.
- **SDK Layout Public API (`@ldoc/sdk`)**:
  - Exposed `sdk.measureBlock(block, width, options)` for pre-mount headless block dimension calculation across headings, paragraphs, lists, tables, quotes, and code blocks.
  - Exposed `sdk.flowAroundExclusion(text, font, containerWidth, exclusions, lineHeight, options)`.
  - Exposed `sdk.LdocTextLayout` for direct low-level layout stream access.
- **In-Canvas Free Text Auto-Grow**:
  - Sizing calculated via canvas arithmetic eliminating forced DOM reflows (`getBoundingClientRect`/`offsetHeight`).
- **Open-Source `src/` Tree & Unified Build Pipeline**:
  - Released unminified, readable source modules under `src/` (`ldoc-text-layout.js`, `ldoc-editor-core.js`, `ldoc-parser.js`, `ldoc-export-engine.js`, `ldoc-shared-modals.js`, `ldoc-toast.js`, `ldoc-config.js`).
  - Added automated master build pipeline (`node build.js` / `npm run build`) and cross-platform packaging.
- **Developer & Agent Guidance**:
  - Added `CONTRIBUTING.md` and `AGENTS.md` to establish architectural boundaries, strict dependency pinning, and AI agent pair programming conventions.
  - Added `THIRD_PARTY_LICENSES.md` documenting all bundled dependencies.

### Performance
- **8.0x Faster Dynamic Reflow**: Canvas segment arithmetic (1.0ms) replaces DOM forced layout loops (8.0ms) with zero main-thread layout thrashing.
- **Sub-50ms Heavy Document Mount**: 46.8ms initial layout mount for heavy documents bundling WebGL shaders, 3D cards, 4K video, and 10 text blocks.

---

## [3.0.0] - 2026-09-04

### Added
- **RFC 6962 Binary Merkle Tree Verification (Axis 4)**:
  - Cryptographic SHA-256 Merkle tree calculation computed over individual AST block leaves.
  - Sub-15ms exact tamper localization pinpointing modified blocks on document load.
- **AI-Native Provenance Engine (Axis 9)**:
  - Attribution metadata recorded per AST block (`author_type: 'human' | 'ai'`, `agent_id`, `prompt_digest`, `confidence`).
- **20-Year Archival Fallback (Axis 6)**:
  - Standalone, zero-dependency `fallback.html` bundled into every `.ldocx` archive ensuring longevity in standard browsers.
- **Capability-Based Sandboxing (Axis 4)**:
  - Sandboxed iframe execution boundaries enforcing strict CSP and origin isolation.
- **Reactive DAG Compute Engine (Axis 2)**:
  - Topological dependency graph evaluation using Kahn's algorithm for interactive data cells.
- **Dual-Container Backward Compatibility**:
  - Dual serialization format ensuring older v1.0, v2.0, and v2.5 desktop and mobile viewers open v3.0 files seamlessly.

---

## [2.5.0] - 2026-08-20

### Added
- **Real-Time Split View Preview**:
  - Side-by-side editing canvas and live interactive presentation preview with debounced compilation.
- **Living Document Enhancement Wizard (Side Landscape Drawer)**:
  - Fluid temporal dynamics with surface ripple wave simulations.
  - Particle physics constellations (*Cyber Stardust*, *Hyperspace Warp*, *Golden Embers*, *Crystal Shards*).
  - 3D holographic perspective tilt tracking.
- **Action Routing & Stripe Integrations**:
  - Stripe payment links, page navigation triggers, webhook forms, and pre-order pricing tiers.
- **Cross-Platform Installers**:
  - Portable and installer bundles for Windows (`setup.exe`), Linux (`setup-linux.sh`), macOS (`.dmg`), iOS (Xcode project), and Android (APK).
