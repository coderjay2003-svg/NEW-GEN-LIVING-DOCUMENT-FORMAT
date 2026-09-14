# LDOCX Living Document Format: Enterprise Architecture, Security & 3D Engineering Specification

> **A Comprehensive Technical Blueprint for Senior Developers, Security Engineers, and 3D Artists**  
> *Version 2.5.0 — Specification & Implementation Manual*

---

## Table of Contents
1. [Executive Summary & Paradigm Shift](#1-executive-summary--paradigm-shift)
2. [Section 1: The Senior Developer's Architectural Guide](#2-section-1-the-senior-developers-architectural-guide)
   - [2.1 File Format Anatomy (.ldocx)](#21-file-format-anatomy-ldocx)
   - [2.2 Abstract Syntax Tree (AST) Specification](#22-abstract-syntax-tree-ast-specification)
   - [2.3 Multi-Style Presentation Artifact Engine](#23-multi-style-presentation-artifact-engine)
   - [2.4 Real-Time Tactile Paper Physics Engine](#24-real-time-tactile-paper-physics-engine)
   - [2.5 Universal In-Canvas Free-Text Writing & Inline Editing](#25-universal-in-canvas-free-text-writing--inline-editing)
   - [2.6 Client-Server Architecture & APIs](#26-client-server-architecture--apis)
   - [2.7 How to Extend & Modify the Codebase](#27-how-to-extend--modify-the-codebase)
3. [Section 2: The Security Engineer's Hardening Manual](#3-section-2-the-security-engineers-hardening-manual)
   - [3.1 Threat Model & Attack Surfaces](#31-threat-model--attack-surfaces)
   - [3.2 Sandboxing & Dynamic Script Isolation](#32-sandboxing--dynamic-script-isolation)
   - [3.3 ZIP Slip & Path Traversal Mitigations](#33-zip-slip--path-traversal-mitigations)
   - [3.4 Local HTTP Server & Loopback Binding Security](#34-local-http-server--loopback-binding-security)
   - [3.5 Cryptographic Verification & Package Integrity](#35-cryptographic-verification--package-integrity)
   - [3.6 Content Security Policy (CSP) Directives](#36-content-security-policy-csp-directives)
4. [Section 3: The 3D Artist & Creative Technologist Blueprint](#4-section-3-the-3d-artist--creative-technologist-blueprint)
   - [4.1 3D Engine Lifecycle (Three.js WebGL Runtime)](#41-3d-engine-lifecycle-threejs-webgl-runtime)
   - [4.2 Shader Materials & Holographic Presets](#42-shader-materials--holographic-presets)
   - [4.3 Model Optimization Guidelines (GLTF/GLB)](#43-model-optimization-guidelines-gltfglb)
   - [4.4 Interactive Fluid Ripple & Particle Physics Engines](#44-interactive-fluid-ripple--particle-physics-engines)
   - [4.5 Step-by-Step: Adding Custom 3D Assets](#45-step-by-step-adding-custom-3d-assets)
5. [Quick-Start Checklists](#5-quick-start-checklists)

---

## 1. Executive Summary & Paradigm Shift

The **LDOCX (Living Document XML/eXtended)** format represents a generational leap in digital publishing and presentation technology. While traditional formats (such as PDF and static EPUB) treat documents as flat, unreactive print emulations, **LDOCX reimagines documents as self-contained, intelligent, reactive 3D software runtimes**.

```
+------------------------------------------------------------------------+
|                          LDOCX LIVING DOCUMENT                         |
|                                                                        |
|  +-----------------------+  +------------------+  +-----------------+  |
|  |   Tactile Paper Feel  |  |   Interactive    |  |  In-Engine 4K   |  |
|  |  3D Corner Lift &     |  |  WebGL 3D Models |  | Fluid Water &   |  |
|  |  Real Paper Physics   |  |  & Holo Shaders  |  | Particle Waves  |  |
|  +-----------------------+  +------------------+  +-----------------+  |
|                                                                        |
|  +-----------------------+  +------------------+  +-----------------+  |
|  | Universal In-Canvas   |  |  Dynamic Forms   |  | Embedded Local  |  |
|  |  Free Text Writing    |  |  & Stripe Pay    |  | Reactive State  |  |
|  |  & Direct Typography  |  |  Checkout Links  |  | & AI Assistant  |  |
|  +-----------------------+  +------------------+  +-----------------+  |
+------------------------------------------------------------------------+
```

### Key Differentiators

| Capability | Traditional PDF | Web Slides (PPTX/Keynote) | LDOCX Living Document |
|---|---|---|---|
| **Interactivity** | Static vector/raster | Linear button links | **True 60 FPS WebGL, Shaders, Sandboxes** |
| **Tactile Feel** | Rigid flat page | Slide transitions | **Real-time 3D paper flex & hand pressure physics** |
| **Free-Form Text** | Requires Acrobat Pro | Text box locks | **Direct in-canvas double-click free writing everywhere** |
| **Media Coupling** | Passive video embed | Simple play/pause | **Keystrokes trigger real-time water wave ripples** |
| **Data Capture** | Flat AcroForms | External links | **Direct Stripe payment gateways & webhook forms** |
| **Portability** | Single file | Presentation file + media | **Zero-dependency .ldocx archive (ZIP container)** |

---

## 2. Section 1: The Senior Developer's Architectural Guide

### 2.1 File Format Anatomy (.ldocx)
An `.ldocx` package is a standardized ZIP container containing structured JSON metadata, reactive AST page trees, and media assets.

```
document.ldocx (ZIP Archive)
|-- manifest.json            <- Package metadata, schema version, page index
|-- pages/
|   |-- page_1.json          <- AST node tree for Slide 1
|   |-- page_2.json          <- AST node tree for Slide 2
|   `-- page_n.json
|-- assets/
|   |-- models/              <- GLTF/GLB/OBJ binary models
|   |-- textures/            <- Environment maps, bump/roughness maps
|   |-- audio/               <- Ambient atmospheric sound loops (MP3/OGG)
|   `-- video/               <- Moving photograph cutouts (MP4/WebM)
|-- scripts/                 <- Custom sandbox logic (optional)
`-- checksum.sha256          <- Package integrity verification hash
```

#### `manifest.json` Structure
```json
{
  "schema_version": "2.4.0",
  "document_id": "doc_gt6_velocity",
  "title": "GT6: Velocity Unleashed",
  "author": "Living Document Architecture Team",
  "created_at": "2026-09-02T00:00:00Z",
  "default_presentation_mode": "paper",
  "default_visual_fx": "water",
  "soundtrack": {
    "src": "assets/audio/synthwave.mp3",
    "title": "Neon Horizon (Synthwave Atmospheric Loop)",
    "autoplay": false
  },
  "pages": [
    { "number": 1, "title": "Hypercar Aerodynamics", "file": "pages/page_1.json" },
    { "number": 2, "title": "Telemetry & Hybrid Powertrain", "file": "pages/page_2.json" }
  ]
}
```

---

### 2.2 Abstract Syntax Tree (AST) Specification
Each page is expressed as a deterministic AST hierarchy. The top-level element is a `container` or `section` containing typed child nodes.

```typescript
interface LDocNode {
  type: NodeType;
  value?: string;
  level?: number;             // For heading (1-6)
  style?: LDocNodeStyle;
  children?: LDocNode[];
  aria?: LDocAriaMetadata;
}

type NodeType = 
  | 'heading' | 'paragraph' | 'blockquote' | 'list' | 'list_item' | 'table'
  | 'image' | 'web_image' | 'video' | 'web_video' | 'audio'
  | 'model_3d' | 'jsx_canvas' | 'particles' | 'water_effect'
  | 'button' | 'form' | 'preorder';

interface LDocNodeStyle {
  src?: string;
  alt?: string;
  label?: string;
  action?: 'link' | 'navigate' | 'submit' | 'save_state';
  target?: string;
  btn_style?: 'royal_gold' | 'neon_cyan' | 'purple_nebula' | 'minimal';
  code?: string;              // Custom HTML/JS sandbox payload
  mode?: string;              // FX mode: water, stardust, warp, embers
  model_format?: 'gltf' | 'glb' | 'obj' | 'procedural';
  model_material?: 'cyber_hologram' | 'royal_gold' | 'obsidian_carbon' | 'crystal_cobalt';
  checkout_url?: string;      // Stripe checkout link
  webhook_url?: string;       // Webhook endpoint for lead forms
}
```

---

### 2.3 Multi-Style Presentation Artifact Engine
The presentation engine features **4 distinct rendering artifacts**, controlled dynamically via `setPresentationMode(mode)`:

1. **`paper` (Enchanted Tactile Paper)**:
   - Surface: Warm fibrous parchment gradient with 3-tier drop shadows.
   - Typography: Letterpress ink-bleed with subtle emboss (`text-shadow: 0 1px 1px rgba(255,255,255,0.9)`).
2. **`glass` (Frosted Holographic Cards)**:
   - Surface: `backdrop-filter: blur(28px) saturate(180%)`, border gradient.
   - Micro-interactions: Cards float with independent 3D tilt tracking cursor distance.
3. **`deck` (16:9 Keynote Deck)**:
   - Responsive widescreen slide frame (1440x760px), obsidian dark mode, split metric cards.
4. **`gazette` (Living Editorial Gazette)**:
   - CSS Multi-column layout (`column-count: 2; column-gap: 40px`), gilded drop-caps, full-width header spans.

---

### 2.4 Real-Time Tactile Paper Physics Engine
The tactile paper engine simulates **the physical interaction of human fingers touching and flexing paper**:

```javascript
function attachTactilePaperPhysics(page) {
  page.addEventListener('mousemove', (e) => {
    if (currentPresentationMode !== 'paper') return;
    const rect = page.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) - 0.5;
    const py = ((e.clientY - rect.top) / rect.height) - 0.5;

    // Calculate realistic tilt angle and elevation shadow
    const rx = -py * 7;
    const ry = px * 7;
    const shadowX = -px * 38;
    const shadowY = Math.max(16, 26 + py * 26);
    const shadowBlur = 48 + Math.abs(px * 28);

    page.style.setProperty('--paper-rx', `${rx.toFixed(2)}deg`);
    page.style.setProperty('--paper-ry', `${ry.toFixed(2)}deg`);
    page.style.setProperty('--paper-shadow', 
      `${shadowX.toFixed(0)}px ${shadowY.toFixed(0)}px ${shadowBlur.toFixed(0)}px rgba(0,0,0,0.52)`);
    page.classList.add('paper-lifted');
  });

  page.addEventListener('mousedown', () => {
    if (currentPresentationMode !== 'paper') return;
    page.style.transform = 
      'perspective(1200px) rotateX(var(--paper-rx)) rotateY(var(--paper-ry)) translateZ(2px) scale(0.992)';
  });
}
```

---

### 2.5 Universal In-Canvas Free-Text Writing & Inline Editing
LDOC eliminates rigid text containers through a dual-layer typography engine:

1. **Direct In-Place Editing**:
   - `enableInPlaceEditing(container)` attaches `contenteditable="true"` to every text node (`h1-h6`, `p`, `blockquote`, `li`, `caption`).
   - Typing triggers keystroke event handlers that notify the visual FX engine.
2. **Ambient Floating Dynamic Text Layers**:
   - Double-clicking anywhere on the presentation canvas calls `spawnAmbientText(x, y)`.
   - Injects a floating note with an interactive **HUD Toolbar**:
     - Font family selector: `Dancing Script` (handwritten script), `Cinzel Decorative` (regal gold), `Playfair Display` (editorial), `Plus Jakarta Sans` (modern), `JetBrains Mono` (code/cyber), `Space Grotesk` (futuristic).
     - Color swatch picker with instant gradient and drop-shadow generation.
     - Draggable handle (`::`) with client boundary clamping.
3. **Audio-Visual Ripple Coupling**:
   - Keystrokes invoke `emitWaterWaveAtElement(el)`, creating expanding concentric fluid wavefronts across the canvas background.

---

### 2.6 Client-Server Architecture & APIs
The project runs as a lightweight, zero-dependency stack:

```
+--------------------------------------------------------+
|               Windows Native Desktop App               |
|         (LDOC-Studio.exe / LDOC-Creator.exe)           |
|                           |                            |
|           Edge WebView2 / Isolated Window Host         |
|                           |                            |
|                  http://127.0.0.1:8080/                |
|                           |                            |
|  +------------------------v-------------------------+  |
|  |         ldoc-server.exe (Go HTTP Engine)         |  |
|  |  - Static Asset Delivery                         |  |
|  |  - AST Parsing & Validation                      |  |
|  |  - Document ZIP Extraction                       |  |
|  |  - Converter Endpoint (MD, TXT, DOCX -> LDOCX)   |  |
|  +--------------------------------------------------+  |
+--------------------------------------------------------+
```

#### Core Server Endpoints
- `GET /api/status` - Health check and server capabilities.
- `GET /documents/:id/pages/:num/content` - Returns parsed AST JSON for slide `:num`.
- `GET /documents/:id/assets/:assetId` - Streams binary asset with caching headers.
- `POST /api/convert` - Ingests Markdown, plaintext, or `.docx` and packages a valid `.ldocx` archive.
- `POST /api/validate` - Validates AST schema against schema version 2.5.0.

---

### 2.7 How to Extend & Modify the Codebase

#### Adding a New Block Type to the AST
1. **Define Schema**: In `creator.html` and `index.html`, add your new block type to `renderBlockNode()` and `renderCreatorSlideBlock()`.
2. **Add Creator Controls**: In `creator.html`, add an action button to `#elem-bar` (`<button onclick="addBlock('my_block')">`).
3. **Hook Preview**: In `creator.html` inside `renderCreatorSlideBlock()`, add a case for `my_block` rendering your interactive HTML.
4. **Export Serialization**: Ensure `buildDoc()` includes your block's attributes in `pages/page_*.json`.

---

## 3. Section 2: The Security Engineer's Hardening Manual

### 3.1 Threat Model & Attack Surfaces

```
+-------------------------------------------------------------------+
|                      ATTACK SURFACE TAXONOMY                      |
+-----------------------+----------------------+--------------------+
| Package Ingestion     | Sandbox Evaluation   | Local Server       |
+-----------------------+----------------------+--------------------+
| * Zip Slip Traversal  | * DOM XSS Injection  | * Loopback Binding |
| * Malicious SVG/XML   | * LocalStorage Leak  | * CORS Origin Lock |
| * Decompression Bomb  | * Parent Frame Theft | * CSRF Protection  |
| * Oversized Assets    | * Rich-Text Paste    | * PDF Export Route |
+-----------------------+----------------------+--------------------+

### 3.1.1 Extension Pack v2.5.0 Attack Surface Additions
| Vector | Threat | Mitigation |
|---|---|---|
| **Rich-Text Paste** | DOM XSS via clipboard HTML (Word / Google Docs paste) | Strict allow-list tag and attribute sanitizer ahead of existing `escapeHtml()` stage; never raw clipboard `innerHTML`. |
| **Image / 3D Upload** | Decompression bomb, oversized texture, malformed GLTF | Enforce size ceilings (max 10MB texture, <60k triangles) in AST parser and `/api/convert`. |
| **`POST /api/export/pdf`** | Unauthorized PDF generation / loopback abuse | Reuses existing Origin, Referer, and loopback verification (`127.0.0.1:8080`). |
```

---

### 3.2 Sandboxing & Dynamic Script Isolation
LDOC allows embedded interactive sandboxes (`jsx_canvas`). To prevent malicious scripts from accessing session tokens, files, or local storage, execution is strictly compartmentalized:

1. **Iframe Sandboxing**:
   - Custom executable snippets run inside `<iframe>` elements configured with strict attribute isolation:
     `<iframe sandbox="allow-scripts" srcdoc="..."></iframe>`
   - Notice: `allow-same-origin`, `allow-top-navigation`, and `allow-popups` are **explicitly omitted**, preventing child sandboxes from reading parent DOM or cookies.
2. **HTML Sanitization**:
   - All text inputs render via `escapeHtml()`:
     ```javascript
     function escapeHtml(str) {
       return String(str)
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#039;');
     }
     ```

---

### 3.3 ZIP Slip & Path Traversal Mitigations
When reading `.ldocx` packages, archive extractors must prevent malicious filenames containing `../` sequences:

```go
// Safe ZIP extraction pattern implemented in server:
func sanitizeZipPath(targetDir, filePath string) (string, error) {
    cleanPath := filepath.Clean(filePath)
    dest := filepath.Join(targetDir, cleanPath)
    if !strings.HasPrefix(dest, filepath.Clean(targetDir) + string(filepath.Separator)) {
        return "", fmt.Errorf("security violation: illegal path traversal %s", filePath)
    }
    return dest, nil
}
```

---

### 3.4 Local HTTP Server & Loopback Binding Security
1. **Loopback Only**: `ldoc-server.exe` binds strictly to `127.0.0.1:8080`. It never binds to `0.0.0.0`, ensuring the server cannot be reached by other devices on the same Wi-Fi or LAN.
2. **Origin Validation**: REST endpoints inspect incoming `Origin` and `Referer` headers, discarding cross-origin requests from external web pages.

---

### 3.5 Cryptographic Verification & Package Integrity
Every production `.ldocx` package includes a `checksum.sha256` manifest. Before opening a document, the hash of all internal entries is verified against the signed manifest to detect tampering.

---

### 3.6 Content Security Policy (CSP) Directives
When deploying to cloud platforms (GitHub Pages, Vercel, Netlify), enforce the following recommended CSP:

```http
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  img-src 'self' data: https: blob:; 
  media-src 'self' https: blob:; 
  frame-src 'self' data:; 
  connect-src 'self' https:;
```

---

## 4. Section 3: The 3D Artist & Creative Technologist Blueprint

### 4.1 3D Engine Lifecycle (Three.js WebGL Runtime)
LDOC features an embedded WebGL rendering pipeline built on Three.js:

```
ThreeJsViewer Instance
|-- Scene (THREE.Scene)
|-- Camera (THREE.PerspectiveCamera, 45 deg FOV)
|-- WebGLRenderer (antialias: true, alpha: true)
|-- Lighting Rig
|   |-- AmbientLight (0xffffff, intensity 0.6)
|   |-- DirectionalLight Key (0xf59e0b, intensity 1.2, top-right)
|   `-- DirectionalLight Fill (0x38bdf8, intensity 0.8, bottom-left)
`-- Render Loop (60 FPS with motion throttling window.__ldocLivingMotion)
```

---

### 4.2 Shader Materials & Holographic Presets
The engine ships with 4 pre-compiled PBR materials:

```javascript
const MaterialPresets = {
  // Cyberpunk Sci-Fi Hologram
  cyber_hologram: new THREE.MeshPhongMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    wireframe: true,
    transparent: true,
    opacity: 0.85
  }),

  // Royal Gilded 24K Gold
  royal_gold: new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.94,
    roughness: 0.16,
    envMapIntensity: 1.5
  }),

  // Obsidian Carbon Fiber
  obsidian_carbon: new THREE.MeshStandardMaterial({
    color: 0x111118,
    metalness: 0.3,
    roughness: 0.7
  }),

  // Cobalt Refractive Crystal
  crystal_cobalt: new THREE.MeshPhysicalMaterial({
    color: 0x60a5fa,
    transmission: 0.9,
    opacity: 1,
    transparent: true,
    roughness: 0.1,
    ior: 1.52
  })
};
```

---

### 4.3 Model Optimization Guidelines (GLTF/GLB)

| Parameter | Recommended Specification | Hard Limit |
|---|---|---|
| **File Format** | Binary GLTF (`.glb`) with Draco compression | `.gltf` with external textures |
| **Polygon Budget** | 15,000 - 35,000 Triangles per model | 60,000 Triangles |
| **Texture Resolution** | 1024x1024 (PBR Packed: ORM map) | 2048x2048 |
| **Draw Calls** | < 12 draw calls per scene | 25 draw calls |
| **Scale & Origin** | Centered at `(0, 0, 0)`, normalized to 2 unit bounding box | Max dimension 5 units |
| **Animation Tracks** | Baked skeletal or node rotations at 30 FPS | Max 3 simultaneous tracks |

---

### 4.4 Interactive Fluid Ripple & Particle Physics Engines
The background canvas (`#fx-bg-canvas`) executes real-time 2D fluid simulation:

- **Temporal Wave Simulation**: Generates 5 concentric fluid ribbons oscillating dynamically.
- **Mouse & Keystroke Coupling**: Any mouse move or character typed inside an ambient text note injects a wave disturbance propagating radially outward.

---

### 4.5 Step-by-Step: Adding Custom 3D Assets
1. **Export**: Export your 3D asset from Blender/Maya as `.glb` with Draco compression enabled.
2. **Pack**: Place the `.glb` file inside the `.ldocx` package in `assets/models/my_asset.glb`.
3. **Reference in AST**:
   ```json
   {
     "type": "model_3d",
     "value": "Autonomous Hypercar Chassis",
     "style": {
       "src": "assets/models/my_asset.glb",
       "model_material": "royal_gold",
       "model_format": "glb",
       "autorotate": true
     }
   }
   ```
4. **Preview**: Open in **Creator** or **Studio**; the model will automatically load, center, and illuminate.

---

## 5. Quick-Start Checklists

### For Senior Developers
- [x] Review `.ldocx` ZIP file structure and AST node definitions.
- [x] Run `ldoc-server.exe` locally (`http://127.0.0.1:8080`).
- [x] Test switching presentation modes (`paper`, `glass`, `deck`, `gazette`).
- [x] Test double-clicking canvas to verify dynamic ambient text layers.
- [x] Run automated deploy workflow via `.github/workflows/deploy.yml`.

### For Security Engineers
- [x] Verify loopback binding (`netstat -ano | findstr 8080` bound to `127.0.0.1`).
- [x] Verify sandbox iframe flags (`allow-same-origin` omitted).
- [x] Verify `escapeHtml()` coverage across all user input nodes.
- [x] Audit ZIP path handling against directory traversal exploits.

### For 3D Artists
- [x] Validate model polygon count is within 35,000 triangle budget.
- [x] Ensure textures use PBR metallic-roughness workflow (ORM packed).
- [x] Verify coordinate center is at `(0, 0, 0)` with positive Y as up-axis.
- [x] Test model rendering with `royal_gold` and `cyber_hologram` materials.

---

*(c) 2026 LDOC Living Document Foundation. Licensed under the Apache-2.0 License.*
