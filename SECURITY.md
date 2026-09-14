# Security & Intellectual Property Policy

## 1. Copyright & Licensing
- **Project**: LDOC / LDOCX Living Document Format Standard & Studio Suite
- **Owner**: J AI ENTERPRISES
- **Copyright**: © 2026 J AI ENTERPRISES. All Rights Reserved.
- **License**: [Apache License, Version 2.0](LICENSE)

---

## 2. Anti-Theft & Trademark Protection
The name **LDOC**, **LDOCX**, **Living Document**, **Living Document Format**, **Living Studio**, and all associated icons, branding, and logos are proprietary trademarks of J AI ENTERPRISES.

While the core file format specification and parser are licensed under Apache-2.0 to enable open inter-compatibility and community reading/writing, **Section 6 of the Apache 2.0 License explicitly excludes trademark rights**. 

Any redistribution, derivative application, or commercial product:
1. Must retain all original copyright notices (`© 2026 J AI ENTERPRISES`).
2. Must retain the `NOTICE` file in all distributions.
3. May **not** use the "LDOC" or "Living Document" trademark to promote, endorse, or misrepresent unauthorized derivatives without written consent.

---

## 3. Client-Side Security Model

### 3.1 Sandbox Isolation
The `.ldocx` format supports interactive computational elements including custom code blocks, JSX/React components, 3D WebGL scenes, and Chart.js visualizations. These execute within **sandboxed iframes** (`<iframe sandbox="allow-scripts allow-modals allow-forms">`) that enforce the following isolation boundaries:

- **No `allow-same-origin`**: Sandboxed code **cannot** access the parent page's `localStorage`, `sessionStorage`, cookies, or DOM.
- **No cross-frame DOM access**: Code within the sandbox cannot read or modify elements outside its iframe.
- **Network isolation**: Sandboxed code runs under the iframe's restricted origin, limiting `fetch`/`XMLHttpRequest` scope.
- **Text Layout Engine Security**: The integrated `@chenglou/pretext` text layout engine (`src/ldoc-text-layout.js`) is a measurement-only library with no network access, DOM mutation, or code-execution surface, executing purely as deterministic canvas font arithmetic.

### 3.2 AST Schema Validation
All `.ldocx` containers (`document.json` / `spec.json`) are parsed by `ldoc-parser.js`, which validates block type fields before any node is mounted into the DOM.

### 3.3 Zero Server Payload Transmission
Document parsing, 3D model geometry generation, and presentation rendering occur 100% in local browser memory (RAM), with no mandatory server communication for core document operations.

### 3.4 AI API Key Storage
When users configure an AI assistant provider (Gemini, OpenAI, or local Ollama), their API key is stored in **plaintext in `localStorage`** on the local device. Users are warned that:
- Keys should be rotatable (not primary production keys).
- `.ldocx` files containing sandbox code should not be shared if the device holds sensitive API keys.
- Future versions may implement encrypted key storage or server-side AI proxying.

### 3.5 Known Limitations & Planned Improvements
The following security features are **planned for future releases** but are not yet implemented:

- **SHA-256 Container Integrity Checksums**: Packaged `.ldocx` archives do not currently embed integrity manifests. This is on the roadmap.
- **Hardware-Key Cryptographic Signing**: Ed25519 / hardware-key signing is not yet implemented. The UI references to "Ed25519 Organization Signature" are placeholders for a future release.
- **Per-Block-Type Schema Validation**: Block validation currently checks for a `type` field but does not perform full JSON Schema validation per block type. More rigorous validation is planned.
- **Content-Security-Policy**: A CSP meta tag is included but currently uses `'unsafe-inline'` and `'unsafe-eval'` to maintain compatibility with the existing inline event handler pattern. These will be progressively tightened as handlers are migrated to `addEventListener`.

---

## 4. Reporting a Security Vulnerability
If you discover a security vulnerability, please report it privately:
- Maintainer: J AI ENTERPRISES
- Contact: `jayaraman2212066@ssn.edu.in`
- Response Time: Within 48 hours

Please do not disclose security issues publicly until an official patch has been deployed.
