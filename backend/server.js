// Secure Cloud Backend Engine for LDOC Ecosystem
// Enforces Two-Tier Split Model, Database CRUD, Auth, AI Proxy, and Proprietary Endpoints

const http = require('http');
const url = require('url');
const crypto = require('crypto');

const db = require('./db');
const { register, login, verifyToken } = require('./auth_service');
const { executeAiChatProxy } = require('./ai_proxy');
const { optimizeMesh } = require('./draco_optimizer');
const { createCheckoutSession, handleWebhookEvent } = require('./stripe_gateway');
const { createLemonCheckoutSession, verifyLemonWebhookSignature, handleLemonWebhook } = require('./lemon_gateway');
const { sendEmailViaGmail } = require('./lead_router');
const { captureLead, ADMIN_EMAIL } = require('./lead_router');
const verifyLicenseHandler = require('./handlers/license/verify');
const { renderHeadlessPdf } = require('./pdf_flattener');
const { validateLdocxSpec, convertToLdocx, SCHEMA_VERSION } = require('./schema_validator');
const { generatePackageManifest, verifyPackageManifest } = require('./package_signer');

const PORT = process.env.PORT || 8080;
const ALLOWED_ORIGINS = (process.env.LDOC_ALLOWED_ORIGINS || 'https://ldoc-studios.vercel.app,https://jayaraman2212066.github.io,http://localhost:3000,http://localhost:8080,http://localhost:8085').split(',');

const RATE_LIMIT_STORE = new Map();
function checkRateLimit(ip, limit = 60, windowMs = 60000) {
  const now = Date.now();
  const entry = RATE_LIMIT_STORE.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count++;
  RATE_LIMIT_STORE.set(ip, entry);
  return entry.count <= limit;
}


function handleCors(req, res) {
  const origin = req.headers['origin'];
  if (origin && ALLOWED_ORIGINS.some(o => o === '*' || origin.includes(o.trim()))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 25 * 1024 * 1024) {
        req.connection.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        resolve({ raw: body });
      }
    });
    req.on('error', reject);
  });
}

function authenticateUser(req) {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    return verifyToken(authHeader.slice(7));
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  handleCors(req, res);
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const isHeavy = req.url.includes('optimize-model') || req.url.includes('export/pdf');
  if (!checkRateLimit(clientIp, isHeavy ? 10 : 100)) {
    res.writeHead(429, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Too Many Requests', message: 'Rate limit exceeded. Please retry later.' }));
  }
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname.replace(/\/$/, '');
  const user = authenticateUser(req);

  try {
    // ── HEALTH & STATUS ─────────────────────────────────────────────────────
    if (pathname === '/api/health' || pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        status: 'online',
        service: 'LDOC Full-Stack Enterprise Cloud Engine',
        schema_version: SCHEMA_VERSION,
        admin_routing: ADMIN_EMAIL,
        database: 'Universal Dual-Mode (Postgres/Local DB Active)',
        timestamp: new Date().toISOString()
      }));
    }

    // ── AUTHENTICATION ──────────────────────────────────────────────────────
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const regRes = await register(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(regRes));
    }

    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const loginRes = await login(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(loginRes));
    }

    if (pathname === '/api/auth/me' && req.method === 'GET') {
      if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Unauthorized' }));
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true, user }));
    }

    // ── DOCUMENTS CRUD & AUTO-SAVE ──────────────────────────────────────────
    if (pathname === '/api/documents' && req.method === 'GET') {
      const docs = await db.documents.listByUser(user?.id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(docs));
    }

    if (pathname === '/api/documents' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const doc = await db.documents.create({ ...body, user_id: user?.id || 'anonymous' });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(doc));
    }

    // Document by ID: /api/documents/:id
    const docMatch = pathname.match(/^\/api\/documents\/([^\/]+)$/);
    if (docMatch) {
      const docId = docMatch[1];
      if (req.method === 'GET') {
        const doc = await db.documents.findById(docId);
        if (!doc) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Document not found' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(doc));
      } else if (req.method === 'PUT' || req.method === 'POST') {
        const body = await parseJsonBody(req);
        const updated = await db.documents.update(docId, body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(updated));
      } else if (req.method === 'DELETE') {
        await db.documents.delete(docId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: true, deleted: docId }));
      }
    }

    // Document Versions: /api/documents/:id/versions
    const versionsMatch = pathname.match(/^\/api\/documents\/([^\/]+)\/versions$/);
    if (versionsMatch && req.method === 'GET') {
      const docId = versionsMatch[1];
      const versions = await db.document_versions.listByDocumentId(docId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(versions));
    }

    // Restore Version: /api/documents/:id/restore
    const restoreMatch = pathname.match(/^\/api\/documents\/([^\/]+)\/restore$/);
    if (restoreMatch && req.method === 'POST') {
      const docId = restoreMatch[1];
      const body = await parseJsonBody(req);
      const version = await db.document_versions.findById(body.version_id);
      if (!version) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Version not found' }));
      }
      const restoredDoc = await db.documents.update(docId, {
        ast: version.ast,
        summary: `Restored to Revision v${version.version_num}`
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(restoredDoc));
    }

    // ── TEMPLATES GALLERY & BLUEPRINTS ──────────────────────────────────────
    if (pathname === '/api/templates' && req.method === 'GET') {
      const templates = await db.templates.listAll();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(templates));
    }

    const tmplCloneMatch = pathname.match(/^\/api\/templates\/([^\/]+)\/clone$/);
    if (tmplCloneMatch && req.method === 'POST') {
      const tmplId = tmplCloneMatch[1];
      const template = await db.templates.findById(tmplId);
      if (!template) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Template not found' }));
      }
      const cloned = await db.documents.create({
        user_id: user?.id || 'anonymous',
        title: `${template.title} (Clone)`,
        ast: template.ast
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(cloned));
    }

    // ── SERVER-SIDE AI COPILOT PROXY ────────────────────────────────────────
    if (pathname === '/api/ai/chat' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const aiResult = await executeAiChatProxy(body, user);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(aiResult));
    }

    // ── PROPRIETARY SERVICES (3D, Stripe, Leads, PDF, Schema) ────────────────
    if (pathname === '/api/optimize-model' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = optimizeMesh(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    }

    if (pathname === '/api/checkout/create-session' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const isLemon = (process.env.PAYMENT_PROVIDER || 'lemonsqueezy') === 'lemonsqueezy';
      const session = isLemon ? await createLemonCheckoutSession(body) : await createCheckoutSession(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(session));
    }

    if (pathname === '/api/checkout/webhook' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const lemonSig = req.headers['x-signature'];
      const stripeSig = req.headers['stripe-signature'];

      let webhookRes;
      if (lemonSig || (process.env.PAYMENT_PROVIDER || 'lemonsqueezy') === 'lemonsqueezy') {
        webhookRes = handleLemonWebhook(body, lemonSig);
      } else {
        webhookRes = handleWebhookEvent(body, stripeSig);
      }

      // Dispatch real email alert to owner on purchase
      if (webhookRes && webhookRes.customer_email) {
        sendEmailViaGmail({
          to: ADMIN_EMAIL,
          subject: `💰 [LDOC Sale / Order] ${webhookRes.license_key}`,
          text: `New order completed!\nCustomer: ${webhookRes.customer_email}\nLicense: ${webhookRes.license_key}\nPlatform: Lemon Squeezy`
        }).catch(() => {});
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(webhookRes));
    }

    if (pathname === '/api/license/verify') {
      return verifyLicenseHandler(req, res);
    }

    if (pathname === '/api/leads/capture' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const leadResult = await captureLead(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(leadResult));
    }

    if (pathname === '/api/export/pdf' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const pdfBuffer = renderHeadlessPdf(body);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${(body.title || 'document').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf"`,
        'Content-Length': pdfBuffer.length
      });
      return res.end(pdfBuffer);
    }

    if (pathname === '/api/validate' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const valResult = validateLdocxSpec(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(valResult));
    }

    if (pathname === '/api/convert' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const content = body.content || body.raw || '';
      const format = body.format || 'markdown';
      const converted = convertToLdocx(content, format);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(converted));
    }

    if (pathname === '/api/verify-package' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const verification = verifyPackageManifest(body.manifest || body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(verification));
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint Not Found', pathname }));
  } catch (err) {
    console.error('[ServerError]', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚡ LDOC Studio Full-Stack Cloud Server online on port ${PORT}`);
  console.log(`🔒 Endpoints: Auth, Documents CRUD, Versions, Templates, AI Proxy`);
  console.log(`=======================================================`);
});

module.exports = server;
