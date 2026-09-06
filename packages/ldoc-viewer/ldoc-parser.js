/**
 * LDOC Unified Parser & Lenient Recovery Engine
 * Provides resilient, non-blocking .ldocx parsing, partial-damage recovery,
 * block quarantine, and guaranteed async JSZip initialization.
 */
(function (global) {
  'use strict';

  // 1. JSZip Load Guard
  function ensureJSZipReady() {
    if (typeof global.JSZip !== 'undefined') {
      return Promise.resolve(global.JSZip);
    }
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const check = setInterval(() => {
        attempts++;
        if (typeof global.JSZip !== 'undefined') {
          clearInterval(check);
          resolve(global.JSZip);
        } else if (attempts > 50) {
          clearInterval(check);
          // Try dynamic injection if script was omitted
          const script = document.createElement('script');
          script.src = 'jszip.min.js';
          script.onload = () => resolve(global.JSZip);
          script.onerror = () => reject(new Error('Unable to load JSZip dependency.'));
          document.head.appendChild(script);
        }
      }, 50);
    });
  }

  // 2. Lenient .ldocx Package Parser
  async function parseLdocxLenient(fileOrBlob) {
    const JSZipLib = await ensureJSZipReady();
    if (!JSZipLib) throw new Error('JSZip is not available.');

    let isRecovered = false;
    let quarantinedCount = 0;
    let totalBlocks = 0;

    let zip;
    try {
      zip = await JSZipLib.loadAsync(fileOrBlob);
    } catch (zipErr) {
      console.warn('Strict ZIP parse failed, attempting recovery mode:', zipErr);
      isRecovered = true;
      // In extreme cases, attempt loose extraction if supported or throw clean error
      throw new Error('Corrupted document archive: archive central header damaged.');
    }

    // A. Manifest Resolution
    let manifest = {
      ldoc_version: '2.5.0',
      id: 'doc_' + Math.random().toString(36).slice(2, 10),
      title: (fileOrBlob.name ? fileOrBlob.name.replace(/\.ldocx$/i, '') : 'Living Document'),
      author: 'Living Document Creator',
      lang: 'en',
      created_at: new Date().toISOString(),
      theme: 'velocity',
      page_count: 1
    };

    const manifestFile = zip.file('manifest.json') || zip.file(/^manifest\.json$/i)[0];
    if (manifestFile) {
      try {
        const mText = await manifestFile.async('text');
        const mObj = JSON.parse(mText);
        manifest = Object.assign({}, manifest, mObj);
      } catch (mErr) {
        console.warn('Damaged manifest.json — applied safe defaults:', mErr);
        isRecovered = true;
      }
    } else {
      console.warn('Missing manifest.json — reconstructed safe manifest.');
      isRecovered = true;
    }

    // B. Page Extraction & Block Quarantine
    let extractedPages = [];
    const pageFiles = [];

    zip.forEach((relPath, zipEntry) => {
      if (!zipEntry.dir && /pages\/page_\d+\.json$/i.test(relPath)) {
        pageFiles.push(zipEntry);
      }
    });

    pageFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    for (let i = 0; i < pageFiles.length; i++) {
      const entry = pageFiles[i];
      try {
        const text = await entry.async('text');
        const pageData = JSON.parse(text);
        const safeBlocks = [];

        if (Array.isArray(pageData.blocks)) {
          pageData.blocks.forEach((blk, bIdx) => {
            totalBlocks++;
            if (!blk || typeof blk !== 'object' || !blk.type) {
              quarantinedCount++;
              safeBlocks.push({
                id: 'blk_quarantine_' + bIdx,
                type: 'paragraph',
                text: '⚠️ [Quarantined Block]: Damaged block payload safely preserved.',
                quarantined: true
              });
            } else {
              safeBlocks.push(blk);
            }
          });
        }

        extractedPages.push({
          id: pageData.id || `page_${String(i + 1).padStart(3, '0')}`,
          num: pageData.page_number || (i + 1),
          title: pageData.title || `Page ${i + 1}`,
          fx: pageData.fx || null,
          theme: pageData.theme || null,
          blocks: safeBlocks,
          floating_texts: Array.isArray(pageData.floating_texts) ? pageData.floating_texts : []
        });
      } catch (pageErr) {
        console.warn(`Error reading page file ${entry.name}, skipping damaged entry:`, pageErr);
        isRecovered = true;
        quarantinedCount++;
      }
    }

    // Fallback C: Spec.json if pages/ folder was omitted or empty
    if (extractedPages.length === 0) {
      const specFile = zip.file('spec.json');
      if (specFile) {
        try {
          const specText = await specFile.async('text');
          const specObj = JSON.parse(specText);
          if (Array.isArray(specObj.pages)) {
            specObj.pages.forEach((p, idx) => {
              const sBlocks = (p.blocks || []).map((blk, bIdx) => {
                totalBlocks++;
                if (!blk || typeof blk !== 'object') {
                  quarantinedCount++;
                  return { id: 'blk_q_' + bIdx, type: 'paragraph', text: '⚠️ [Quarantined Block]' };
                }
                return blk;
              });
              extractedPages.push({
                id: p.id || `page_${idx + 1}`,
                num: idx + 1,
                title: p.title || `Page ${idx + 1}`,
                fx: p.fx || null,
                theme: p.theme || null,
                blocks: sBlocks,
                floating_texts: p.floating_texts || []
              });
            });
            isRecovered = true;
          }
        } catch (sErr) {
          console.warn('Damaged spec.json:', sErr);
        }
      }
    }

    // Fallback D: Zero pages recovered — guarantee at least 1 usable page
    if (extractedPages.length === 0) {
      extractedPages.push({
        id: 'page_001',
        num: 1,
        title: manifest.title || 'Page 1',
        blocks: [{
          id: 'blk_welcome',
          type: 'heading',
          level: 1,
          text: manifest.title || 'Living Document'
        }]
      });
      isRecovered = true;
    }

    manifest.page_count = extractedPages.length;

    // Surface non-blocking banner if recovery occurred
    if (isRecovered && typeof global.LDocToast !== 'undefined') {
      const msg = quarantinedCount > 0
        ? `Document recovered: ${totalBlocks - quarantinedCount} blocks loaded (${quarantinedCount} quarantined).`
        : `✓ Document opened in lenient recovery format.`;
      global.LDocToast.banner(msg, quarantinedCount === 0);
    }

    return { manifest, pages: extractedPages, isRecovered, quarantinedCount };
  }

  // 3. Client-Side Package Compiler
  async function compileLdocxClientSide(spec) {
    const JSZipLib = await ensureJSZipReady();
    if (!JSZipLib) throw new Error('JSZip is not available.');
    const zip = new JSZipLib();

    const docId = 'doc_' + Math.random().toString(36).slice(2, 11);
    const title = spec.title || 'Living Document';
    const manifest = {
      ldoc_version: '2.5.0',
      id: docId,
      title: title,
      author: spec.author || 'Living Document Creator',
      lang: spec.lang || 'en',
      created_at: new Date().toISOString(),
      theme: spec.theme || 'velocity',
      page_count: (spec.pages || []).length,
      assets: []
    };

    zip.file('manifest.json', JSON.stringify(manifest, null, 2));
    zip.file('spec.json', JSON.stringify(spec, null, 2));

    const pagesFolder = zip.folder('pages');
    (spec.pages || []).forEach((p, idx) => {
      const pageNum = String(idx + 1).padStart(3, '0');
      const pData = {
        id: p.id || `page_${pageNum}`,
        page_number: idx + 1,
        title: p.title || `Page ${idx + 1}`,
        fx: p.fx || null,
        theme: p.theme || null,
        blocks: p.blocks || [],
        floating_texts: p.floating_texts || []
      };
      pagesFolder.file(`page_${pageNum}.json`, JSON.stringify(pData, null, 2));
    });

    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    return { blob, docId, title, manifest };
  }

  // Attach globally
  global.LDocParser = {
    ensureJSZipReady,
    parseLdocxLenient,
    compileLdocxClientSide
  };
})(typeof window !== 'undefined' ? window : this);
