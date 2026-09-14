# @ldoc/sdk (v3.0.0)

> **The Living Document Standard (.ldocx) Engine**  
> Block-level Merkle tree verification, AI-native provenance metadata, reactive DAG compute, 20-year archival longevity, and capability-based execution sandbox.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Schema Version](https://img.shields.io/badge/Schema_Version-3.0.0-blue.svg)](#)
[![Merkle Proof](https://img.shields.io/badge/Integrity-RFC_6962_Merkle_Tree-brightgreen.svg)](#)
[![AI Provenance](https://img.shields.io/badge/Provenance-AI--Native_Axis_9-purple.svg)](#)

---

## The 6 Pillars of LDOC v3.0

1. **True Block-Level Merkle Tree**: Every page and block is cryptographically hashed with SHA-256 into a binary Merkle tree. If a single sentence or table cell is altered, verification flags the exact tampered block in under **0.5 milliseconds**.
2. **AI-Native Provenance Tracking (Axis 9)**: Full attribution tracking for human vs. AI-generated blocks (gent_id, prompt_digest, confidence).
3. **20-Year Longevity (Axis 6)**: Automatically bundles an unstyled, accessible, zero-dependency allback.html inside every .ldocx container. Any standard unzipper or browser can read the document indefinitely even if dedicated viewers disappear.
4. **Reactive Compute DAG (Axis 2)**: Topological graph evaluation for reactive data cells and downstream formulas.
5. **Capability-Based Sandboxing (Axis 4)**: Strict iframe sandbox policy (llow-scripts, strict CSP) prevents ambient file or network exfiltration.
6. **Backward-Compatible Container**: Supports legacy v2.5 documents while packaging modern atomic ASTs.

---

## Installation

`ash
npm install ldoc-sdk
`

---

## Quickstart

`javascript
const { parse, serialize, validate, verifyDocumentIntegrity } = require('ldoc-sdk');
const fs = require('fs');

// 1. Create a living document
const doc = {
  title: 'Engineering Report 2026',
  schema_version: '3.0.0',
  pages: [
    {
      id: 'page_1',
      title: 'Structural Analysis',
      blocks: [
        {
          id: 'blk_1',
          type: 'paragraph',
          content: 'Verified aerodynamic load capacity.',
          provenance: { author_type: 'ai', agent_id: 'gemini-2.5-flash', confidence: 0.99 }
        }
      ]
    }
  ]
};

// 2. Serialize into verified .ldocx container
const buffer = await serialize(doc);
fs.writeFileSync('report.ldocx', buffer);

// 3. Parse and verify authenticity
const loaded = await parse(fs.readFileSync('report.ldocx'));
console.log('Document Authentic:', loaded.integrityStatus.valid);
```

---

## Unified Text Layout & Measurement API

`@ldoc/sdk` embeds `LdocTextLayout` (powered by `@chenglou/pretext`) to enable pure canvas font segment arithmetic without requiring a DOM or browser runtime:

### 1. `measureBlock(block, width, options)`
Calculates the rendered width, height, line count, and line text of any AST block before mounting to the DOM or PDF:

```javascript
const { measureBlock } = require('@ldoc/sdk');

const block = {
  type: 'heading',
  level: 1,
  text: 'Global Strategic Overview of Living Document Architectures'
};

const metrics = measureBlock(block, 800);
console.log(metrics);
// {
//   width: 792,
//   height: 84,
//   lineCount: 2,
//   lineHeight: 42,
//   lines: [ ... ]
// }
```

### 2. `flowAroundExclusion(text, font, containerWidth, exclusionRects, lineHeight, options)`
Dynamically calculates line-by-line wrapping around spatial 3D models, cards, or floating obstacles:

```javascript
const { flowAroundExclusion } = require('@ldoc/sdk');

const text = 'Living documents seamlessly wrap typography around real-time interactive 3D WebGL models...';
const font = '16px "Plus Jakarta Sans", sans-serif';
const containerWidth = 900;
const exclusions = [
  { x: 300, y: 0, width: 300, height: 160 } // 3D model card obstacle
];

const layout = flowAroundExclusion(text, font, containerWidth, exclusions, 24);
console.log(`Rendered ${layout.lineCount} wrapped lines around 3D card.`);
```

### 3. `LdocTextLayout`
Direct access to the underlying Pretext layout engine primitives:
- `LdocTextLayout.prepare(text, font)`
- `LdocTextLayout.layout(prepared, width, lineHeight)`
- `LdocTextLayout.prepareWithSegments(text, font)`
- `LdocTextLayout.layoutWithLines(prepared, width, lineHeight)`
- `LdocTextLayout.setLocale(locale)` ('en', 'th', 'ja', 'ar')
- `LdocTextLayout.clearCache()`

