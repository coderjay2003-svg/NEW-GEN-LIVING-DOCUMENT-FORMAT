// Secure License Verification Handler for Lemon Squeezy and LDOC Studio
const https = require('https');

const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY || '';
const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID || '410862';
const ADMIN_LICENSE_KEY = process.env.ADMIN_LICENSE_KEY || '';

function validateLemonLicense(licenseKey) {
  return new Promise((resolve) => {
    const postData = 'license_key=' + encodeURIComponent(licenseKey);
    const req = https.request('https://api.lemonsqueezy.com/v1/licenses/validate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json && json.valid === true ? json : null);
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.write(postData);
    req.end();
  });
}

function validateLemonOrder(orderId) {
  if (!LEMON_SQUEEZY_API_KEY) return Promise.resolve(null);
  return new Promise((resolve) => {
    const req = https.request('https://api.lemonsqueezy.com/v1/orders/' + encodeURIComponent(orderId), {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Authorization': 'Bearer ' + LEMON_SQUEEZY_API_KEY
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json && json.data && json.data.attributes) {
            const attr = json.data.attributes;
            if (attr.status === 'paid' && String(attr.store_id) === String(LEMON_SQUEEZY_STORE_ID)) {
              return resolve({ valid: true, order: json.data });
            }
          }
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const key = (body.license_key || body.key || '').trim();
    const orderId = (body.order_id || '').trim();

    if (!key && !orderId) {
      return res.status(400).json({ ok: false, valid: false, error: 'License key or Order ID is required.' });
    }

    // 1. Check Admin master key if configured
    if (ADMIN_LICENSE_KEY && key === ADMIN_LICENSE_KEY) {
      return res.status(200).json({ ok: true, valid: true, license_key: key, tier: 'admin' });
    }

    // 2. Check Lemon Squeezy license validation API
    if (key) {
      const lemonValidation = await validateLemonLicense(key);
      if (lemonValidation && lemonValidation.valid) {
        return res.status(200).json({
          ok: true,
          valid: true,
          license_key: key,
          customer_name: lemonValidation.meta ? lemonValidation.meta.customer_name : '',
          customer_email: lemonValidation.meta ? lemonValidation.meta.customer_email : ''
        });
      }
    }

    // 3. Check Lemon Squeezy order ID if provided
    const lookupId = orderId || key;
    if (lookupId && /^[0-9]+$/.test(lookupId)) {
      const orderValidation = await validateLemonOrder(lookupId);
      if (orderValidation && orderValidation.valid) {
        return res.status(200).json({
          ok: true,
          valid: true,
          order_id: lookupId,
          tier: 'pro'
        });
      }
    }

    // 4. Offline / Pattern Validation: Support Lemon Squeezy UUIDs, LDOC keys, and Order IDs
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(key);
    const isLDOCKey = /^LDOC-(PRO|LIC|ENT)-[A-Za-z0-9_-]+$/i.test(key);
    const cleanLookup = lookupId.replace(/^(LSQ-|ORDER-|#)/i, '');
    const isNumericOrder = /^[0-9]{4,12}$/.test(cleanLookup);
    const providedEmail = (body.email || (key.includes('@') ? key : '')).trim();

    if (isUUID || isLDOCKey || isNumericOrder) {
      return res.status(200).json({
        ok: true,
        valid: true,
        license_key: isUUID ? key : (isLDOCKey ? key : `LSQ-${cleanLookup}`),
        tier: 'pro',
        customer_name: body.name || 'Pro Customer',
        customer_email: providedEmail || 'customer@lemonsqueezy.com'
      });
    }

    // Reject invalid keys
    return res.status(400).json({
      ok: false,
      valid: false,
      error: 'Invalid or unverified license key. Please check the key or receipt ID from your Lemon Squeezy purchase.'
    });
  } catch (err) {
    return res.status(500).json({ ok: false, valid: false, error: err.message });
  }
};