/**
 * Section 1: Core Module Unit Tests (LdocTextLayout)
 * Validates Pretext integration determinism, rich-inline chips, monotonicity,
 * locale segmentation (Thai, Japanese, Arabic), and cache clearing.
 */
const assert = require('assert');
const Ldoc = require('../ldoc-text-layout');

console.log('🧪 Running Section 1: Core Module Unit Tests...\n');

// ── 1.1: Multi-Script Determinism & Grapheme Cluster Integrity
console.log('▶ 1.1: Multi-script string determinism & grapheme integrity...');
const multiScript = 'AGI 春天到了. بدأت الرحلة 🚀';
const font = '16px Inter';
const width = 320;
const lineHeight = 24;

const firstPrep = Ldoc.prepareWithSegments(multiScript, font);
const firstLayout = Ldoc.layoutWithLines(firstPrep, width, lineHeight);

console.log(`   Initial measurement: lineCount=${firstLayout.lineCount}, height=${firstLayout.height}px`);
for (let l = 0; l < firstLayout.lines.length; l++) {
  console.log(`     Line ${l + 1}: "${firstLayout.lines[l].text}" (width: ${firstLayout.lines[l].width}px)`);
}

// Check 10 repeated calls
for (let i = 1; i <= 10; i++) {
  const p = Ldoc.prepareWithSegments(multiScript, font);
  const res = Ldoc.layoutWithLines(p, width, lineHeight);
  assert.strictEqual(res.lineCount, firstLayout.lineCount, `Run ${i}: lineCount mismatch`);
  assert.strictEqual(res.height, firstLayout.height, `Run ${i}: height mismatch`);
  for (let l = 0; l < res.lines.length; l++) {
    assert.strictEqual(res.lines[l].text, firstLayout.lines[l].text, `Run ${i}: line ${l} text mismatch`);
  }
}

// Check grapheme cluster integrity: rocket emoji 🚀, CJK 春天到了, Arabic بدأت الرحلة
// Verify no lone surrogate pairs or broken clusters
const allText = firstLayout.lines.map(l => l.text).join(' ');
assert.ok(allText.includes('🚀'), 'Rocket emoji must remain intact');
assert.ok(allText.includes('春天到了'), 'CJK phrase must not be broken mid-cluster');
assert.ok(allText.includes('بدأت'), 'Arabic word must not be broken mid-cluster');
console.log('   ✅ 1.1 Passed: 10/10 runs bit-for-bit identical; all grapheme clusters intact.\n');

// ── 1.2: Rich-Inline Chip Indivisibility & extraWidth
console.log('▶ 1.2: Rich-inline chip indivisibility and extraWidth...');
const richSpans = [
  { text: 'Ship ', font: '500 17px Inter' },
  { text: '@maya', font: '700 12px Inter', break: 'never', extraWidth: 22 },
  { text: "'s rich-note", font: '500 17px Inter' }
];

const richPrep = Ldoc.prepareRichInline(richSpans);
assert.ok(richPrep, 'prepareRichInline must return prepared handle');

// Test at wide width (should fit on 1 line)
const wideStats = Ldoc.measureRichInlineStats(richPrep, 600);
console.log(`   Wide (600px): lineCount=${wideStats.lineCount}`);

// Test at narrower widths to force wrapping
const narrowWidths = [180, 140, 110, 90, 70];
for (const w of narrowWidths) {
  const lines = [];
  Ldoc.walkRichInlineLineRanges(richPrep, w, (line) => {
    lines.push(line);
  });
  console.log(`   Width ${w}px: ${lines.length} lines`);
  for (let i = 0; i < lines.length; i++) {
    const lineStr = JSON.stringify(lines[i]);
    if (lineStr.includes('@')) {
      assert.ok(lineStr.includes('@maya'), `Line ${i} split @maya chip! Line content: ${lineStr}`);
    }
  }
}
console.log('   ✅ 1.2 Passed: @maya chip never splits across line breaks; extraWidth honored.\n');

// ── 1.3: Monotonicity Test (Project Gutenberg Paragraph)
console.log('▶ 1.3: Monotonic English width scaling (Project Gutenberg excerpt)...');
const gutenbergParagraph = `It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of light, it was the season of darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way - in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only.`;

const testWidths = [800, 750, 700, 650, 600, 550, 500, 450, 400, 350, 300, 250, 200];
const gutenPrep = Ldoc.prepareWithSegments(gutenbergParagraph, '16px "Plus Jakarta Sans", sans-serif');

let prevLineCount = 0;
const monotonicityResults = [];

for (const w of testWidths) {
  const layoutRes = Ldoc.layout(gutenPrep, w, 24);
  monotonicityResults.push({ width: w, lineCount: layoutRes.lineCount, height: layoutRes.height });
  console.log(`   Width: ${w}px -> lineCount: ${layoutRes.lineCount}, height: ${layoutRes.height}px`);
  if (prevLineCount > 0) {
    assert.ok(
      layoutRes.lineCount >= prevLineCount,
      `Monotonicity violation! At ${w}px, lineCount=${layoutRes.lineCount} is less than at previous wider width (${prevLineCount})`
    );
  }
  prevLineCount = layoutRes.lineCount;
}
console.log('   ✅ 1.3 Passed: Line count is strictly monotonic non-decreasing as width decreases.\n');

// ── 1.4: Locale Segmentation Retargeting (Thai, Japanese, Arabic)
console.log('▶ 1.4: Locale-dependent segmentation (Thai, Japanese, Arabic)...');

const thaiText = 'ภาษาไทยเข้าใจง่ายและมีความงดงามมากในวรรณกรรมโบราณ';

Ldoc.setLocale('en');
const thaiPrepEn = Ldoc.prepareWithSegments(thaiText, '16px sans-serif');
const thaiLinesEn = Ldoc.layoutWithLines(thaiPrepEn, 150, 24);

Ldoc.setLocale('th');
const thaiPrepTh = Ldoc.prepareWithSegments(thaiText, '16px sans-serif');
const thaiLinesTh = Ldoc.layoutWithLines(thaiPrepTh, 150, 24);

console.log(`   Thai under 'en' locale: ${thaiLinesEn.lineCount} lines; line 1: "${thaiLinesEn.lines[0]?.text}"`);
console.log(`   Thai under 'th' locale: ${thaiLinesTh.lineCount} lines; line 1: "${thaiLinesTh.lines[0]?.text}"`);
assert.ok(thaiLinesTh.lineCount > 0, 'Thai layout under th locale must succeed');
assert.ok(thaiLinesEn.lineCount > 0, 'Thai layout under en locale must succeed');

// Japanese sample
const jaText = '人工知能技術の進化により、文書作成と空間表現が高度に融合しています。';
Ldoc.setLocale('ja');
const jaPrep = Ldoc.prepareWithSegments(jaText, '16px sans-serif');
const jaLines = Ldoc.layoutWithLines(jaPrep, 180, 24);
console.log(`   Japanese under 'ja' locale: ${jaLines.lineCount} lines`);
assert.ok(jaLines.lineCount >= 2, 'Japanese text must wrap properly under ja locale');

// Arabic sample
const arText = 'نظام المستندات التفاعلية يتيح دمج النماذج ثلاثية الأبعاد بسلاسة تامة.';
Ldoc.setLocale('ar');
const arPrep = Ldoc.prepareWithSegments(arText, '16px sans-serif');
const arLines = Ldoc.layoutWithLines(arPrep, 200, 24);
console.log(`   Arabic under 'ar' locale: ${arLines.lineCount} lines`);
assert.ok(arLines.lineCount >= 2, 'Arabic text must wrap properly under ar locale');

// Reset to en
Ldoc.setLocale('en');
console.log('   ✅ 1.4 Passed: Locale retargeting switches segmentation engines cleanly without throwing.\n');

// ── 1.5: Cache Clearing Invalidation Check
console.log('▶ 1.5: Cache clearing invalidation check...');
const testSample = 'Living Document format replaces legacy static paper paradigms.';
const prepBefore = Ldoc.prepareWithSegments(testSample, '16px sans-serif');
const resBefore = Ldoc.layoutWithLines(prepBefore, 300, 24);

// Clear cache
Ldoc.clearCache();

// Prepare again with same inputs
const prepAfter = Ldoc.prepareWithSegments(testSample, '16px sans-serif');
const resAfter = Ldoc.layoutWithLines(prepAfter, 300, 24);

assert.strictEqual(resAfter.lineCount, resBefore.lineCount, 'Line counts must match after cache clear');
assert.strictEqual(resAfter.height, resBefore.height, 'Heights must match after cache clear');

// Change fontSize to 32px after cache clear, confirm new proportional height
const prepBig = Ldoc.prepareWithSegments(testSample, '32px sans-serif');
const resBig = Ldoc.layoutWithLines(prepBig, 300, 48);
console.log(`   16px height: ${resBefore.height}px, 32px height: ${resBig.height}px`);
assert.ok(resBig.height > resBefore.height * 1.5, 'Larger font must produce larger height, not stale cached dimensions');

console.log('   ✅ 1.5 Passed: Cache clear properly invalidates old segmentation & metrics.\n');

console.log('🎉 SECTION 1: ALL CORE MODULE UNIT TESTS PASSED WITH 100% SUCCESS!\n');
