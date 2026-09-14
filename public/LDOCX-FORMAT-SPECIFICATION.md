# The LDOCX File Format Specification (v3.0.0)

An Open, Standardized Single-File Container for Living Documents, Reactive DAG Compute, and Verifiable Merkle Trees.

---

## 1. Overview & Architecture

An `.ldocx` file is an open, unencrypted PKWare ZIP archive that bundles structured document data, multi-slide page trees, computational DAG code, and binary/media assets into a single portable container. 

The structure follows the established open packaging conventions of `.docx`, `.epub`, `.apk`, and JSON Canvas, with full dual-container backward compatibility for legacy (v1/v2) desktop software:

```
document.ldocx (ZIP Container Standard v3.0.0)
│
├── manifest.json              # Package metadata, version, Merkle tree root & block leaf digests
├── document.json              # Canonical v3.0 document AST (pages, blocks, reactive DAG, provenance)
├── spec.json                  # Dual legacy AST manifest (read by older v2.0/v2.5 desktop apps)
├── fallback.html              # Standalone zero-dependency HTML for 20-year archival longevity
├── pages/                     # Individual slide/page definitions (v1.0/v2.0 desktop backwards compatibility)
│   ├── page_001.json          # Normalized blocks with dual (content + text) & content.root.children
│   ├── page_002.json
│   └── ...
├── assets/                    # Bundled media, 3D glTF/STL geometries, fonts, and images
└── checksum.sha256            # Cryptographic SHA-256 integrity digest & Merkle root
```

---

## 2. Container Files

### 2.1 `manifest.json`
Defines package metadata, format version, content indexing, and RFC 6962 binary Merkle tree digests.

```json
{
  "format": "ldocx",
  "ldoc_version": "3.0.0",
  "generator": "LDOC Studio Desktop v3.0.0",
  "created_at": "2026-09-14T00:00:00Z",
  "updated_at": "2026-09-14T00:00:00Z",
  "title": "Quantum Robotics Architecture",
  "author": "System Architect",
  "page_count": 4,
  "integrity": {
    "algorithm": "sha256-merkle-rfc6962",
    "merkle_root": "b78888374d2a41ef8231...",
    "block_leaves": {
      "blk_001": "e3b0c44298fc1c149afb...",
      "blk_002": "5feceb66ffc86f38d952..."
    }
  },
  "provenance_summary": {
    "total_blocks": 12,
    "human_blocks": 8,
    "ai_blocks": 4,
    "ai_percentage": 33.3
  }
}
```

### 2.2 `document.json` (Canonical v3.0 Standard)
The modern unified document schema defining pages, blocks, reactive dependency DAGs, and AI provenance.

### 2.3 `spec.json` (Legacy Fallback)
The legacy presentation manifest automatically bundled for seamless backward compatibility with older v2.0/v2.5 viewers.

### 2.4 `fallback.html` (Longevity Pillar)
Self-contained zero-dependency HTML file guaranteeing document readability for 20+ years in any standard web browser.

---

## 3. Page Schema (`pages/page_NNN.json`)

Each page file contains a root object with metadata and a linear or grouped array of `blocks`:

```json
{
  "id": "page_001",
  "num": 1,
  "title": "Executive Summary",
  "layout": "standard",
  "blocks": [
    {
      "id": "blk_001",
      "type": "heading",
      "level": 1,
      "content": "Vanguard-7 Autonomous Flight Telemetry"
    },
    {
      "id": "blk_002",
      "type": "paragraph",
      "content": "Real-time edge compute telemetry stream captured during high-altitude descent."
    }
  ],
  "floating_texts": [
    {
      "id": "txt_001",
      "text": "Critical Sensor Array",
      "x": 420,
      "y": 180,
      "color": "#38bdf8"
    }
  ]
}
```

---

## 4. Standard Block Types Reference

| Block Type | Fields | Description |
|---|---|---|
| `heading` | `level` (1-6), `content` | Semantic heading element with responsive typographic sizing. |
| `paragraph` | `content` | Rich text paragraph with markdown inline formatting support. |
| `list` | `items` (array of strings or `{text}`) | Ordered or bulleted list items. |
| `table` | `headers` (array), `rows` (2D array) | Structured data table. |
| `code` | `language`, `text`, `runnable` | Syntax-highlighted code block with optional sandboxed live execution. |
| `quote` | `content`, `author` | Callout or blockquote citation. |
| `3d_model` | `format` (`obj`, `gltf`, `stl`), `mesh_template`, `mesh_data` | Embedded Three.js WebGL spatial model with OrbitControls. |
| `chart` | `chart_type` (`bar`, `line`, `pie`), `labels`, `datasets` | Reactive Chart.js visualization. |
| `jsx_canvas` | `code`, `height` | Sandboxed React/JSX component isolated in an iframe boundary. |
| `web_video` | `url`, `autoplay`, `controls` | Embedded responsive video stream. |
| `web_image` | `url`, `caption`, `aspect` | High-resolution image asset. |

---

## 5. Security & Isolation Standard

When executing interactive computational blocks (`code`, `jsx_canvas`):
1. **Sandboxed Iframes**: All user-supplied JavaScript must execute inside `<iframe sandbox="allow-scripts allow-modals allow-forms">` with **no `allow-same-origin`**.
2. **Zero Storage Access**: Sandboxed executions are prohibited from accessing `window.localStorage`, `window.sessionStorage`, or host cookies.
3. **RAM-Only Parsing**: Document compilation and geometry generation occur strictly in local client memory.

---

## 6. Export Interoperability

LDOC Studio provides native client-side exporters implementing:
- **Microsoft Word (.docx)**: OpenXML packaging mapping headings, lists, tables, and paragraphs to standard `w:body` elements.
- **Microsoft PowerPoint (.pptx)**: PresentationML packaging mapping each page to a slide shape layout.
- **Standalone Static HTML (.html)**: Self-contained single-file document player requiring zero server dependencies.
- **Publication PDF**: High-fidelity vector print-to-PDF output.

---

## 7. License
The LDOCX specification is released openly under the **Apache License, Version 2.0**.
