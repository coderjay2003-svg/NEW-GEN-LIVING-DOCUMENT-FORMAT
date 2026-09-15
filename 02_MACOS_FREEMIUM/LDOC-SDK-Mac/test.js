// @ldoc/sdk — Automated Test Suite
const assert = require('assert');
const { parse, serialize, validate, calculateChecksum, SCHEMA_VERSION } = require('./index.js');

(async () => {
  console.log('--- Testing @ldoc/sdk v' + SCHEMA_VERSION + ' ---');

  // Test 1: Validation
  const validAst = {
    title: 'Quantum Physics Masterclass',
    pages: [
      {
        id: 'page_1',
        title: '3D Atomic Unit Cell',
        blocks: [
          { id: 'b1', type: 'heading', level: 1, text: 'Quantum Lattice' },
          { id: 'b2', type: '3d_model', mesh_template: 'atomic_lattice' }
        ]
      }
    ]
  };

  const valRes = validate(validAst);
  assert.strictEqual(valRes.valid, true, 'Valid AST passes schema validation');
  console.log('✓ Validation test passed');

  // Test 2: Checksum
  const sum1 = calculateChecksum('manifest.json');
  assert.strictEqual(typeof sum1, 'string', 'Checksum produces string');
  assert.strictEqual(sum1.length, 64, 'SHA-256 is 64 hex characters');
  console.log('✓ Checksum test passed');

  // Test 3: Serialization & Parsing roundtrip
  const ldocxBuf = await serialize(validAst);
  assert.ok(ldocxBuf && ldocxBuf.length > 0, 'Serialized buffer created');
  console.log('✓ Serialization passed, byte size:', ldocxBuf.length);

  const parsedAst = await parse(ldocxBuf);
  assert.strictEqual(parsedAst.title, validAst.title, 'Parsed title matches original');
  assert.strictEqual(parsedAst.pages.length, 1, 'Parsed page count matches');
  assert.strictEqual(parsedAst.pages[0].blocks[1].mesh_template, 'atomic_lattice', 'Parsed block properties intact');
  console.log('✓ Parsing roundtrip passed');

  console.log('All @ldoc/sdk tests PASSED successfully!');
})();
