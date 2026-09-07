// License Generation and Retrieval Endpoint for LDOC Studio Pro
const crypto = require('crypto');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || req.query || {});
    const orderId = (body.order_id || body.orderId || '410862').trim();
    const email = (body.email || 'customer@example.com').trim();

    // Deterministic key generation from orderId / email
    const seed = (orderId || email || '410862').toUpperCase();
    const p1 = /^[0-9]{4,}$/.test(orderId) ? orderId : '410862';
    const hash = crypto.createHash('sha256').update(seed + '_LDOC_SALT_2026').digest('hex').toUpperCase();
    const h1 = hash.slice(0, 4);
    const h2 = hash.slice(4, 8);
    const licenseKey = 'LDOC-PRO-' + p1 + '-' + h1 + '-' + h2;

    return res.status(200).json({
      ok: true,
      valid: true,
      license_key: licenseKey,
      store_id: '410862',
      variant_id: '2096502',
      tier: 'pro',
      customer_email: email,
      order_id: orderId,
      instructions: 'Paste this key into the LDOC Studio pre-launch activation prompt to unlock your desktop workstation.'
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
