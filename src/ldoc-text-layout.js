/**
 * LdocTextLayout — Universal Canvas-Based Text Measurement & Layout Primitive
 * Encapsulates @chenglou/pretext (MIT, ~15KB, zero-dependencies)
 * Copyright (c) 2026 J-AI-ENTERPRISES. All Rights Reserved.
 * Licensed under Apache-2.0.
 */

// ── 1. HEADLESS CANVAS FALLBACK (NODE.JS / CI / CLI) ───────────────────────
if (typeof OffscreenCanvas === 'undefined' && typeof document === 'undefined') {
  globalThis.OffscreenCanvas = class OffscreenCanvas {
    constructor(w, h) { this.width = w; this.height = h; }
    getContext(type) {
      if (type !== '2d') return null;
      let fontStr = '16px sans-serif';
      return {
        get font() { return fontStr; },
        set font(f) { fontStr = f || '16px sans-serif'; },
        measureText(text) {
          const m = fontStr.match(/(\d+(?:\.\d+)?)\s*px/);
          const fontSize = m ? parseFloat(m[1]) : 16;
          const isBold = /bold|700|800|900/i.test(fontStr);
          const isMono = /mono|consolas|courier/i.test(fontStr);
          let width = 0;
          const str = String(text != null ? text : '');
          for (let i = 0; i < str.length; i++) {
            const ch = str.charCodeAt(i);
            if (isMono) {
              width += fontSize * 0.6;
            } else if (ch >= 0x4e00 && ch <= 0x9fff) {
              width += fontSize; // Full-width CJK ideographs
            } else if (ch === 32) {
              width += fontSize * 0.28; // Space
            } else if ('lij|!.,:;\'"()[]{}I'.includes(str[i])) {
              width += fontSize * 0.3; // Narrow punctuation / letters
            } else if ('mwMW@#%'.includes(str[i])) {
              width += fontSize * (isBold ? 0.9 : 0.85); // Wide glyphs
            } else {
              width += fontSize * (isBold ? 0.6 : 0.55); // Standard latin
            }
          }
          return {
            width,
            actualBoundingBoxAscent: fontSize * 0.8,
            actualBoundingBoxDescent: fontSize * 0.2
          };
        }
      };
    }
  };
}

// ── 2. IMPORT PRETEXT MODULES ──────────────────────────────────────────────
import {
  prepare,
  prepareWithSegments,
  layout,
  layoutNextLine,
  layoutNextLineRange,
  materializeLineRange,
  layoutWithLines,
  measureNaturalWidth,
  measureLineStats,
  walkLineRanges,
  clearCache,
  setLocale
} from '@chenglou/pretext';

import {
  prepareRichInline,
  measureRichInlineStats,
  walkRichInlineLineRanges
} from '@chenglou/pretext/rich-inline';

// ── 3. GEOMETRIC INTERVAL HELPERS FOR 3D EXCLUSIONS ─────────────────────────
function carveTextLineSlots(base, blocked, minWidth = 24) {
  let slots = [base];
  for (let i = 0; i < blocked.length; i++) {
    const b = blocked[i];
    const next = [];
    for (let j = 0; j < slots.length; j++) {
      const s = slots[j];
      if (b.right <= s.left || b.left >= s.right) {
        next.push(s);
        continue;
      }
      if (b.left > s.left) next.push({ left: s.left, right: b.left });
      if (b.right < s.right) next.push({ left: b.right, right: s.right });
    }
    slots = next;
  }
  return slots.filter(s => (s.right - s.left) >= minWidth);
}

// ── 4. LDOC TEXT LAYOUT ENGINE ──────────────────────────────────────────────
export const LdocTextLayout = {
  version: '3.0.0',

  // ── Core Pretext Primitives ──
  prepare: function (text, font, options) {
    return prepare(String(text != null ? text : ''), font, options);
  },

  prepareWithSegments: function (text, font, options) {
    return prepareWithSegments(String(text != null ? text : ''), font, options);
  },

  layout: function (prepared, maxWidth, lineHeight) {
    return layout(prepared, Math.max(1, maxWidth), lineHeight);
  },

  layoutWithLines: function (prepared, maxWidth, lineHeight) {
    return layoutWithLines(prepared, Math.max(1, maxWidth), lineHeight);
  },

  layoutNextLine: function (prepared, cursor, maxWidth) {
    return layoutNextLine(prepared, cursor, Math.max(1, maxWidth));
  },

  layoutNextLineRange: function (prepared, cursor, maxWidth) {
    return layoutNextLineRange(prepared, cursor, Math.max(1, maxWidth));
  },

  materializeLineRange: function (prepared, lineRange) {
    return materializeLineRange(prepared, lineRange);
  },

  measureNaturalWidth: function (prepared) {
    return measureNaturalWidth(prepared);
  },

  measureLineStats: function (prepared, maxWidth) {
    return measureLineStats(prepared, Math.max(1, maxWidth));
  },

  walkLineRanges: function (prepared, maxWidth, onLine) {
    return walkLineRanges(prepared, Math.max(1, maxWidth), onLine);
  },

  clearCache: function () {
    clearCache();
  },

  setLocale: function (locale) {
    setLocale(locale || 'en');
  },

  // ── Rich Inline Text Layout ──
  prepareRichInline: function (spans) {
    return prepareRichInline(spans);
  },

  measureRichInlineStats: function (preparedRich, maxWidth) {
    return measureRichInlineStats(preparedRich, Math.max(1, maxWidth));
  },

  walkRichInlineLineRanges: function (preparedRich, maxWidth, onLine) {
    return walkRichInlineLineRanges(preparedRich, Math.max(1, maxWidth), onLine);
  },

  // ── High-Level Block Measurement (SDK / CLI / Runtime) ──
  /**
   * Measure any LDOC block AST node before mounting to DOM.
   * Returns exact bounding width, height, lineCount, and pre-calculated lines.
   */
  measureBlock: function (block, availableWidth = 800, options = {}) {
    if (!block) return { width: 0, height: 0, lineCount: 0, lines: [] };
    const bType = (block.type || 'paragraph').toLowerCase();
    const width = Math.max(20, availableWidth);

    // Font selection based on theme and block type
    let font = options.font;
    let lineHeight = options.lineHeight;

    if (bType === 'heading') {
      const lvl = block.level || 1;
      const fontSize = lvl === 1 ? 26 : (lvl === 2 ? 20 : 16);
      font = font || `bold ${fontSize}px "Cinzel", "Plus Jakarta Sans", sans-serif`;
      lineHeight = lineHeight || Math.round(fontSize * 1.35);
      const text = block.text || block.content || 'Heading';
      const prep = prepareWithSegments(text, font, options);
      const res = layoutWithLines(prep, width, lineHeight);
      const natW = measureNaturalWidth(prep);
      return {
        width: Math.min(width, Math.ceil(natW)),
        height: res.height + (lvl === 1 ? 16 : 10), // Include margin
        lineCount: res.lineCount,
        lines: res.lines,
        naturalWidth: Math.ceil(natW),
        lineHeight
      };
    }

    if (bType === 'paragraph' || bType === 'text') {
      const fontSize = options.fontSize || 15;
      font = font || `${fontSize}px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Segoe UI", sans-serif`;
      lineHeight = lineHeight || 24;
      const text = block.text || block.content || '';
      if (!text.trim()) {
        return { width: 0, height: 0, lineCount: 0, lines: [], naturalWidth: 0, lineHeight };
      }
      const prep = prepareWithSegments(text, font, options);
      const res = layoutWithLines(prep, width, lineHeight);
      const natW = measureNaturalWidth(prep);
      return {
        width: Math.min(width, Math.ceil(natW)),
        height: res.height + 14, // Margin
        lineCount: res.lineCount,
        lines: res.lines,
        naturalWidth: Math.ceil(natW),
        lineHeight
      };
    }

    if (bType === 'quote' || bType === 'callout') {
      const fontSize = options.fontSize || 15;
      font = font || `italic ${fontSize}px Georgia, "Palatino Linotype", serif`;
      lineHeight = lineHeight || 26;
      const text = block.text || block.content || '';
      const prep = prepareWithSegments(text, font, options);
      const effectiveWidth = Math.max(20, width - 40); // 40px left-border and padding
      const res = layoutWithLines(prep, effectiveWidth, lineHeight);
      const natW = measureNaturalWidth(prep);
      return {
        width: Math.min(width, Math.ceil(natW) + 40),
        height: res.height + 24,
        lineCount: res.lineCount,
        lines: res.lines,
        naturalWidth: Math.ceil(natW) + 40,
        lineHeight
      };
    }

    if (bType === 'code') {
      const fontSize = 13;
      font = font || `${fontSize}px "JetBrains Mono", Consolas, monospace`;
      lineHeight = lineHeight || 20;
      const codeText = block.code || block.value || block.text || '';
      const lines = codeText.split('\n');
      let maxW = 0;
      const measuredLines = lines.map(line => {
        const p = prepareWithSegments(line || ' ', font, options);
        const w = measureNaturalWidth(p);
        if (w > maxW) maxW = w;
        return { text: line, width: Math.ceil(w) };
      });
      return {
        width: Math.min(width, Math.max(200, Math.ceil(maxW) + 32)),
        height: (lines.length * lineHeight) + 28, // Padding
        lineCount: lines.length,
        lines: measuredLines,
        naturalWidth: Math.ceil(maxW) + 32,
        lineHeight
      };
    }

    if (bType === 'button') {
      const label = block.text || block.label || 'Action Button';
      font = font || `600 13px "Plus Jakarta Sans", sans-serif`;
      const p = prepareWithSegments(label, font, options);
      const labelW = measureNaturalWidth(p);
      return {
        width: Math.ceil(labelW + 36), // Padding + icon
        height: 38,
        lineCount: 1,
        lines: [{ text: label, width: Math.ceil(labelW) }],
        naturalWidth: Math.ceil(labelW + 36),
        lineHeight: 38
      };
    }

    if (bType === 'table') {
      const headers = block.headers || [];
      const rows = block.rows || [];
      const colCount = Math.max(headers.length, rows[0] ? rows[0].length : 1);
      const rowHeight = 36;
      const totalRows = (headers.length ? 1 : 0) + rows.length;
      return {
        width: width,
        height: totalRows * rowHeight + 16,
        lineCount: totalRows,
        lines: [],
        columns: colCount,
        lineHeight: rowHeight
      };
    }

    if (bType === '3d_model' || bType === 'model3d') {
      return {
        width: width,
        height: 220,
        lineCount: 1,
        lines: [],
        naturalWidth: width,
        lineHeight: 220
      };
    }

    if (bType === 'floating_text') {
      const fontSize = parseInt(block.fontSize || block.size || 16, 10) || 16;
      font = font || `${fontSize}px ${block.fontFamily || block.font || '"Plus Jakarta Sans", sans-serif'}`;
      lineHeight = lineHeight || Math.round(fontSize * 1.4);
      const text = block.text || 'Double click to edit...';
      const prep = prepareWithSegments(text, font, options);
      const res = layoutWithLines(prep, width, lineHeight);
      const natW = measureNaturalWidth(prep);
      return {
        width: Math.max(60, Math.ceil(natW) + 20),
        height: Math.max(30, res.height + 12),
        lineCount: res.lineCount,
        lines: res.lines,
        naturalWidth: Math.ceil(natW),
        lineHeight
      };
    }

    // Default generic measurement
    const defaultText = block.text || block.content || block.title || '';
    if (defaultText) {
      font = font || '15px sans-serif';
      lineHeight = lineHeight || 22;
      const prep = prepareWithSegments(defaultText, font, options);
      const res = layoutWithLines(prep, width, lineHeight);
      return {
        width: Math.min(width, Math.ceil(measureNaturalWidth(prep))),
        height: res.height + 12,
        lineCount: res.lineCount,
        lines: res.lines,
        naturalWidth: Math.ceil(measureNaturalWidth(prep)),
        lineHeight
      };
    }

    return { width, height: 60, lineCount: 1, lines: [], naturalWidth: width, lineHeight: 60 };
  },

  // ── 3D Obstacle & Exclusion Text Flow ──
  /**
   * Dynamically flows text around 3D tilt cards and floating obstacle bounds.
   * Uses Pretext's cursor streaming API (layoutNextLine) for real-time reflow.
   */
  flowAroundExclusion: function (text, font, containerWidth, exclusionRects, lineHeight = 24, options = {}) {
    if (!text || !text.trim()) {
      return { lines: [], lineCount: 0, totalHeight: 0 };
    }
    const padding = options.padding !== undefined ? options.padding : 16;
    const rects = (Array.isArray(exclusionRects) ? exclusionRects : [exclusionRects]).filter(Boolean);
    const prepared = prepareWithSegments(text, font, options);
    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    let y = options.startY || 0;
    const lines = [];
    const maxIterations = options.maxLines || 500;
    let it = 0;

    while (it++ < maxIterations) {
      const bandTop = y;
      const bandBottom = y + lineHeight;

      const blocked = [];
      for (let rIdx = 0; rIdx < rects.length; rIdx++) {
        const r = rects[rIdx];
        if (bandBottom <= (r.y - padding) || bandTop >= (r.y + r.height + padding)) {
          continue;
        }
        blocked.push({
          left: Math.max(0, r.x - padding),
          right: Math.min(containerWidth, r.x + r.width + padding)
        });
      }

      const slots = carveTextLineSlots({ left: 0, right: containerWidth }, blocked, options.minSlotWidth || 40);
      if (slots.length === 0) {
        // Line band is fully occluded by obstacle, push downward
        y += lineHeight;
        continue;
      }

      // Select widest usable slot
      let bestSlot = slots[0];
      for (let sIdx = 1; sIdx < slots.length; sIdx++) {
        const s = slots[sIdx];
        if ((s.right - s.left) > (bestSlot.right - bestSlot.left)) {
          bestSlot = s;
        }
      }

      const availableWidth = bestSlot.right - bestSlot.left;
      const line = layoutNextLine(prepared, cursor, availableWidth);
      if (!line) break;

      // Safari/WebKit soft-hyphen narrow width edge case guard:
      // Ensure cursor always moves forward to prevent infinite loops
      if (line.end.segmentIndex === cursor.segmentIndex && line.end.graphemeIndex === cursor.graphemeIndex) {
        cursor = { segmentIndex: cursor.segmentIndex + 1, graphemeIndex: 0 };
        y += lineHeight;
        continue;
      }

      lines.push({
        text: line.text,
        x: Math.round(bestSlot.left),
        y: Math.round(y),
        width: Math.round(line.width),
        height: lineHeight,
        availableWidth: Math.round(availableWidth)
      });

      cursor = line.end;
      y += lineHeight;
    }

    return {
      lines,
      lineCount: lines.length,
      totalHeight: y
    };
  },

  // ── CSS Pre-Allocation Style Helper (Prevents Reflow Loops) ──
  formatBlockStyle: function (block, layoutResult) {
    if (!layoutResult) return '';
    return `min-height:${layoutResult.height}px;contain:layout style;`;
  }
};

export default LdocTextLayout;
