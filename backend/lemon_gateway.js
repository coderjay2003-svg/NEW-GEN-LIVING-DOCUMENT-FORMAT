// Lemon Squeezy Monetization Gateway for LDOC Ecosystem
const crypto = require('crypto');
const https = require('https');

const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY || '';
const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID || '410862';
const LEMON_SQUEEZY_WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || 'LEMON_SQUEEZY_WEBHOOK_SECRET';
const STORE_URL = 'https://jay-app.lemonsqueezy.com';

function generateLicenseKey(prefix) {
  prefix = prefix || 'LDOC-LIC';
  const p1 = crypto.randomBytes(4).toString('hex').toUpperCase();
  const p2 = crypto.randomBytes(4).toString('hex').toUpperCase();
  const p3 = crypto.randomBytes(4).toString('hex').toUpperCase();
  return prefix + '-' + p1 + '-' + p2 + '-' + p3;
}

async function createLemonCheckoutSession(data) {
  data = data || {};
  const variantId = data.variantId || process.env.LEMON_SQUEEZY_VARIANT_ID || '16851c1c-6dfb-4607-bf8b-81c3427594d1';
  const customData = data.customData || {};
  const email = data.email || '';
  const name = data.name || '';

  if (variantId && LEMON_SQUEEZY_API_KEY) {
    const payload = JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: email || undefined,
            name: name || undefined,
            custom: customData
          }
        },
        relationships: {
          store: { data: { type: 'stores', id: LEMON_SQUEEZY_STORE_ID } },
          variant: { data: { type: 'variants', id: String(variantId) } }
        }
      }
    });

    try {
      const checkoutRes = await new Promise((resolve, reject) => {
        const req = https.request('https://api.lemonsqueezy.com/v1/checkouts', {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            'Authorization': 'Bearer ' + LEMON_SQUEEZY_API_KEY
          }
        }, res => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(body)); } catch (e) { resolve(null); }
          });
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
      });

      const url = checkoutRes && checkoutRes.data && checkoutRes.data.attributes && checkoutRes.data.attributes.url;
      if (url) {
        return {
          ok: true,
          provider: 'lemonsqueezy',
          checkout_url: url,
          checkout_id: checkoutRes.data.id
        };
      }
    } catch (e) {
      console.warn('[LemonGateway] Direct variant checkout fallback:', e.message);
    }
  }

  const checkoutUrl = variantId 
    ? `https://jay-app.lemonsqueezy.com/checkout/buy/${variantId}` 
    : (STORE_URL + '?checkout[custom][doc_id]=' + encodeURIComponent(data.docId || 'ldoc_doc'));
  return {
    ok: true,
    provider: 'lemonsqueezy',
    store_id: LEMON_SQUEEZY_STORE_ID,
    checkout_url: checkoutUrl,
    session_id: 'ls_' + crypto.randomBytes(16).toString('hex')
  };
}

function verifyLemonWebhookSignature(rawBody, signatureHeader) {
  if (!signatureHeader || !LEMON_SQUEEZY_WEBHOOK_SECRET) return false;
  const hmac = crypto.createHmac('sha256', LEMON_SQUEEZY_WEBHOOK_SECRET);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const signature = Buffer.from(signatureHeader, 'utf8');
  if (digest.length !== signature.length) return false;
  return crypto.timingSafeEqual(digest, signature);
}

function handleLemonWebhook(eventBody, signatureHeader) {
  const eventName = (eventBody && eventBody.meta && eventBody.meta.event_name) || (eventBody && eventBody.event_name) || 'order_created';
  const customerEmail = (eventBody && eventBody.data && eventBody.data.attributes && eventBody.data.attributes.user_email) || (eventBody && eventBody.email) || 'customer@example.com';
  const licenseKey = generateLicenseKey('LDOC-LIC');

  return {
    ok: true,
    event: eventName,
    customer_email: customerEmail,
    license_key: licenseKey,
    allocated_at: new Date().toISOString()
  };
}

module.exports = {
  createLemonCheckoutSession,
  verifyLemonWebhookSignature,
  handleLemonWebhook,
  generateLicenseKey,
  LEMON_SQUEEZY_STORE_ID,
  STORE_URL
};
