/**
 * @ldoc/sdk v3.0.0 Conformance & Compatibility Test Suite
 * Validates:
 * 1. True Merkle Tree Computation
 * 2. Exact Tamper Localization (Sub-15ms pinpointing)
 * 3. AI-Native Provenance Tracking (Axis 9)
 * 4. Reactive DAG Dependency Engine (Axis 2)
 * 5. Longevity Archival Fallback HTML Generation (Axis 6)
 * 6. Capability-Based Sandboxing (Axis 4)
 * 7. End-to-end Serialization & Deserialization (.ldocx container)
 * 8. Zero-Breakage Backward & Forward Compatibility with Older Viewers/Editors
 */
const assert = require('assert');
const sdk = require('./index.js');
let JSZip = null;
try { JSZip = require('jszip'); } catch (e) { JSZip = require('./jszip.min.js'); }

async function runTests() {
  console.log('🧪 Starting @ldoc/sdk v3.0.0 Conformance & Compatibility Test Suite...\n');

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

  // ── TEST 4: RFC 6962 Strict Section 2.1 Merkle Tree Conformance
  // 4a. Empty list: MTH({}) = SHA-256("")
  const emptyRoot = sdk.computeMth([]);
  assert.strictEqual(
    emptyRoot.toString('hex'),
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'MTH of empty tree must equal SHA-256 of empty string per RFC 6962 Sec 2.1'
  );

  // 4b. Odd-number-of-leaves power-of-2 split (ZERO leaf duplication, fixes CVE-2012-2459)
  const leafA = sdk.computeLeafHash(Buffer.from('leaf_A'));
  const leafB = sdk.computeLeafHash(Buffer.from('leaf_B'));
  const leafC = sdk.computeLeafHash(Buffer.from('leaf_C'));
  // For n=3, k=2: left = SHA-256(0x01 || leafA || leafB), right = leafC
  const manualLeft = sdk.computeNodeHash(leafA, leafB);
  const manualRoot3 = sdk.computeNodeHash(manualLeft, leafC);
  const computedRoot3 = sdk.computeMth([leafA, leafB, leafC]);
  assert.strictEqual(
    computedRoot3.toString('hex'),
    manualRoot3.toString('hex'),
    'Odd leaves must use unbalanced power-of-2 split without duplicating last leaf'
  );

  // 4c. Document Merkle Tree
  const merkle = sdk.computeDocumentMerkle(sampleAst);
  assert.ok(merkle.merkle_root, 'Merkle root must be generated');
  assert.strictEqual(typeof merkle.merkle_root, 'string');
  assert.strictEqual(merkle.merkle_root.length, 64, 'SHA-256 root must be 64 hex characters');
  assert.strictEqual(merkle.total_leaves, 5, 'Should have exactly 5 block leaves');
  console.log(`✅ Test 4 Passed: RFC 6962 Merkle Root calculated: ${merkle.merkle_root.slice(0, 16)}...`);

  // ── TEST 4d: RFC 6962 Section 2.1.1 Merkle Audit Paths (O(log N) Inclusion Proofs)
  const targetBlock = sampleAst.pages[0].blocks[1];
  const targetLeafHash = merkle.block_leaves[targetBlock.id];
  const auditPath = merkle.audit_paths[targetBlock.id];
  assert.ok(Array.isArray(auditPath), 'Audit path must be an array of traversal steps');
  assert.ok(auditPath.length > 0, 'Audit path must have logarithmic depth steps');
  const isProofValid = sdk.verifyAuditPath(targetLeafHash, auditPath, merkle.merkle_root);
  assert.strictEqual(isProofValid, true, 'RFC 6962 audit path must cryptographically verify target block against root');

  const tamperedProof = sdk.verifyAuditPath('0000000000000000000000000000000000000000000000000000000000000000', auditPath, merkle.merkle_root);
  assert.strictEqual(tamperedProof, false, 'Tampered leaf must fail audit path verification');
  console.log('✅ Test 4d Passed: RFC 6962 O(log N) Merkle audit path inclusion proof validated');

  // ── TEST 5: Merkle Verification of Untampered Document
  const verifyClean = sdk.verifyDocumentIntegrity(sampleAst, merkle);
  assert.strictEqual(verifyClean.valid, true, 'Untampered document must verify as valid');
  assert.strictEqual(verifyClean.tampered_blocks.length, 0, 'Zero blocks should be flagged as tampered');
  assert.strictEqual(verifyClean.verified_blocks.length, 5, 'All 5 blocks must be verified');
  console.log('✅ Test 5 Passed: Clean document verified 100% authentic');

  // ── TEST 6: Sub-15ms Tamper Localization
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
  assert.strictEqual(reactiveEval.results.net_profit, 750000);
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

  // ── TEST 11: Full Round-Trip Serialization & Unpacking
  const buffer = await sdk.serialize(sampleAst);
  assert.ok(Buffer.isBuffer(buffer));
  const parsedDoc = await sdk.parse(buffer);
  assert.strictEqual(parsedDoc.title, sampleAst.title);
  assert.strictEqual(parsedDoc.pages.length, 1);
  assert.strictEqual(parsedDoc.integrityStatus.valid, true);
  console.log('✅ Test 11 Passed: Full round-trip .ldocx packing and unpacking with embedded Merkle tree');

  // ── TEST 12: BACKWARD COMPATIBILITY VERIFICATION (Zero-Breakage Guarantee)
  // Simulate an older v2.5 viewer that only looks for spec.json and block.text:
  const zip = await JSZip.loadAsync(buffer);
  assert.ok(zip.file('spec.json'), 'v3.0 container MUST bundle spec.json for older v2.0/v2.5 viewers');
  assert.ok(zip.file('pages/page_001.json'), 'v3.0 container MUST bundle pages/*.json for older desktop apps');
  assert.ok(zip.file('document.json'), 'v3.0 container MUST bundle document.json for modern v3.0 standard');
  assert.ok(zip.file('fallback.html'), 'v3.0 container MUST bundle fallback.html for universal archival view');

  const legacySpecStr = await zip.file('spec.json').async('text');
  const legacySpec = JSON.parse(legacySpecStr);
  assert.strictEqual(legacySpec.title, sampleAst.title);
  assert.strictEqual(legacySpec.pages[0].blocks[0].text, 'Strategic Acceleration', 'Both text and content must be populated for legacy viewers');

  const legacyPage1Str = await zip.file('pages/page_001.json').async('text');
  const legacyPage1 = JSON.parse(legacyPage1Str);
  assert.ok(legacyPage1.content.root.children.length >= 5, 'v1.0 content.root.children must be populated');
  assert.strictEqual(legacyPage1.blocks[0].text, 'Strategic Acceleration');

  // Simulate parsing an ancient v1/v2 file that ONLY has spec.json and no document.json:
  const ancientZip = new JSZip();
  ancientZip.file('manifest.json', JSON.stringify({ title: 'Ancient Document v1' }));
  ancientZip.file('spec.json', JSON.stringify({
    title: 'Ancient Document v1',
    pages: [{ id: 'p_ancient', title: 'Ancient Page', blocks: [{ id: 'b_old', type: 'heading', text: 'Old Header' }] }]
  }));
  const ancientBuffer = await ancientZip.generateAsync({ type: 'nodebuffer' });
  const parsedAncient = await sdk.parse(ancientBuffer);
  assert.strictEqual(parsedAncient.title, 'Ancient Document v1');
  assert.strictEqual(parsedAncient.pages[0].blocks[0].content, 'Old Header', 'v3.0 parser must transparently normalize old block.text into block.content');
  assert.strictEqual(parsedAncient.pages[0].blocks[0].text, 'Old Header');
  console.log('✅ Test 12 Passed: 100% Backward & Forward Compatibility verified across v1, v2, v2.5, and v3.0!');

  // ── TEST 13: PRETEXT HEADLESS BLOCK MEASUREMENT (Axis 1 & 2)
  assert.ok(sdk.LdocTextLayout, 'sdk.LdocTextLayout must be exported');
  assert.strictEqual(typeof sdk.measureBlock, 'function', 'sdk.measureBlock must be a function');

  const headingBlock = { id: 'h1', type: 'heading', level: 1, text: 'Living Document Architecture' };
  const headingLayout = sdk.measureBlock(headingBlock, 500);
  assert.ok(headingLayout.width > 0, 'Heading width must be positive');
  assert.ok(headingLayout.height > 0, 'Heading height must be positive');
  assert.strictEqual(headingLayout.lineCount, 1, 'Short heading should be 1 line');

  const paraBlock = {
    id: 'p1',
    type: 'paragraph',
    text: 'Pretext replaces DOM-based text measurement with canvas-based arithmetic. This enables instant layout without triggering browser reflow loops.'
  };
  const paraLayout = sdk.measureBlock(paraBlock, 300);
  assert.ok(paraLayout.lineCount >= 2, 'Paragraph must break into multiple lines at 300px');
  assert.ok(paraLayout.lines.length >= 2, 'Lines array must contain measured lines');

  const btnBlock = { id: 'btn1', type: 'button', label: 'Launch Simulation' };
  const btnLayout = sdk.measureBlock(btnBlock, 400);
  assert.ok(btnLayout.width > 50, 'Button width must include label and padding');
  assert.strictEqual(btnLayout.height, 38, 'Button standard height should be 38px');

  const codeBlock = { id: 'c1', type: 'code', code: 'const a = 1;\nconst b = 2;\nreturn a + b;' };
  const codeLayout = sdk.measureBlock(codeBlock, 400);
  assert.strictEqual(codeLayout.lineCount, 3, 'Code block must have 3 lines');
  console.log('✅ Test 13 Passed: Pretext headless block measurement across headings, paragraphs, buttons, and code');

  // ── TEST 14: 3D OBSTACLE DYNAMIC TEXT FLOW (flowAroundExclusion)
  assert.strictEqual(typeof sdk.flowAroundExclusion, 'function', 'sdk.flowAroundExclusion must be a function');
  const flowText = 'The Living Document format integrates 3D spatial models directly inside executable presentation slides. Text flows around the spatial card in real time without layout thrashing or browser reflow bottlenecks.';
  const obstacle3D = { x: 300, y: 0, width: 250, height: 75 }; // 3D tilt card at top right
  const flowRes = sdk.flowAroundExclusion(flowText, '16px sans-serif', 600, obstacle3D, 24);
  assert.ok(flowRes.lineCount >= 4, 'Flow result must contain at least 4 lines');
  assert.ok(flowRes.lines[0].availableWidth < 600, 'Top lines beside 3D card must have narrowed available width');
  assert.ok(flowRes.lines[flowRes.lines.length - 1].availableWidth === 600, 'Lines below 3D card must have full 600px width');
  console.log('✅ Test 14 Passed: Dynamic 3D obstacle text flow with real-time slot carving');

  // ── TEST 15: I18N LOCALE RETARGETING (CJK & International Scripts)
  sdk.LdocTextLayout.setLocale('ja');
  const cjkText = '量子コンピューティングは文書技術の未来を再定義します。';
  const cjkLayout = sdk.measureBlock({ type: 'paragraph', text: cjkText }, 200);
  assert.ok(cjkLayout.lineCount >= 2, 'Japanese CJK text must wrap across multiple lines at 200px width');

  sdk.LdocTextLayout.setLocale('ar');
  const arabicText = 'مستند حي يجمع بين النماذج ثلاثية الأبعاد والأمان المشفر.';
  const arabicLayout = sdk.measureBlock({ type: 'paragraph', text: arabicText }, 250);
  assert.ok(arabicLayout.lineCount >= 2, 'Arabic text must wrap across multiple lines at 250px width');

  sdk.LdocTextLayout.setLocale('en'); // Reset to English
  console.log('✅ Test 15 Passed: i18n locale retargeting for CJK and Arabic scripts');

  // ── TEST 16: SAFARI/WEBKIT NARROW WIDTH SOFT-HYPHEN EDGE CASE
  // When available width is narrower than a word or syllable with soft-hyphen, ensure no infinite loop
  const narrowRes = sdk.flowAroundExclusion('Super\u00ADcali\u00ADfragilistic', '16px sans-serif', 40, [], 20, { minSlotWidth: 20 });
  assert.ok(narrowRes.lineCount >= 1, 'Must produce lines without hanging in infinite loop');
  console.log('✅ Test 16 Passed: Safari/WebKit narrow width soft-hyphen edge case handled gracefully');

  console.log('\n🎉 ALL 16 CONFORMANCE & COMPATIBILITY TESTS PASSED (100% SUCCESS)!\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

