# Contributing to LDOC

Thank you for your interest in contributing to the LDOC living document specification, studio suite, and developer SDK!

---

## 1. Code of Conduct & Philosophy

LDOC is an open, tamper-evident living document format standard. We value:
- **Determinism First**: What you see in the Editor must match the Viewer, the vector PDF export, and CLI headless output bit-for-bit.
- **Zero Layout Thrashing**: Text measurement must occur via canvas arithmetic, never by forcing DOM reflows (`getBoundingClientRect`, `offsetHeight`).
- **Security & Integrity**: Sandboxing must be strictly preserved; Merkle tree cryptographic integrity must never be compromised.

---

## 2. Repository Structure

The repository organizes clean, readable source modules under `src/`:

```
NEW-GEN-LIVING-DOCUMENT-FORMAT/
├── src/                        # Canonical, unminified source modules
│   ├── ldoc-text-layout.js     # Unified canvas text measurement & Pretext wrapper
│   ├── ldoc-editor-core.js     # Shared AST state, undo/redo, Free Text creator
│   ├── ldoc-parser.js          # .ldocx zip container parser, lenient repair, Merkle tree
│   ├── ldoc-export-engine.js   # OpenXML .docx, .pptx, standalone HTML, print engine
│   ├── ldoc-shared-modals.js   # Vault, History, and Subscription modals
│   ├── ldoc-toast.js           # Universal toast alert system
│   └── ldoc-config.js          # Runtime configuration & theme styles
├── packages/
│   ├── ldoc-sdk/               # Developer SDK (@ldoc/sdk)
│   ├── ldoc-editor/            # Desktop Editor package
│   ├── ldoc-viewer/            # Desktop Viewer package
│   └── ldoc-studio/            # Desktop Studio package
├── tests/                      # Master integration & regression test suites
├── build.js                    # Universal build pipeline
└── package.json                # Project dependencies and npm scripts
```

---

## 3. Development Workflow

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Python**: 3.8+ (used by packaging scripts for cross-platform archive creation)

### Installation
```bash
git clone https://github.com/coderjay2003-svg/NEW-GEN-LIVING-DOCUMENT-FORMAT.git
cd NEW-GEN-LIVING-DOCUMENT-FORMAT
npm install
```

### Building from Source
All edits to core modules should be made inside `src/`. To compile and synchronize all distribution mirrors:

```bash
npm run build
```

This automated pipeline:
1. Compiles `src/ldoc-text-layout.js` with `esbuild` into a zero-dependency standalone bundle.
2. Synchronizes core modules from `src/` to the root, `public/`, `app/viewer/`, and all package folders.
3. Assembles the dual static web routes.
4. Generates cross-platform release archives for Windows, Linux, macOS, and iOS.

---

## 4. Running Tests

We run rigorous automated test suites before merging any code:

```bash
# Run the complete test suite (SDK conformance + Master Integration test suite)
npm test

# Run individual suites:
node packages/ldoc-sdk/test.js             # SDK conformance (16/16 tests)
node tests/test_section1_unit.js           # Core LdocTextLayout unit tests
node tests/test_section2_cross_surface.js  # Zero-drift cross-surface consistency tests
node tests/test_section8_arch.js           # Architecture conformance & dependency encapsulation
node tests/test_section9_regression.js     # B1-B9 regression sweep
```

---

## 5. Architecture & Dependency Rules

### Exact Dependency Pinning
External dependencies (especially fast-moving libraries like `@chenglou/pretext`) **must be pinned to exact versions** in `package.json`:
- Use `"@chenglou/pretext": "0.0.9"`.
- Do **not** use floating ranges (`^0.0.9`, `~0.0.9`, or `*`).

### Strict Engine Encapsulation
- `@chenglou/pretext` must **only** be imported or referenced within `src/ldoc-text-layout.js`.
- All other components (Editor, Viewer, Parser, SDK, PDF Flattener) must access text measurement strictly through `LdocTextLayout` or `LDocParser.measureBlock()`.
- Direct imports of `@chenglou/pretext` anywhere else in the codebase are forbidden and will fail CI checks (`tests/test_section8_arch.js`).

---

## 6. Submitting Pull Requests

1. Fork the repository and create your feature branch: `git checkout -b feat/my-feature`.
2. Ensure all tests pass: `npm test`.
3. Verify architecture conformance: `node tests/test_section8_arch.js`.
4. Commit your changes with a clear conventional commit message: `feat(layout): add custom letter-spacing support`.
5. Push to your fork and submit a Pull Request to `main`.
