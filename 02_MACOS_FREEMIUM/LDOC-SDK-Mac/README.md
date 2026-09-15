# @ldoc/sdk

> **The Living Document (.ldocx) SDK**  
> Programmatic parsing, serialization, AST validation, and SHA-256 checksum generation for Living Documents with native 3D, live execution, and interactive widgets.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Schema Version](https://img.shields.io/badge/Schema_Version-2.5.0-gold.svg)](#)

---

## Features
- **Zero Server Overhead**: 100% client-side memory compilation (<25ms).
- **Native 3D Hologram Schema**: Support for procedural FCC atomic lattices, sports car chassis, Tourbillon mechanisms, satellite buses, and external GLTF/OBJ/STL/3MF assets.
- **Interactive Widgets**: Types and schemas for real-time quantum wavefunction simulators, escapement frequency tuners, live sensor feeds, and reactive dynos.
- **SHA-256 Tamper Detection**: Embedded cryptographic checksums for document integrity.

---

## Installation

```bash
npm install @ldoc/sdk
```

---

## Quick Start

```javascript
const { parse, serialize, validate } = require('@ldoc/sdk');

// 1. Create a Living Document AST
const document = {
  title: "Quantum Physics & Orbital Dynamics",
  pages: [
    {
      id: "page_1",
      title: "FCC Atomic Unit Cell",
      blocks: [
        { id: "b1", type: "heading", level: 1, text: "Face-Centered Cubic Lattice" },
        { id: "b2", type: "3d_model", mesh_template: "atomic_lattice" },
        { id: "b3", type: "quantum_sim", title: "Schrödinger Superposition Simulator" }
      ]
    }
  ]
};

// 2. Validate AST against Schema
const val = validate(document);
if (!val.valid) {
  console.error("Validation errors:", val.errors);
}

// 3. Serialize into portable .ldocx buffer
const buffer = await serialize(document);
// Write to file or transmit...

// 4. Parse any .ldocx archive
const parsed = await parse(buffer);
console.log("Document loaded:", parsed.title);
```

---

## License

Licensed under the [Apache License, Version 2.0](LICENSE).  
Copyright (c) 2026 **J-AI-ENTERPRISES**. All Rights Reserved.  
*Trademarks "LDOC", "LDOCX", and "Living Document Format" are proprietary to J-AI-ENTERPRISES.*
