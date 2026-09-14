// Package Integrity & Checksum Manifest Signer
const crypto = require('crypto');

const PACKAGE_SIGNING_SECRET = process.env.PACKAGE_SIGNING_SECRET || 'ldoc_proprietary_secure_signing_key_2026';

/**
 * Generates a signed checksum.sha256 manifest for all files in a .ldocx package
 */
function generatePackageManifest(filesMap) {
  const manifest = {
    format: 'ldocx',
    schema_version: '2.5.0',
    algorithm: 'SHA-256',
    generated_at: new Date().toISOString(),
    files: {},
    master_checksum: ''
  };

  const fileKeys = Object.keys(filesMap).sort();
  const masterHasher = crypto.createHash('sha256');

  for (const filename of fileKeys) {
    const data = filesMap[filename];
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    manifest.files[filename] = {
      bytes: buf.length,
      sha256: hash
    };
    masterHasher.update(filename + ':' + hash);
  }

  manifest.master_checksum = masterHasher.digest('hex');

  // Cryptographic Signature
  const signature = crypto.createHmac('sha256', PACKAGE_SIGNING_SECRET)
    .update(manifest.master_checksum)
    .digest('hex');

  manifest.signature = signature;

  return manifest;
}

/**
 * Verifies package integrity and authenticity
 */
function verifyPackageManifest(manifest) {
  if (!manifest || !manifest.master_checksum || !manifest.signature) {
    return { authentic: false, error: 'Manifest missing checksum or signature' };
  }

  const expectedSig = crypto.createHmac('sha256', PACKAGE_SIGNING_SECRET)
    .update(manifest.master_checksum)
    .digest('hex');

  const authentic = (manifest.signature === expectedSig);

  return {
    authentic,
    master_checksum: manifest.master_checksum,
    files_count: Object.keys(manifest.files || {}).length,
    status: authentic ? 'verified_untampered' : 'tampering_detected'
  };
}

module.exports = {
  generatePackageManifest,
  verifyPackageManifest
};
