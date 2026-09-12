/**
 * @ldoc/sdk — Decoupled Living Document (.ldocx) Parser & Serializer
 * Copyright (c) 2026 J-AI-ENTERPRISES. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: http://www.apache.org/licenses/LICENSE-2.0
 * Trademarks "LDOC", "LDOCX", and "Living Document Format" are proprietary to J-AI-ENTERPRISES.
 */
const crypto = require('crypto');

let JSZip = null;
try {
  JSZip = require('jszip');
} catch (e) {
  try {
    JSZip = require('./jszip.min.js');
  } catch (e1) {
    try {
      JSZip = require('../../jszip.min.js');
    } catch (e2) {
      if (typeof window !== 'undefined' && window.JSZip) {
        JSZip = window.JSZip;
      }
    }
  }
}

const SCHEMA_VERSION = '2.5.0';

function validate(ast) {
  const errors = [];
  if (!ast || typeof ast !== 'object') return { valid: false, errors: ['AST must be an object'] };
  if (!ast.title) errors.push('Document title is required');
  if (!Array.isArray(ast.pages) || ast.pages.length === 0) errors.push('Document must contain pages array');
  return { valid: errors.length === 0, schema_version: SCHEMA_VERSION, errors };
}

function calculateChecksum(data) {
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
  return crypto.createHash('sha256').update(buf).digest('hex');
}

async function parse(fileInput) {
  if (typeof fileInput === 'string' && fileInput.trim().startsWith('{')) {
    return JSON.parse(fileInput);
  }
  if (!JSZip) throw new Error('JSZip dependency required to parse .ldocx');
  const zip = await JSZip.loadAsync(fileInput);
  const docFile = zip.file('document.json') || zip.file('document.jsonld');
  if (docFile) {
    const text = await docFile.async('text');
    return JSON.parse(text);
  }
  // Multi-file layout container support
  const manifestFile = zip.file('manifest.json');
  if (manifestFile) {
    const manifestText = await manifestFile.async('text');
    const manifest = JSON.parse(manifestText);
    const pages = [];
    const pageFiles = [];
    zip.forEach((path, file) => {
      if (!file.dir && /pages\/.*(content|layout|\d+)\.json$/i.test(path)) {
        pageFiles.push(file);
      }
    });
    pageFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    for (const pFile of pageFiles) {
      try {
        const pText = await pFile.async('text');
        const pJson = JSON.parse(pText);
        pages.push(pJson);
      } catch (e) {}
    }
    return {
      title: manifest.title || manifest.name || 'Living Document',
      schema_version: manifest.schema_version || SCHEMA_VERSION,
      metadata: manifest,
      pages: pages.length > 0 ? pages : [{ id: 'page_1', title: 'Page 1', blocks: [] }]
    };
  }
  throw new Error('Missing document.json or manifest.json in .ldocx container');
}

async function serialize(ast, assetsMap = {}) {
  const val = validate(ast);
  if (!val.valid) throw new Error('Invalid AST: ' + val.errors.join(', '));
  if (!JSZip) throw new Error('JSZip required to serialize .ldocx');

  const zip = new JSZip();
  const manifest = { format: 'ldocx', schema_version: SCHEMA_VERSION, title: ast.title, created_at: new Date().toISOString() };
  const docJsonStr = JSON.stringify(ast, null, 2);

  zip.file('document.json', docJsonStr);

  for (const [k, v] of Object.entries(assetsMap)) {
    zip.file(k, v);
  }

  // Generate signing key pair and sign the document
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const keyPair = await crypto.subtle.generateKey(
        { name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']
      );
      const mStr = JSON.stringify(manifest);
      const blocksStr = JSON.stringify(ast.pages);
      const enc = new TextEncoder();
      const payload = enc.encode(mStr + '|' + blocksStr);
      const sig = await crypto.subtle.sign(
        { name: 'ECDSA', hash: 'SHA-256' }, keyPair.privateKey, payload
      );
      const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
      const pubKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
      
      zip.file('signatures/ecdsa-p256.sig', sigB64);
      zip.file('signatures/public-key.jwk', JSON.stringify(pubKeyJwk, null, 2));
      
      manifest.signed = true;
      manifest.signature_algorithm = 'ECDSA-P256-SHA256';
    } catch(e) {
      console.warn('Signing skipped:', e.message);
    }
  }

  const finalManifestStr = JSON.stringify(manifest, null, 2);
  zip.file('manifest.json', finalManifestStr);
  
  const checksum = `manifest.json: ${calculateChecksum(finalManifestStr)}\ndocument.json: ${calculateChecksum(docJsonStr)}\n`;
  zip.file('checksum.sha256', checksum);

  if (typeof window === 'undefined') {
    return await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  } else {
    return await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
  }
}

module.exports = { parse, serialize, validate, calculateChecksum, SCHEMA_VERSION };
