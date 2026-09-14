# Instructions for AI Coding Agents Working on LDOC

This document establishes operational directives, architectural invariants, and code conventions for AI coding assistants (Google Antigravity, Codex, etc.) working within the LDOC living document codebase.

---

## 1. Core System Invariants (Never Violate)

1. **Zero Text Drift Across Surfaces**:
   The primary invariant of LDOC is that the **Editor**, the **Viewer**, and the **Print / PDF export flattener** must produce **100% bit-for-bit identical line breaks, line counts, and bounding heights**. Never introduce surface-specific heuristics or browser-only font measurements that deviate from `LdocTextLayout`.

2. **Strict Encapsulation of `@chenglou/pretext`**:
   `@chenglou/pretext` is an internal engine implementation detail.
   - **Allowed Import Site**: `src/ldoc-text-layout.js` (and the compiled `ldoc-text-layout.js`).
   - **Forbidden Import Sites**: Anywhere else in the repository.
   - All modules (`ldoc-editor-core.js`, `ldoc-parser.js`, `pdf_flattener.js`, `@ldoc/sdk`) must consume layout services exclusively through `LdocTextLayout`, `LDocParser.measureBlock()`, or `sdk.measureBlock()`.
   - Never suggest adding direct pretext imports to other files.

3. **Exact Dependency Pinning**:
   - In any manifest (`package.json`, `packages/ldoc-sdk/package.json`), `@chenglou/pretext` must remain strictly pinned to an exact version (currently `"0.0.9"`).
   - Never change it to a floating range (`^`, `~`, or `*`).

4. **Zero Forced DOM Layout Queries in Text Paths**:
   - **Banned in text measurement**: `element.getBoundingClientRect()`, `element.offsetHeight`, `element.clientHeight`, `getComputedStyle(element).height`.
   - **Mandated alternative**: `LdocTextLayout.measureBlock(block, width)` or `LdocTextLayout.layoutWithLines()`.
   - Modifying elements must compute heights arithmetically to avoid forced synchronous layout thrashing.

---

## 2. Platform & Engine Specifics

### Headless Node.js / CLI Compatibility
- In Node.js environments (CLI tools, server-side PDF generation, CI), browser DOM and native HTML Canvas may not be present.
- `LdocTextLayout` embeds an internal proportional font metrics fallback polyfill via `globalThis.OffscreenCanvas`.
- Never introduce dependencies on native C++ compilation modules (such as `node-canvas` or `canvas`) that would break zero-dependency cross-platform compilation.

### Safari / WebKit Cursor Forward Progress Guard
- WebKit renders soft hyphens (`\u00AD`) with explicit hyphen glyph width at syllable wrap boundaries, which can cause zero-width infinite loops if available width is extremely narrow.
- In any line breaking loop, agents must preserve the cursor advance guard:
  ```js
  if (line.end.segmentIndex === cursor.segmentIndex && line.end.graphemeIndex === cursor.graphemeIndex) {
    cursor = { segmentIndex: cursor.segmentIndex + 1, graphemeIndex: 0 };
  }
  ```

### Dual-Container Backward Compatibility
- When generating `.ldocx` archives in `ldoc-parser.js` or `@ldoc/sdk`:
  - `manifest.json` + `document.json`: Modern canonical v3.0 standard.
  - `spec.json`: Maintained for legacy v2.0/v2.5 viewers.
  - `fallback.html`: Maintained for 20-year archival longevity.
  - Never remove legacy compatibility structures without explicit user instruction.

---

## 3. Build & Verification Protocol

Whenever you modify any core modules:
1. Make the changes inside `src/` (e.g. `src/ldoc-editor-core.js`, `src/ldoc-parser.js`, `src/ldoc-text-layout.js`).
2. Run the build pipeline to synchronize all mirrors and rebuild packages:
   ```bash
   npm run build
   ```
3. Run the verification test suites:
   ```bash
   node tests/test_section8_arch.js           # Ensure 0 architecture violations
   node tests/test_section2_cross_surface.js  # Ensure 0 cross-surface drift
   npm test                                   # Full conformance suite
   ```
4. Confirm exit code 0 before concluding your task.
