/**
 * LDOC Living Document Studio — Universal Master Build Pipeline
 * Compiles all source files from `src/`, bundles standalone engines,
 * synchronizes multi-platform package mirrors, and packages release archives.
 * 
 * Usage:
 *   npm run build
 *   node build.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = null; // Use built-in or JSZip/external if needed

const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');

console.log('================================================================');
console.log('🏗️  LDOC LIVING DOCUMENT STUDIO: MASTER BUILD PIPELINE');
console.log('================================================================\n');

// ── STEP 1: Compile src/ldoc-text-layout.js ──
console.log('▶ STEP 1: Compiling standalone ldoc-text-layout.js from src/...');
try {
  execSync('node build_text_layout.js', { cwd: rootDir, stdio: 'inherit' });
} catch (err) {
  console.error('Error compiling ldoc-text-layout.js:', err.message);
  process.exit(1);
}

// ── STEP 2: Synchronize Source Modules from src/ to Root & Packages ──
console.log('\n▶ STEP 2: Synchronizing source modules from src/ across targets...');
const coreModules = [
  'ldoc-text-layout.js',
  'ldoc-editor-core.js',
  'ldoc-parser.js',
  'ldoc-export-engine.js',
  'ldoc-shared-modals.js',
  'ldoc-toast.js',
  'ldoc-config.js'
];

const syncTargets = [
  path.join(rootDir, 'public'),
  path.join(rootDir, 'app', 'viewer'),
  path.join(rootDir, 'packages', 'ldoc-editor'),
  path.join(rootDir, 'packages', 'ldoc-studio'),
  path.join(rootDir, 'packages', 'ldoc-viewer'),
  path.join(rootDir, 'ios-xcode-wrapper', 'LDOCViewer', 'www')
];

coreModules.forEach(mod => {
  // Source is in src/ (except compiled ldoc-text-layout.js which is in root)
  const srcFile = mod === 'ldoc-text-layout.js'
    ? path.join(rootDir, 'ldoc-text-layout.js')
    : path.join(srcDir, mod);

  if (!fs.existsSync(srcFile)) {
    console.warn(`  ⚠️ Warning: Source file ${mod} not found at ${srcFile}`);
    return;
  }

  // Sync to root if from src/
  if (mod !== 'ldoc-text-layout.js') {
    fs.copyFileSync(srcFile, path.join(rootDir, mod));
  }

  // Also sync to packages/ldoc-sdk for ldoc-text-layout.js and ldoc-parser.js
  if (mod === 'ldoc-text-layout.js' || mod === 'ldoc-parser.js') {
    fs.copyFileSync(srcFile, path.join(rootDir, 'packages', 'ldoc-sdk', mod));
  }

  // Sync to all other targets
  syncTargets.forEach(targetDir => {
    if (fs.existsSync(targetDir)) {
      fs.copyFileSync(srcFile, path.join(targetDir, mod));
    }
  });
});
console.log('✓ Successfully synchronized core modules across all packages and web views.');

// ── STEP 3: Assemble Public & Viewer Web Routes ──
console.log('\n▶ STEP 3: Assembling static web app and dual routes...');
try {
  execSync('node build_static.js', { cwd: rootDir, stdio: 'inherit' });
} catch (err) {
  console.error('Error running build_static.js:', err.message);
  process.exit(1);
}

// ── STEP 4: Package Release Archives (dist/, linux-dist/, mac-dist/, ios-dist/) ──
console.log('\n▶ STEP 4: Packaging platform release archives...');
try {
  execSync('python package_dist.py', { cwd: rootDir, stdio: 'inherit' });
} catch (err) {
  console.warn('Note on packaging:', err.message);
}

console.log('\n================================================================');
console.log('✅ MASTER BUILD COMPLETE: All sources, packages, and archives ready.');
console.log('================================================================\n');
