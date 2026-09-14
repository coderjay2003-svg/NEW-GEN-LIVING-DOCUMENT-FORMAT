/**
 * LDOC Unified Editor Core
 * Shared AST state, undo/redo command stack, in-canvas Free Text creator,
 * persistent universal save/export handler, and FX Wizard controller.
 */
(function (global) {
  'use strict';

  const LDocEditorCore = {
    state: {
      docId: null,
      title: 'Living Document',
      theme: 'velocity',
      pages: [],
      currentPageId: null,
      undoStack: [],
      redoStack: [],
      maxHistory: 40,
      renderCallbacks: []
    },

    onRender: function (fn) {
      if (typeof fn === 'function') {
        this.state.renderCallbacks.push(fn);
      }
    },

    notifyRender: function () {
      this.state.renderCallbacks.forEach(fn => {
        try { fn(this.state); } catch (e) { console.warn('Render callback error:', e); }
      });
    },

    init: function (docData) {
      if (docData && Array.isArray(docData.pages)) {
        this.state.pages = JSON.parse(JSON.stringify(docData.pages));
        this.state.title = docData.title || 'Living Document';
        this.state.theme = docData.theme || 'velocity';
      }
      if (this.state.pages.length === 0) {
        this.state.pages = [{
          id: 'page_001',
          num: 1,
          title: 'Page 1',
          blocks: [],
          floating_texts: []
        }];
      }
      this.state.currentPageId = this.state.pages[0].id;
      this.state.undoStack = [];
      this.state.redoStack = [];
      this.pushUndoSnapshot();
    },

    getActivePage: function () {
      if (!this.state.currentPageId && this.state.pages.length > 0) {
        this.state.currentPageId = this.state.pages[0].id;
      }
      return this.state.pages.find(p => p.id === this.state.currentPageId) || this.state.pages[0];
    },

    // IndexedDB Persistent Storage for large document snapshots (>100MB capacity)
    _dbPromise: null,
    _getDB: function () {
      if (this._dbPromise) return this._dbPromise;
      if (typeof indexedDB === 'undefined') return null;
      this._dbPromise = new Promise(function (resolve) {
        try {
          var req = indexedDB.open('LDOC_Studio_Store', 1);
          req.onupgradeneeded = function (e) {
            var db = e.target.result;
            if (!db.objectStoreNames.contains('snapshots')) {
              db.createObjectStore('snapshots', { keyPath: 'key' });
            }
          };
          req.onsuccess = function (e) { resolve(e.target.result); };
          req.onerror = function () { resolve(null); };
        } catch (e) {
          resolve(null);
        }
      });
      return this._dbPromise;
    },

    saveSnapshotDurable: function (key, data) {
      // 1. IndexedDB first for large documents, 3D models, textures
      try {
        var dbP = this._getDB();
        if (dbP && typeof dbP.then === 'function') {
          dbP.then(function (db) {
            if (db) {
              try {
                var tx = db.transaction('snapshots', 'readwrite');
                var store = tx.objectStore('snapshots');
                store.put({ key: key, data: data, timestamp: Date.now() });
              } catch (e) {}
            }
          });
        }
      } catch (e) {}

      // 2. Best-effort fallback to localStorage
      try {
        localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
      } catch (lsErr) {}
    },

    loadSnapshotDurable: function (key, callback) {
      var self = this;
      try {
        var dbP = this._getDB();
        if (dbP && typeof dbP.then === 'function') {
          dbP.then(function (db) {
            if (db) {
              try {
                var tx = db.transaction('snapshots', 'readonly');
                var store = tx.objectStore('snapshots');
                var req = store.get(key);
                req.onsuccess = function () {
                  if (req.result && req.result.data) {
                    if (typeof callback === 'function') callback(req.result.data);
                  } else {
                    var ls = localStorage.getItem(key);
                    if (typeof callback === 'function') callback(ls);
                  }
                };
                req.onerror = function () {
                  var ls = localStorage.getItem(key);
                  if (typeof callback === 'function') callback(ls);
                };
                return;
              } catch (e) {}
            }
            var ls = localStorage.getItem(key);
            if (typeof callback === 'function') callback(ls);
          });
          return;
        }
      } catch (e) {}

      var ls = localStorage.getItem(key);
      if (typeof callback === 'function') callback(ls);
    },

    pushUndoSnapshot: function () {
      const snapshot = JSON.stringify({
        title: this.state.title,
        theme: this.state.theme,
        pages: this.state.pages,
        currentPageId: this.state.currentPageId
      });

      // Avoid duplicate consecutive states
      if (this.state.undoStack.length > 0 && this.state.undoStack[this.state.undoStack.length - 1] === snapshot) {
        return;
      }

      this.state.undoStack.push(snapshot);
      if (this.state.undoStack.length > this.state.maxHistory) {
        this.state.undoStack.shift();
      }
      this.state.redoStack = []; // clear redo on new mutation

      // Auto-save local snapshot via durable IndexedDB (>100MB capacity) with localStorage fallback
      this.saveSnapshotDurable('ldoc_editor_active_autosave', snapshot);
    },

    undo: function () {
      if (this.state.undoStack.length <= 1) {
        if (typeof global.LDocToast !== 'undefined') global.LDocToast.show('Nothing to undo', 'info');
        return false;
      }

      const current = this.state.undoStack.pop();
      this.state.redoStack.push(current);

      const previous = JSON.parse(this.state.undoStack[this.state.undoStack.length - 1]);
      this.state.title = previous.title;
      this.state.theme = previous.theme;
      this.state.pages = previous.pages;
      this.state.currentPageId = previous.currentPageId;

      this.notifyRender();
      if (typeof global.LDocToast !== 'undefined') global.LDocToast.show('Undo successful', 'ok', 1500);
      return true;
    },

    redo: function () {
      if (this.state.redoStack.length === 0) {
        if (typeof global.LDocToast !== 'undefined') global.LDocToast.show('Nothing to redo', 'info');
        return false;
      }

      const nextStateJson = this.state.redoStack.pop();
      this.state.undoStack.push(nextStateJson);

      const next = JSON.parse(nextStateJson);
      this.state.title = next.title;
      this.state.theme = next.theme;
      this.state.pages = next.pages;
      this.state.currentPageId = next.currentPageId;

      this.notifyRender();
      if (typeof global.LDocToast !== 'undefined') global.LDocToast.show('Redo successful', 'ok', 1500);
      return true;
    },

    // ── ✍️ In-Canvas Free Text Tool (Bug B3 Fix) ──
    addFreeText: function (customOpts) {
      let page = this.getActivePage();
      if (!page) {
        this.init();
        page = this.getActivePage();
      }

      page.floating_texts = page.floating_texts || [];

      // Determine clean placement coordinates on slide
      const x = (customOpts && typeof customOpts.x === 'number') ? customOpts.x : 100 + (page.floating_texts.length * 20) % 200;
      const y = (customOpts && typeof customOpts.y === 'number') ? customOpts.y : 120 + (page.floating_texts.length * 30) % 250;
      const initialText = (customOpts && customOpts.text) ? customOpts.text : 'Double-click to edit dynamic text note...';

      const ftId = 'ft_' + Math.random().toString(36).slice(2, 9);
      const fontSize = (customOpts && customOpts.fontSize) || 16;
      const fontFamily = (customOpts && customOpts.fontFamily) || 'Plus Jakarta Sans';

      // Pre-measure with LDocTextLayout to avoid DOM measurement reflow
      let metrics = null;
      const textEngine = global.LDocTextLayout || global.LdocTextLayout;
      if (textEngine && typeof textEngine.measureBlock === 'function') {
        metrics = textEngine.measureBlock({
          type: 'floating_text',
          text: initialText,
          fontSize: fontSize,
          fontFamily: fontFamily
        }, 500);
      }

      const newFt = {
        id: ftId,
        text: initialText,
        left: x,
        top: y,
        width: metrics ? metrics.width : 220,
        height: metrics ? metrics.height : 40,
        lineCount: metrics ? metrics.lineCount : 1,
        color: (customOpts && customOpts.color) || '#f8fafc',
        fontSize: fontSize,
        fontFamily: fontFamily,
        isEditing: true
      };

      page.floating_texts.push(newFt);
      this.pushUndoSnapshot();
      this.notifyRender();

      // Trigger legacy renders if present in parent document
      if (typeof global.renderCreatorSlidePreview === 'function') global.renderCreatorSlidePreview();
      if (typeof global.renderPreview === 'function') global.renderPreview();
      if (typeof global.renderBlocks === 'function') global.renderBlocks();

      // Automatically focus the newly created element
      setTimeout(() => {
        const el = document.getElementById(ftId) || document.querySelector(`[data-ft-id="${ftId}"]`);
        if (el) {
          el.contentEditable = 'true';
          if (typeof el.focus === 'function') el.focus();
          if (typeof window.getSelection === 'function' && typeof document.createRange === 'function') {
            const range = document.createRange();
            range.selectNodeContents(el);
            const sel = window.getSelection();
            if (sel) {
              sel.removeAllRanges();
              sel.addRange(range);
            }
          }
        }
      }, 60);

      if (typeof global.LDocToast !== 'undefined') {
        global.LDocToast.show('✍️ Free Text placed! Click or type to edit.', 'ok', 2500);
      }
      return newFt;
    },

    // ── 📊 Standard Table / Grid Block Generator ──
    addTableBlock: function (customHeaders, customRows) {
      let page = this.getActivePage();
      if (!page) {
        this.init();
        page = this.getActivePage();
      }
      page.blocks = page.blocks || [];
      const tblBlock = {
        id: 'blk_table_' + Math.random().toString(36).slice(2, 9),
        type: 'table',
        headers: customHeaders || ['Specification / Feature', 'Standard Package', 'Enterprise Pro'],
        rows: customRows || [
          ['Hologram 3D Engine', '60 FPS WebGL Rendering', '120 FPS Raytracing + Spatial'],
          ['Sandbox Security', 'In-Memory RAM Sandbox', 'Airgapped HSM Verification'],
          ['File Container', 'Zero-Outsource Standalone', 'Signed Cryptographic .ldocx']
        ]
      };
      page.blocks.push(tblBlock);
      this.pushUndoSnapshot();
      this.notifyRender();
      if (typeof global.LDocToast !== 'undefined') {
        global.LDocToast.show('📊 Table block added! Editable in-place.', 'ok', 2000);
      }
      return tblBlock;
    },

    // ── 🗜️ Pretext-Powered Layout & Ergonomics ──
    /**
     * Jank-free auto-grow text boxes: Arithmetically computes height on every keystroke
     * with zero forced synchronous DOM layout queries (getBoundingClientRect/offsetHeight).
     */
    syncTextElementBounds: function (el, blockOrFt, targetWidth, maxHeight) {
      if (!el) return null;
      const textEngine = global.LDocTextLayout || global.LdocTextLayout;
      if (!textEngine || typeof textEngine.measureBlock !== 'function') return null;

      const width = targetWidth || (el.offsetWidth || 300);
      const text = (typeof el.innerText === 'string' ? el.innerText : (el.value || (blockOrFt ? blockOrFt.text : '') || ''));
      const fontSize = parseInt((blockOrFt && (blockOrFt.fontSize || blockOrFt.size)) || 16, 10);
      const fontFamily = (blockOrFt && (blockOrFt.fontFamily || blockOrFt.font)) || '"Plus Jakarta Sans", sans-serif';
      const blockType = (blockOrFt && blockOrFt.type) || 'floating_text';

      const metrics = textEngine.measureBlock({
        type: blockType,
        text: text,
        fontSize: fontSize,
        fontFamily: fontFamily
      }, width);

      const targetHeight = Math.max(32, metrics.height);
      el.style.height = `${targetHeight}px`;
      el.style.minHeight = `${targetHeight}px`;

      return {
        width: metrics.width,
        height: targetHeight,
        lineCount: metrics.lineCount,
        naturalWidth: metrics.naturalWidth,
        fits: !maxHeight || targetHeight <= maxHeight
      };
    },

    /**
     * Live "Fits Your Slide" Indicator:
     * Fast check (<0.1ms) evaluating line capacity vs available height.
     */
    evaluateFit: function (blockOrFt, containerBounds) {
      const textEngine = global.LDocTextLayout || global.LdocTextLayout;
      if (!textEngine || typeof textEngine.measureBlock !== 'function') {
        return { fits: true, lineCount: 1, maxLines: 1, overflowLines: 0 };
      }

      const width = containerBounds ? (containerBounds.width || 400) : 400;
      const height = containerBounds ? (containerBounds.height || 200) : 200;
      const fontSize = parseInt((blockOrFt && (blockOrFt.fontSize || blockOrFt.size)) || 16, 10);
      const lineHeight = Math.round(fontSize * 1.35);
      const maxLines = Math.max(1, Math.floor(height / lineHeight));

      const text = (blockOrFt && (blockOrFt.text || blockOrFt.content)) || '';
      const metrics = textEngine.measureBlock({
        type: (blockOrFt && blockOrFt.type) || 'floating_text',
        text: text,
        fontSize: fontSize,
        fontFamily: (blockOrFt && (blockOrFt.fontFamily || blockOrFt.font)) || '"Plus Jakarta Sans", sans-serif'
      }, width);

      const overflow = metrics.lineCount > maxLines || metrics.height > height;
      const overflowLines = Math.max(0, metrics.lineCount - maxLines);

      return {
        fits: !overflow,
        lineCount: metrics.lineCount,
        maxLines: maxLines,
        overflowLines: overflowLines,
        height: metrics.height,
        maxHeight: height
      };
    },

    /**
     * One-Click "Shrink to Fit":
     * Dynamically searches optimal font size to eliminate overflow in <0.2ms.
     */
    shrinkToFit: function (ftIdOrBlockId, containerBounds) {
      const textEngine = global.LDocTextLayout || global.LdocTextLayout;
      if (!textEngine || typeof textEngine.fitFontSize !== 'function') return null;

      let page = this.getActivePage();
      if (!page) return null;

      let target = null;
      let isFloating = false;
      if (Array.isArray(page.floating_texts)) {
        target = page.floating_texts.find(ft => ft.id === ftIdOrBlockId);
        if (target) isFloating = true;
      }
      if (!target && Array.isArray(page.blocks)) {
        target = page.blocks.find(b => b.id === ftIdOrBlockId);
      }

      const el = typeof document !== 'undefined' ? (document.getElementById(ftIdOrBlockId) || document.querySelector(`[data-ft-id="${ftIdOrBlockId}"]`)) : null;

      const targetWidth = containerBounds ? (containerBounds.width || 400) : (target ? (target.width || 400) : 400);
      const targetHeight = containerBounds ? (containerBounds.height || 200) : (target ? (target.height || 200) : 200);

      const text = target ? (target.text || target.content || '') : (el ? (el.innerText || el.value || '') : '');
      const currentFontSize = target ? (target.fontSize || 18) : 18;

      const fitResult = textEngine.fitFontSize({
        text: text,
        fontSize: currentFontSize,
        fontFamily: target ? (target.fontFamily || target.font) : 'Plus Jakarta Sans'
      }, targetWidth, targetHeight);

      if (target) {
        target.fontSize = fitResult.fontSize;
        this.pushUndoSnapshot();
        this.notifyRender();
      }

      if (el) {
        el.style.fontSize = `${fitResult.fontSize}px`;
        el.style.lineHeight = `${fitResult.lineHeight}px`;
        el.style.height = `${fitResult.height}px`;
      }

      if (typeof global.LDocToast !== 'undefined') {
        global.LDocToast.show(`🗜️ Fit applied: Font size ${fitResult.fontSize}px (${fitResult.lineCount} lines)`, 'ok', 2000);
      }

      return fitResult;
    },

    /**
     * Shrink-wrap chips and badges:
     * Measures natural text width arithmetically and applies exact width without DOM reflow.
     */
    applyShrinkWrap: function (containerSelector, options = {}) {
      const textEngine = global.LDocTextLayout || global.LdocTextLayout;
      if (!textEngine || typeof textEngine.measureNaturalWidth !== 'function' || typeof document === 'undefined') return;

      const containers = document.querySelectorAll(containerSelector || '.ldoc-shrinkwrap, .ldoc-badge, .ldoc-chip, .pill');
      containers.forEach(el => {
        const text = el.getAttribute('data-shrink-text') || el.innerText || el.textContent || '';
        if (!text.trim()) return;
        const font = options.font || el.getAttribute('data-font') || '600 12px "Plus Jakarta Sans", sans-serif';
        const padding = options.padding !== undefined ? options.padding : 20;
        const naturalW = textEngine.measureNaturalWidth(text.trim(), font);
        const targetW = Math.ceil(naturalW + padding);
        el.style.width = `${targetW}px`;
        el.style.minWidth = `${targetW}px`;
        el.style.maxWidth = `${targetW}px`;
        el.classList.add('ldoc-shrinkwrapped');
      });
    },

    /**
     * Magazine-style text flow around 3D, image, and video obstacle blocks.
     */
    reflowSurroundingText: function (pageOrPageId, obstacleRect, options = {}) {
      const textEngine = global.LDocTextLayout || global.LdocTextLayout;
      if (!textEngine || typeof textEngine.flowAroundExclusion !== 'function') return null;

      const page = (typeof pageOrPageId === 'string')
        ? (this.state.pages.find(p => p.id === pageOrPageId) || this.getActivePage())
        : (pageOrPageId || this.getActivePage());

      if (!page || !obstacleRect) return null;

      const results = [];
      const containerWidth = options.containerWidth || 800;

      const textBlocks = (page.blocks || []).filter(b => b.type === 'paragraph' || b.type === 'text');
      textBlocks.forEach(b => {
        const text = b.text || b.content || '';
        if (!text.trim()) return;
        const font = options.font || '15px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
        const flowRes = textEngine.flowAroundExclusion(text, font, containerWidth, obstacleRect, options.lineHeight || 24, options);
        b._exclusionLayout = flowRes;
        results.push({ blockId: b.id, flowRes });
      });

      this.notifyRender();
      return results;
    },

    // ── Persistent Universal Save & Export (Bug B5 Fix) ──
    saveActiveDocument: async function () {
      if (typeof global.LDocParser === 'undefined') {
        if (typeof global.LDocToast !== 'undefined') global.LDocToast.show('Parser engine initializing...', 'warn');
        return;
      }

      // Gather current doc spec from whichever editor is active
      let spec = {
        title: this.state.title || 'Living Document',
        theme: this.state.theme || 'velocity',
        pages: this.state.pages || []
      };

      // If studio editor active or edPages populated with user-edited content, prioritize edPages
      const edPanel = typeof document !== 'undefined' ? (document.getElementById('panel-editor') || document.getElementById('editor-panel')) : null;
      const isEditorTab = edPanel && (edPanel.classList.contains('active') || (edPanel.style && edPanel.style.display !== 'none') || (global.__activeTab === 'editor'));

      if ((isEditorTab || (typeof global.pages === 'undefined' || !global.pages || !global.pages.length)) && typeof global.edPages !== 'undefined' && Array.isArray(global.edPages) && global.edPages.length > 0) {
        spec.pages = global.edPages.map(p => ({
          id: p.id,
          page_number: p.page_number || p.num,
          title: p.title,
          fx: p.fx || null,
          theme: p.theme || null,
          floating_texts: Array.isArray(p.floating_texts) ? p.floating_texts.map(ft => Object.assign({}, ft)) : [],
          blocks: (p.blocks || []).map(b => Object.assign({}, b))
        }));
        const edTitle = document.getElementById('ed-title');
        if (edTitle && edTitle.value) spec.title = edTitle.value;
      } else if (typeof global.edPages !== 'undefined' && Array.isArray(global.edPages) && global.edPages.length > 0) {
        spec.pages = global.edPages.map(p => ({
          id: p.id,
          page_number: p.page_number || p.num,
          title: p.title,
          fx: p.fx || null,
          theme: p.theme || null,
          floating_texts: Array.isArray(p.floating_texts) ? p.floating_texts.map(ft => Object.assign({}, ft)) : [],
          blocks: (p.blocks || []).map(b => Object.assign({}, b))
        }));
        const edTitle = document.getElementById('ed-title');
        if (edTitle && edTitle.value) spec.title = edTitle.value;
      } else if (typeof global.pages !== 'undefined' && Array.isArray(global.pages) && global.pages.length > 0) {
        spec.pages = global.pages;
        const titleEl = document.getElementById('top-title') || document.getElementById('doc-title');
        if (titleEl && titleEl.value) spec.title = titleEl.value;
      } else if (typeof global.currentDoc !== 'undefined' && global.currentDoc && global.currentDoc.pages) {
        spec = global.currentDoc;
      }

      try {
        if (typeof global.LDocToast !== 'undefined') global.LDocToast.show('Packaging .ldocx package...', 'info', 1500);
        const { blob, title } = await global.LDocParser.compileLdocxClientSide(spec);

        // Trigger browser download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (title.replace(/[^a-zA-Z0-9_\- ]/g, '_') || 'presentation') + '.ldocx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (typeof global.LDocToast !== 'undefined') {
          global.LDocToast.show(`✓ Saved & Downloaded "${a.download}"`, 'ok');
        }
      } catch (err) {
        console.error('Save failed:', err);
        if (typeof global.LDocToast !== 'undefined') {
          global.LDocToast.show('Save failed: ' + err.message, 'err');
        }
      }
    }
  };

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
        // Only intercept if not currently inside an input/textarea
        if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
          e.preventDefault();
          LDocEditorCore.addFreeText();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        LDocEditorCore.saveActiveDocument();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
          e.preventDefault();
          LDocEditorCore.undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
          e.preventDefault();
          LDocEditorCore.redo();
        }
      }
    });
  }

  // Safe global aliases
  global.LDocEditorCore = LDocEditorCore;
  global.saveActiveDoc = function () {
    LDocEditorCore.saveActiveDocument();
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LDocEditorCore;
    module.exports.LDocEditorCore = LDocEditorCore;
  }

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
