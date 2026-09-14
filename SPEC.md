# LDOCX Container & AST Specification

**Standard Version:** 3.0.0  
**MIME Type:** `application/vnd.ldocx`  
**License:** Open Standard (Apache-2.0 for Standard, SDK & Viewer)

---

## 1. Container Architecture (Dual-Envelope Standard)

An `.ldocx` document is an open, standards-based ZIP package engineered for longevity, security, and universal compatibility across legacy (v1/v2) and modern (v3) runtimes:

```
document.ldocx (ZIP Envelope)
│
├── manifest.json              # RFC 6962 Merkle tree root & leaf hashes, version, metadata
├── document.json              # Canonical v3.0 document AST (pages, blocks, reactive DAG, provenance)
├── spec.json                  # Dual legacy compatibility AST (read by older v2.0/v2.5 desktop apps)
├── fallback.html              # Standalone zero-dependency HTML for 20-year archival longevity
├── pages/                     # Slide & page definitions (v1.0 & v2.0 desktop backwards compatibility)
│   ├── page_001.json          # Normalized blocks with dual (content + text) & content.root.children
│   ├── page_002.json
│   └── ...
├── assets/                    # Embedded rich media, 3D glTF/STL meshes, audio, video, charts
└── checksum.sha256            # Legacy SHA-256 checksum integrity verification
```

---

## 2. The 9 Core Architectural Pillars (v3.0.0)

1. **RFC 6962 Binary Merkle Tree Integrity**: Hierarchical block-level hashing offering sub-15ms exact tamper localization.
2. **AI-Native Provenance Engine (Axis 9)**: Attribution metadata per block (`author_type: 'human' | 'ai'`, `agent_id`, `prompt_digest`, `confidence`).
3. **20-Year Archival Longevity (Axis 6)**: Standalone `fallback.html` bundled into every container, viewable in any plain web browser without external scripts or dedicated viewers.
4. **Capability-Based Sandboxing (Axis 4)**: Iframe execution boundaries enforced via strict Content-Security-Policy (`connect-src 'none'`, origin isolation).
5. **Reactive DAG Compute Engine (Axis 2)**: Topological formula dependency graphs evaluated via Kahn's algorithm.
6. **Zero-Breakage Backward Compatibility**: Dual-container serialization ensuring legacy v1.0, v2.0, and v2.5 viewers open newly compiled files without blank screens or missing blocks.
7. **Strict Schema Validation**: Deterministic key-sorted canonical stringification (`canonicalStringify`).
8. **First-Class Accessibility (Axis 8)**: Semantic HTML and ARIA metadata bundled per block.
9. **Open Standard Media Delegation**: WebGL/WebGPU, glTF, and Chart.js runtime standards with static fallback mode.

---

## 3. AST Hierarchy & Data Model

- **Document Root**: `{ ldoc_version: "3.0.0", id, title, author, theme, pages: [...], reactive_graph: {...} }`
- **Page Model**: `{ id, page_number, title, fx, theme, blocks: [...], floating_texts: [...] }`
- **Block Model**:
  ```json
  {
    "id": "blk_001",
    "type": "heading",
    "content": "Living Document Standard v3.0.0",
    "text": "Living Document Standard v3.0.0",
    "provenance": {
      "author_type": "human",
      "agent_id": "author_user",
      "timestamp": "2026-09-14T00:00:00Z"
    },
    "props": { "level": 1 }
  }
  ```

---

## 4. Licensing & Governance

- **Standard & Specifications**: Apache License 2.0 (Royalty-Free & Open).
- **Core SDK & Viewer**: Free, open-source cross-platform runtime for Windows, Linux, macOS, iOS, and Android.
- **Copyright**: © 2026 J AI ENTERPRISES. All Rights Reserved.
