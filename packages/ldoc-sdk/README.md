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
`
