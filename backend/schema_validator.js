// AST Schema Validation & Legacy Document Converter
// Validates against LDOCX Schema Version 2.5.0

const SCHEMA_VERSION = '2.5.0';

const VALID_BLOCK_TYPES = new Set([
  'heading', 'paragraph', 'quote', 'list', 'code', 'table',
  'image', 'web_image', 'audio', 'web_audio', 'video', 'web_video',
  '3d_model', 'ai', 'ai_live', 'form', 'feature_grid', 'live_feed',
  'preorder', 'button', 'jsx_canvas', 'particles', 'water_effect'
]);

/**
 * Validates an LDOCX AST document payload against Schema 2.5.0
 */
function validateLdocxSpec(doc) {
  const errors = [];
  const warnings = [];

  if (!doc || typeof doc !== 'object') {
    return { valid: false, errors: ['Document must be a valid JSON object.'], schema_version: SCHEMA_VERSION };
  }

  if (!doc.title || typeof doc.title !== 'string') {
    errors.push('Document title is required and must be a string.');
  }

  if (!Array.isArray(doc.pages) || doc.pages.length === 0) {
    errors.push('Document must contain a non-empty "pages" array.');
  } else {
    doc.pages.forEach((page, pIdx) => {
      if (!page.id) warnings.push(`Page at index ${pIdx} missing unique "id"; auto-generated.`);
      if (!Array.isArray(page.blocks)) {
        errors.push(`Page "${page.title || pIdx}" must contain a "blocks" array.`);
      } else {
        page.blocks.forEach((block, bIdx) => {
          if (!block.type) {
            errors.push(`Page ${pIdx}, block ${bIdx} missing required "type".`);
          } else if (!VALID_BLOCK_TYPES.has(block.type)) {
            warnings.push(`Block type "${block.type}" on page ${pIdx} is an experimental or non-standard node.`);
          }
        });
      }
    });
  }

  return {
    valid: errors.length === 0,
    schema_version: SCHEMA_VERSION,
    errors,
    warnings,
    pages_count: (doc.pages || []).length,
    validated_at: new Date().toISOString()
  };
}

/**
 * Converts legacy formats (Markdown, plain text, or docx-json) into Schema 2.5.0 AST
 */
function convertToLdocx(rawInput, format = 'markdown') {
  const pages = [];
  let currentBlocks = [];
  let pageTitle = 'Section 1: Overview';

  if (format === 'markdown' || typeof rawInput === 'string') {
    const lines = String(rawInput).split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // New Page break on ---
      if (line === '---' || line === '***') {
        pages.push({ id: 'page_' + (pages.length + 1), title: pageTitle, blocks: currentBlocks });
        currentBlocks = [];
        pageTitle = `Section ${pages.length + 1}`;
        continue;
      }

      // Heading 1 (#)
      if (line.startsWith('# ')) {
        pageTitle = line.slice(2).trim();
        currentBlocks.push({ id: 'b_' + Math.random().toString(36).slice(2, 8), type: 'heading', level: 1, text: pageTitle });
      } else if (line.startsWith('## ')) {
        currentBlocks.push({ id: 'b_' + Math.random().toString(36).slice(2, 8), type: 'heading', level: 2, text: line.slice(3).trim() });
      } else if (line.startsWith('### ')) {
        currentBlocks.push({ id: 'b_' + Math.random().toString(36).slice(2, 8), type: 'heading', level: 3, text: line.slice(4).trim() });
      } else if (line.startsWith('> ')) {
        currentBlocks.push({ id: 'b_' + Math.random().toString(36).slice(2, 8), type: 'quote', text: line.slice(2).trim() });
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        currentBlocks.push({ id: 'b_' + Math.random().toString(36).slice(2, 8), type: 'list', items: [line.slice(2).trim()] });
      } else if (line.startsWith('```')) {
        let codeLines = [];
        const lang = line.slice(3).trim() || 'text';
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        currentBlocks.push({ id: 'b_' + Math.random().toString(36).slice(2, 8), type: 'code', language: lang, code: codeLines.join('\n') });
      } else {
        currentBlocks.push({ id: 'b_' + Math.random().toString(36).slice(2, 8), type: 'paragraph', text: line });
      }
    }

    if (currentBlocks.length > 0 || pages.length === 0) {
      pages.push({ id: 'page_' + (pages.length + 1), title: pageTitle, blocks: currentBlocks });
    }
  }

  return {
    schema_version: SCHEMA_VERSION,
    title: pageTitle || 'Converted Living Document',
    author: 'LDOC Universal Converter',
    created_at: new Date().toISOString(),
    pages
  };
}

module.exports = {
  validateLdocxSpec,
  convertToLdocx,
  SCHEMA_VERSION
};
