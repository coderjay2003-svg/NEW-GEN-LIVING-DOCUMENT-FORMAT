# Security & Intellectual Property Policy

## 1. Copyright & Licensing
- **Project**: LDOC / LDOCX Living Document Format Standard & Studio Suite
- **Owner & Author**: J-AI-ENTERPRISES
- **Copyright**: © 2026 J-AI-ENTERPRISES. All Rights Reserved.
- **License**: [Apache License, Version 2.0](LICENSE)

---

## 2. Anti-Theft & Trademark Protection
The name **LDOC**, **LDOCX**, **Living Document**, **Living Document Format**, **Living Studio**, and all associated icons, branding, and logos are proprietary trademarks of J-AI-ENTERPRISES.

While the core file format specification and parser are licensed under Apache-2.0 to enable open inter-compatibility and community reading/writing, **Section 6 of the Apache 2.0 License explicitly excludes trademark rights**. 

Any redistribution, derivative application, or commercial product:
1. Must retain all original copyright notices (`© 2026 J-AI-ENTERPRISES`).
2. Must retain the `NOTICE` file in all distributions.
3. May **not** use the "LDOC" or "Living Document" trademark to promote, endorse, or misrepresent unauthorized derivatives without written consent.

---

## 3. Sandboxed Execution & Client-Side Security Model
The `.ldocx` format executes rich client-side computational elements, charts, 3D scenes, and custom JSX sandboxes. To protect users from malicious document payloads:

1. **AST Schema Validation**:
   All `.ldocx` containers (`document.json`) must strictly adhere to the typed AST schema before any node is mounted into the DOM.
2. **Client-Side Sandbox Isolation**:
   Custom code blocks run within an isolated function execution boundary (`executeCustomSandboxCode`) with restricted global scopes, blocking unsafe prototype poisoning and cross-site execution.
3. **SHA-256 Container Integrity Checksums**:
   Every packaged `.ldocx` archive embeds a `checksum.sha256` manifest validating `manifest.json` and `document.json` to detect tampering or in-transit corruption.
4. **Zero Server Payload Transmission**:
   Document parsing, 3D model geometry generation, and presentation rendering occur 100% in local browser memory (RAM), eliminating backend data leakage.

---

## 4. Reporting a Security Vulnerability
If you discover a security vulnerability, please report it privately:
- Maintainer: J-AI-ENTERPRISES
- Contact: `jayaraman2212066@ssn.edu.in`
- Response Time: Within 48 hours

Please do not disclose security issues publicly until an official patch has been deployed.
