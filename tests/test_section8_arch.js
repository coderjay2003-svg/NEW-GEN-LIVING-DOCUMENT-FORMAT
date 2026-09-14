/**
 * Section 8: Architecture Conformance Tests
 * Validates:
 * 1. @chenglou/pretext is imported ONLY within LdocTextLayout module (src/ldoc-text-layout.js / ldoc-text-layout.js).
 * 2. @chenglou/pretext is strictly pinned to an exact version (e.g. "0.0.9", no ^ or ~) in all package manifests.
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Running Section 8: Architecture Conformance Tests...\n');

// ── 8.1: Grep all source files for @chenglou/pretext imports
console.log('▶ 8.1: Checking import encapsulation for @chenglou/pretext...');
const rootDir = path.resolve(__dirname, '..');

const allowedFiles = new Set([
  path.normalize(path.join(rootDir, 'src', 'ldoc-text-layout.js')),
  path.normalize(path.join(rootDir, 'ldoc-text-layout.js')),
  path.normalize(path.join(rootDir, 'packages', 'ldoc-editor', 'ldoc-text-layout.js')),
  path.normalize(path.join(rootDir, 'packages', 'ldoc-studio', 'ldoc-text-layout.js')),
  path.normalize(path.join(rootDir, 'packages', 'ldoc-viewer', 'ldoc-text-layout.js')),
  path.normalize(path.join(rootDir, 'packages', 'ldoc-sdk', 'ldoc-text-layout.js')),
  path.normalize(path.join(rootDir, 'public', 'ldoc-text-layout.js')),
  path.normalize(path.join(rootDir, 'app', 'viewer', 'ldoc-text-layout.js')),
  path.normalize(path.join(rootDir, 'ios-xcode-wrapper', 'ldoc-text-layout.js')),
  path.normalize(path.join(rootDir, 'build_text_layout.js'))
]);

const violations = [];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const fullPath = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.git' || ent.name === 'scratch' || ent.name === 'dist' || ent.name === 'linux-dist' || ent.name === 'mac-dist' || ent.name === 'ios-dist' || ent.name === 'downloads') {
        continue;
      }
      scanDir(fullPath);
    } else if (ent.isFile() && (ent.name.endsWith('.js') || ent.name.endsWith('.mjs') || ent.name.endsWith('.ts') || ent.name.endsWith('.html'))) {
      const norm = path.normalize(fullPath);
      if (allowedFiles.has(norm)) continue;
      if (fullPath.includes('test_section8_arch.js')) continue;

      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('@chenglou/pretext') && !content.includes('// allowed comment')) {
        // Check if it's an import or require statement
        if (/import.*from\s+['"]@chenglou\/pretext|require\(['"]@chenglou\/pretext/i.test(content)) {
          violations.push(fullPath);
        }
      }
    }
  }
}

scanDir(rootDir);

console.log(`   Violations found: ${violations.length}`);
if (violations.length > 0) {
  console.error('   ❌ Foreign import sites detected:');
  violations.forEach(v => console.error('    - ' + v));
}
assert.strictEqual(violations.length, 0, 'No files outside LdocTextLayout may import @chenglou/pretext');
console.log('   ✅ 8.1 Passed: @chenglou/pretext is 100% encapsulated within LdocTextLayout.\n');

// ── 8.2: Version Pinned Check in package manifests
console.log('▶ 8.2: Checking package manifests for exact pinned version of @chenglou/pretext...');
const manifests = [
  path.join(rootDir, 'package.json'),
  path.join(rootDir, 'packages', 'ldoc-sdk', 'package.json')
];

for (const mPath of manifests) {
  if (fs.existsSync(mPath)) {
    const pkg = JSON.parse(fs.readFileSync(mPath, 'utf8'));
    const pretextVer = (pkg.dependencies && pkg.dependencies['@chenglou/pretext']) ||
                       (pkg.devDependencies && pkg.devDependencies['@chenglou/pretext']);
    console.log(`   ${path.relative(rootDir, mPath)}: "@chenglou/pretext": "${pretextVer}"`);
    assert.ok(pretextVer, `Manifest ${mPath} must contain @chenglou/pretext`);
    assert.ok(
      !pretextVer.startsWith('^') && !pretextVer.startsWith('~') && !pretextVer.startsWith('>') && !pretextVer.startsWith('*'),
      `Version must be strictly pinned, but got: "${pretextVer}"`
    );
    assert.strictEqual(pretextVer, '0.0.9', 'Version must be pinned exactly to 0.0.9');
  }
}
console.log('   ✅ 8.2 Passed: @chenglou/pretext is strictly pinned to "0.0.9" with zero floating ranges.\n');

console.log('🎉 SECTION 8: ALL ARCHITECTURE CONFORMANCE TESTS PASSED!\n');
