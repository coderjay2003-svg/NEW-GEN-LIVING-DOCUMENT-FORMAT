/**
 * Automated Build Script for ldoc-text-layout.js
 * Compiles src/ldoc-text-layout.js into standalone universal zero-dependency bundle.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'src', 'ldoc-text-layout.js');
const rawFile = path.join(__dirname, 'ldoc-text-layout-raw.js');
const distFile = path.join(__dirname, 'ldoc-text-layout.js');

console.log('1. Compiling src/ldoc-text-layout.js with esbuild...');
execSync(`npx esbuild "${srcFile}" --bundle --format=iife --global-name=__LDocTextLayoutInternal --platform=neutral --target=es2020 --outfile="${rawFile}"`, { stdio: 'inherit' });

console.log('2. Adding Universal UMD/CommonJS/Browser runtime wrappers...');
const rawCode = fs.readFileSync(rawFile, 'utf8');

const header = `/**
 * LdocTextLayout — Universal Canvas-Based Text Measurement & Layout Primitive
 * Encapsulates @chenglou/pretext (MIT, ~15KB, zero-dependencies)
 * Standalone Zero-Dependency Distribution for Browser, Node.js, and Mobile WebViews.
 * Copyright (c) 2026 J-AI-ENTERPRISES. All Rights Reserved.
 * Licensed under Apache-2.0.
 */
`;

const footer = `
(function () {
  var exported = (typeof __LDocTextLayoutInternal !== 'undefined')
    ? (__LDocTextLayoutInternal.default || __LDocTextLayoutInternal.LdocTextLayout || __LDocTextLayoutInternal)
    : null;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exported;
    module.exports.default = exported;
    module.exports.LdocTextLayout = exported;
    module.exports.LDocTextLayout = exported;
  }
  if (typeof window !== 'undefined') {
    window.LDocTextLayout = exported;
    window.LdocTextLayout = exported;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.LDocTextLayout = exported;
    globalThis.LdocTextLayout = exported;
  }
})();
`;

fs.writeFileSync(distFile, header + rawCode + footer, 'utf8');
try { fs.unlinkSync(rawFile); } catch(_) {}

console.log(`✓ Generated universal ${distFile} (${fs.statSync(distFile).size} bytes)`);
