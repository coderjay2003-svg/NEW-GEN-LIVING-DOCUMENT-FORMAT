// Enterprise VIP Lead Capture & Real-Time Gmail SMTP Dispatch Engine
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const tls = require('tls');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'jayaramankalidasan@gmail.com';
const GMAIL_USER = process.env.GMAIL_USER || 'jayaramankalidasan@gmail.com';
const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
const LEADS_STORE_PATH = path.join(__dirname, 'data', 'leads.json');

/**
 * Sends real email via native Node TLS to Gmail SMTP (smtp.gmail.com:465)
 */
function sendEmailViaGmail({ to, subject, text }) {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return Promise.resolve({ ok: false, reason: 'Missing credentials' });
  }

  return new Promise((resolve) => {
    const socket = tls.connect(465, 'smtp.gmail.com', { rejectUnauthorized: false }, () => {
      let step = 0;

      socket.on('data', chunk => {
        const res = chunk.toString();

        if (step === 0 && res.startsWith('220')) {
          socket.write('EHLO ldoc-studio.com\r\n');
          step = 1;
        } else if (step === 1 && res.includes('250')) {
          socket.write('AUTH LOGIN\r\n');
          step = 2;
        } else if (step === 2 && res.startsWith('334')) {
          socket.write(Buffer.from(GMAIL_USER).toString('base64') + '\r\n');
          step = 3;
        } else if (step === 3 && res.startsWith('334')) {
          socket.write(Buffer.from(GMAIL_APP_PASSWORD).toString('base64') + '\r\n');
          step = 4;
        } else if (step === 4 && res.startsWith('235')) {
          socket.write('MAIL FROM:<' + GMAIL_USER + '>\r\n');
          step = 5;
        } else if (step === 5 && res.startsWith('250')) {
          socket.write('RCPT TO:<' + to + '>\r\n');
          step = 6;
        } else if (step === 6 && res.startsWith('250')) {
          socket.write('DATA\r\n');
          step = 7;
        } else if (step === 7 && res.startsWith('354')) {
          const msg = 'From: LDOC Studio <' + GMAIL_USER + '>\r\n' +
                      'To: <' + to + '>\r\n' +
                      'Subject: ' + subject + '\r\n' +
                      'Content-Type: text/plain; charset=utf-8\r\n\r\n' +
                      text + '\r\n.\r\n';
          socket.write(msg);
          step = 8;
        } else if (step === 8 && res.startsWith('250')) {
          socket.write('QUIT\r\n');
          resolve({ ok: true });
        } else if (res.startsWith('4') || res.startsWith('5')) {
          console.warn('[LeadRouter] SMTP Response warning:', res.trim());
          resolve({ ok: false, error: res.trim() });
        }
      });
    });

    socket.on('error', err => {
      console.warn('[LeadRouter] SMTP Socket error:', err.message);
      resolve({ ok: false, error: err.message });
    });

    socket.setTimeout(8000, () => {
      socket.destroy();
      resolve({ ok: false, error: 'Timeout' });
    });
  });
}

/**
 * Ingests VIP interest form submission and routes to administrator email
 */
async function captureLead(leadData) {
  const leadId = 'lead_' + crypto.randomBytes(8).toString('hex');
  const timestamp = new Date().toISOString();

  const record = {
    id: leadId,
    name: (leadData.name || leadData.fullName || 'Enterprise Lead').trim(),
    email: (leadData.email || '').trim().toLowerCase(),
    platform: leadData.platform || 'Windows 11 / macOS / Linux',
    interest_tier: leadData.tier || leadData.edition || 'LDOC Studio Pro Creator',
    source_campaign: leadData.campaign || 'LDOC Studio Official Portal',
    message: leadData.message || 'Enterprise & SDK Access Inquiry',
    routed_to: ADMIN_EMAIL,
    captured_at: timestamp
  };

  if (!record.email || !record.email.includes('@')) {
    throw new Error('Valid subscriber email address is required.');
  }

  // 1. Persist lead record securely
  try {
    let existing = [];
    if (fs.existsSync(LEADS_STORE_PATH)) {
      existing = JSON.parse(fs.readFileSync(LEADS_STORE_PATH, 'utf8') || '[]');
    }
    existing.unshift(record);
    if (existing.length > 5000) existing = existing.slice(0, 5000);
    fs.writeFileSync(LEADS_STORE_PATH, JSON.stringify(existing, null, 2), 'utf8');
  } catch (err) {
    console.warn('[LeadRouter] Storage write fallback:', err.message);
  }

  // 2. Dispatch real email notification via Gmail SMTP
  const emailBody = `🚀 NEW ENTERPRISE LEAD / INQUIRY ON LDOC STUDIO\n\n` +
                    `Lead ID: ${record.id}\n` +
                    `Subscriber Name: ${record.name}\n` +
                    `Subscriber Email: ${record.email}\n` +
                    `Campaign: ${record.source_campaign}\n` +
                    `Tier / Edition: ${record.interest_tier}\n` +
                    `Hardware: ${record.platform}\n` +
                    `Message: ${record.message}\n` +
                    `Timestamp: ${record.captured_at}\n\n` +
                    `This lead was automatically captured and processed by LDOC Studio Cloud Engine.`;

  const mailRes = await sendEmailViaGmail({
    to: ADMIN_EMAIL,
    subject: `🌟 [LDOC Lead] ${record.name} (${record.interest_tier})`,
    text: emailBody
  });

  return {
    ok: true,
    lead_id: leadId,
    subscriber_email: record.email,
    routed_to: ADMIN_EMAIL,
    mail_dispatched: mailRes.ok,
    status: 'captured_and_routed',
    confirmation_message: `VIP interest confirmed. Routed to ${ADMIN_EMAIL}`
  };
}

module.exports = {
  captureLead,
  sendEmailViaGmail,
  ADMIN_EMAIL
};
