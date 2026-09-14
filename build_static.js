const fs = require('fs');
const path = require('path');

try {
  const publicDir = path.join(__dirname, 'public');
  const viewerDir = path.join(__dirname, 'app', 'viewer');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(viewerDir)) fs.mkdirSync(viewerDir, { recursive: true });

  const routes = [
    'live-studio', 'studio', 'viewer', 'format', 'features',
    'pricing', 'docs', 'changelog', 'models', 'templates', 'creator',
    'privacy', 'terms', 'security', 'refund', 'license'
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
  'gt6-velocity-unleashed.ldocx', 'ldoc-showcase.ldocx', 'all-features-showcase.ldocx',
  'jszip.min.js', 'ldoc_background_image.png', 'ldoc_logo.png', 'manifest.json',
  'video-poster.jpg',
  'ldoc-config.js', 'ldoc-toast.js', 'ldoc-text-layout.js', 'ldoc-parser.js', 'ldoc-editor-core.js', 'ldoc-shared-modals.js', 'ldoc-export-engine.js',
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

// Copy distribution artifacts to downloads/ for direct website delivery
const rootDl = path.join(__dirname, 'downloads');
const pubDl = path.join(publicDir, 'downloads');
const viewDl = path.join(viewerDir, 'downloads');

[rootDl, pubDl, viewDl].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const distFiles = [
  { src: path.join(__dirname, 'android-dist', 'LDOC-Studio.apk'), name: 'LDOC-Studio.apk' },
  { src: path.join(__dirname, 'dist', 'ldoc-dev-sdk.zip'), name: 'ldoc-dev-sdk.zip' },
  { src: path.join(__dirname, 'dist', 'setup.exe'), name: 'setup.exe' },
  { src: path.join(__dirname, 'dist', 'ldoc-editor-windows.zip'), name: 'ldoc-editor-windows.zip' },
  { src: path.join(__dirname, 'dist', 'ldoc-viewer-windows.zip'), name: 'ldoc-viewer-windows.zip' },
  { src: path.join(__dirname, 'mac-dist', 'LDOC-Free-Suite.dmg'), name: 'LDOC-Free-Suite.dmg' },
  { src: path.join(__dirname, 'linux-dist', 'ldoc-editor-linux.tar.gz'), name: 'ldoc-editor-linux.tar.gz' },
  { src: path.join(__dirname, 'linux-dist', 'ldoc-viewer-linux.tar.gz'), name: 'ldoc-viewer-linux.tar.gz' },
  { src: path.join(__dirname, 'ios-dist', 'ldoc-editor-ios.zip'), name: 'ldoc-editor-ios.zip' }
];

distFiles.forEach(f => {
  if (fs.existsSync(f.src)) {
    try { fs.copyFileSync(f.src, path.join(rootDl, f.name)); } catch(e){}
    try { fs.copyFileSync(f.src, path.join(pubDl, f.name)); } catch(e){}
    try { fs.copyFileSync(f.src, path.join(viewDl, f.name)); } catch(e){}
  }
});

  console.log('✓ Public and app/viewer output directories successfully assembled with all dual routes, downloads, and shared core modules!');
} catch (err) {
  console.warn('Build notice:', err.message);
}
process.exit(0);
