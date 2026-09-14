/**
 * @ldoc/sdk v3.0.0 Conformance & Verification Test Suite
 * Validates:
 * 1. True Merkle Tree Computation
 * 2. Exact Tamper Localization (Sub-15ms pinpointing)
 * 3. AI-Native Provenance Tracking (Axis 9)
 * 4. Reactive DAG Dependency Engine (Axis 2)
 * 5. Longevity Archival Fallback HTML Generation (Axis 6)
 * 6. Capability-Based Sandboxing (Axis 4)
 * 7. End-to-end Serialization & Deserialization (.ldocx container)
 */
const assert = require('assert');
const sdk = require('./index.js');

async function runTests() {
  console.log('🧪 Starting @ldoc/sdk v3.0.0 Conformance Test Suite...\n');

  // ── TEST 1: Schema Version
  assert.strictEqual(sdk.SCHEMA_VERSION, '3.0.0', 'Schema version must be 3.0.0');
  console.log('✅ Test 1 Passed: Schema version is 3.0.0');

  // ── TEST 2: Deterministic Canonical JSON
  const objA = { b: 2, a: 1, c: { z: 26, y: 25 } };
  const objB = { a: 1, c: { y: 25, z: 26 }, b: 2 };
  assert.strictEqual(sdk.canonicalStringify(objA), sdk.canonicalStringify(objB), 'Canonical JSON must sort keys deterministically');
  console.log('✅ Test 2 Passed: Deterministic canonical stringification');

  // ── TEST 3: AST Construction with AI Provenance
  const sampleAst = {
    title: 'Executive Living Report 2026',
    schema_version: '3.0.0',
    metadata: { author: 'Kalidasan', created_at: '2026-09-14T10:00:00Z' },
    pages: [
      {
        id: 'page_1',
        title: 'Mission & Financial Telemetry',
        blocks: [
          {
            id: 'blk_heading_1',
            type: 'heading',
            level: 1,
            content: 'Strategic Acceleration',
            provenance: { author_type: 'human', agent_id: 'user', timestamp: '2026-09-14T10:00:00Z' }
          },
          {
            id: 'blk_paragraph_1',
            type: 'paragraph',
            content: 'The living document format provides reactive telemetry and Merkle verification.',
            provenance: { author_type: 'ai', agent_id: 'gemini-2.5-flash', confidence: 0.99, timestamp: '2026-09-14T10:01:00Z' }
          },
          {
            id: 'blk_var_revenue',
            name: 'revenue',
            type: 'reactive_variable',
            value: 1200000
          },
          {
            id: 'blk_var_expenses',
            name: 'expenses',
            type: 'reactive_variable',
            value: 450000
          },
          {
            id: 'blk_calc_profit',
            name: 'net_profit',
            type: 'calc',
            inputs: ['revenue', 'expenses'],
            formula: 'revenue - expenses'
          }
        ]
      }
    ]
  };

  const validation = sdk.validate(sampleAst);
  assert.strictEqual(validation.valid, true, 'Valid AST must pass validation');
  console.log('✅ Test 3 Passed: Strict AST validation');

  // ── TEST 4: True Merkle Tree Computation
  const merkle = sdk.computeDocumentMerkle(sampleAst);
  assert.ok(merkle.merkle_root, 'Merkle root must be generated');
  assert.strictEqual(typeof merkle.merkle_root, 'string');
  assert.strictEqual(merkle.merkle_root.length, 64, 'SHA-256 root must be 64 hex characters');
  assert.strictEqual(merkle.total_leaves, 6, 'Should have 5 block leaves + 1 page leaf');
  console.log(`✅ Test 4 Passed: True Merkle Tree root calculated: ${merkle.merkle_root.slice(0, 16)}...`);

  // ── TEST 5: Merkle Verification of Untampered Document
  const verifyClean = sdk.verifyDocumentIntegrity(sampleAst, merkle);
  assert.strictEqual(verifyClean.valid, true, 'Untampered document must verify as valid');
  assert.strictEqual(verifyClean.tampered_blocks.length, 0, 'Zero blocks should be flagged as tampered');
  assert.strictEqual(verifyClean.verified_blocks.length, 5, 'All 5 blocks must be verified');
  console.log('✅ Test 5 Passed: Clean document verified 100% authentic');

  // ── TEST 6: Sub-15ms Tamper Localization
  // Simulate attacker altering a revenue figure in block_1
  const tamperedAst = JSON.parse(JSON.stringify(sampleAst));
  tamperedAst.pages[0].blocks[1].content = 'The living document format was TAMPERED by malicious third party.';

  const tStart = process.hrtime.bigint();
  const verifyTamper = sdk.verifyDocumentIntegrity(tamperedAst, merkle);
  const tEnd = process.hrtime.bigint();
  const durationMs = Number(tEnd - tStart) / 1000000;

  assert.strictEqual(verifyTamper.valid, false, 'Tampered document must fail verification');
  assert.strictEqual(verifyTamper.tampered_blocks.length, 1, 'Exactly one block should be flagged as tampered');
  assert.strictEqual(verifyTamper.tampered_blocks[0], 'blk_paragraph_1', 'Must identify the exact tampered block id');
  assert.ok(durationMs < 15, `Tamper localization must execute in <15ms (actual: ${durationMs.toFixed(2)}ms)`);
  console.log(`✅ Test 6 Passed: Tamper localized specifically to 'blk_paragraph_1' in ${durationMs.toFixed(2)}ms!`);

  // ── TEST 7: AI-Native Provenance Query API
  const aiBlocks = sdk.queryBlocksByProvenance(sampleAst, { author_type: 'ai' });
  assert.strictEqual(aiBlocks.length, 1);
  assert.strictEqual(aiBlocks[0].block.id, 'blk_paragraph_1');
  assert.strictEqual(aiBlocks[0].block.provenance.agent_id, 'gemini-2.5-flash');

  const stats = sdk.getDocumentProvenanceStats(sampleAst);
  assert.strictEqual(stats.total_blocks, 5);
  assert.strictEqual(stats.ai_authored, 1);
  assert.strictEqual(stats.human_authored, 4);
  assert.deepStrictEqual(stats.active_agents, ['gemini-2.5-flash']);
  console.log('✅ Test 7 Passed: AI Provenance query and statistical synthesis');

  // ── TEST 8: Reactive DAG Compute Engine
  const reactiveEval = sdk.evaluateReactiveGraph(sampleAst);
  assert.strictEqual(reactiveEval.results.revenue, 1200000);
  assert.strictEqual(reactiveEval.results.expenses, 450000);
  assert.strictEqual(reactiveEval.results.net_profit, 750000, 'net_profit must evaluate to 1200000 - 450000');
  console.log('✅ Test 8 Passed: Reactive DAG dependency graph evaluated downstream formula accurately');

  // ── TEST 9: Standalone Archival HTML Fallback (Longevity)
  const fallbackHtml = sdk.renderFallbackHtml(sampleAst);
  assert.ok(fallbackHtml.includes('<!DOCTYPE html>'), 'Must produce valid HTML5 doctype');
  assert.ok(fallbackHtml.includes('Executive Living Report 2026'), 'Must contain document title');
  assert.ok(fallbackHtml.includes('Strategic Acceleration'), 'Must contain headings');
  assert.ok(!fallbackHtml.includes('<script src='), 'Must NOT depend on external third-party CDN scripts');
  console.log('✅ Test 9 Passed: Zero-dependency standalone archival fallback HTML generated');

  // ── TEST 10: Capability-Based Sandboxing Policy
  const sandboxPolicy = sdk.getSandboxPolicy(sampleAst.pages[0].blocks[4]);
  assert.strictEqual(sandboxPolicy.sandbox_attributes, 'allow-scripts');
  assert.ok(sandboxPolicy.content_security_policy.includes("default-src 'none'"));
  assert.strictEqual(sandboxPolicy.isolated, true);
  console.log('✅ Test 10 Passed: Capability-based sandbox policy verified');

  // ── TEST 11: Serialization to .ldocx and Deserialization
  const buffer = await sdk.serialize(sampleAst);
  assert.ok(Buffer.isBuffer(buffer), 'Serialized output must be a Buffer in Node');
  assert.ok(buffer.length > 500, 'Archive must have valid compressed size');

  const parsedDoc = await sdk.parse(buffer);
  assert.strictEqual(parsedDoc.title, sampleAst.title);
  assert.strictEqual(parsedDoc.pages.length, 1);
  assert.ok(parsedDoc.integrityStatus, 'Parsed document must include integrity status from container');
  assert.strictEqual(parsedDoc.integrityStatus.valid, true, 'Container Merkle tree must verify as authentic');
  console.log('✅ Test 11 Passed: Full round-trip .ldocx container packing and unpacking with embedded Merkle tree');

  console.log('\n🎉 ALL 11 CONFORMANCE TESTS PASSED (100% SUCCESS)!\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
