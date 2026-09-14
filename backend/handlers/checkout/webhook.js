const { handleLemonWebhook } = require('../../lemon_gateway');
const { handleWebhookEvent } = require('../../stripe_gateway');
const { sendEmailViaGmail, ADMIN_EMAIL } = require('../../lead_router');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-signature, stripe-signature');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const lemonSig = req.headers['x-signature'];
    const stripeSig = req.headers['stripe-signature'];

    let webhookRes;
    if (lemonSig || (process.env.PAYMENT_PROVIDER || 'lemonsqueezy') === 'lemonsqueezy') {
      webhookRes = handleLemonWebhook(body, lemonSig);
    } else {
      webhookRes = handleWebhookEvent(body, stripeSig);
    }

    if (webhookRes && webhookRes.customer_email) {
      sendEmailViaGmail({
        to: ADMIN_EMAIL,
        subject: `💰 [LDOC Sale / Order] ${webhookRes.license_key}`,
        text: `New order completed!\nCustomer: ${webhookRes.customer_email}\nLicense: ${webhookRes.license_key}\nPlatform: Lemon Squeezy`
      }).catch(() => {});
    }

    return res.status(200).json(webhookRes);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
