const fs = require('fs');
const path = require('path');

try {
  const publicDir = path.join(__dirname, 'public');
  const viewerDir = path.join(__dirname, 'app', 'viewer');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(viewerDir)) fs.mkdirSync(viewerDir, { recursive: true });

  const routes = [
  'live-studio', 'studio', 'viewer', 'format', 'features',
  'pricing', 'docs', 'changelog', 'models', 'templates', 'creator'
];

routes.forEach(r => {
  const src = path.join(__dirname, `${r}.html`);
  if (fs.existsSync(src)) {
    // 1. Flat file in public
    fs.copyFileSync(src, path.join(publicDir, `${r}.html`));
    // 2. Directory index in public
    const dir = path.join(publicDir, r);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(src, path.join(dir, 'index.html'));

    // 3. Mirror in app/viewer
    fs.copyFileSync(src, path.join(viewerDir, `${r}.html`));
    const vSub = path.join(viewerDir, r);
    if (!fs.existsSync(vSub)) fs.mkdirSync(vSub, { recursive: true });
    fs.copyFileSync(src, path.join(vSub, 'index.html'));
  }
});

// Removed /studio/try: Studio requires authentication

const assets = [
  'index.html', 'three.min.js', 'ai-brain.png', 'app.ico', 'daily-prophet.ldocx',
  'gt6-velocity-unleashed.ldocx', 'ldoc-showcase.ldocx',
  'jszip.min.js', 'ldoc_background_image.png', 'ldoc_logo.png', 'manifest.json',
  'video-poster.jpg',
  'ldoc-config.js', 'ldoc-toast.js', 'ldoc-parser.js', 'ldoc-editor-core.js', 'ldoc-shared-modals.js', 'ldoc-export-engine.js',
  'LDOCX_ARCHITECTURE_AND_SECURITY_GUIDE.pdf', 'LDOCX_TECHNICAL_SPECIFICATION.pdf',
  'LDOCX_ENTERPRISE_ARCHITECTURE_GUIDE.pdf', 'LDOCX_ENTERPRISE_ARCHITECTURE_GUIDE.md', 'LDOCX-FORMAT-SPECIFICATION.md', 'CONTENT.md',
  'upscaled-videoad2.mp4'
];

assets.forEach(a => {
  const src = path.join(__dirname, a);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(publicDir, a));
    fs.copyFileSync(src, path.join(viewerDir, a));
  }
});

// Large downloads (>100MB) are served directly via GitHub Releases CDN and vercel.json redirects
// Avoid copying hundreds of megabytes into public deployment bundle

  console.log('✓ Public and app/viewer output directories successfully assembled with all dual routes, downloads, and shared core modules!');
} catch (err) {
  console.warn('Build notice:', err.message);
}
process.exit(0);
