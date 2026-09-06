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

      // Auto-save local snapshot
      try {
        localStorage.setItem('ldoc_editor_active_autosave', snapshot);
      } catch (e) {}
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
      const newFt = {
        id: ftId,
        text: initialText,
        left: x,
        top: y,
        color: '#f8fafc',
        fontSize: 16,
        fontFamily: 'Plus Jakarta Sans',
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

})(typeof window !== 'undefined' ? window : this);
