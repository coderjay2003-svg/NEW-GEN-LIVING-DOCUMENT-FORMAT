// Unified Vercel Serverless API Dispatcher
// Consolidates all endpoints into a single function to comply with Vercel Hobby tier limits (max 12 functions)


const handlers = {
  '/api/health': require('../backend/handlers/health'),
  '/api/validate': require('../backend/handlers/validate'),
  '/api/convert': require('../backend/handlers/convert'),
  '/api/build': require('../backend/handlers/build'),
  '/api/templates': require('../backend/handlers/templates'),
  '/api/optimize-model': require('../backend/handlers/optimize-model'),
  '/api/documents': require('../backend/handlers/documents'),
  '/api/ai/chat': require('../backend/handlers/ai/chat'),
  '/api/auth/login': require('../backend/handlers/auth/login'),
  '/api/auth/register': require('../backend/handlers/auth/register'),
  '/api/auth/me': require('../backend/handlers/auth/me'),
  '/api/checkout/create-session': require('../backend/handlers/checkout/create-session'),
  '/api/checkout/webhook': require('../backend/handlers/checkout/webhook'),
  '/api/export/pdf': require('../backend/handlers/export/pdf'),
  '/api/leads/capture': require('../backend/handlers/leads/capture'),
  '/api/license/verify': require('../backend/handlers/license/verify'),
  '/api/license/generate': require('../backend/handlers/license/generate')
};

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-signature, stripe-signature');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const parsedUrl = new URL(req.url, 'http://localhost');
  const routeParam = parsedUrl.searchParams.get('route');

  let pathname = routeParam ? ('/api/' + routeParam) : (req.headers['x-matched-path'] || parsedUrl.pathname || '');
  pathname = pathname.split('?')[0].replace(/\/+$/, '');

  // 1. Direct match
  if (handlers[pathname]) {
    return handlers[pathname](req, res);
  }

  // 2. Dynamic sub-route match (e.g. /api/documents/:id, /api/documents/:id/restore, etc.)
  if (pathname.startsWith('/api/auth/oauth') || pathname.startsWith('/api/auth/callback')) {
    return require('../backend/handlers/auth/oauth')(req, res);
  }
  if (pathname.startsWith('/api/documents')) {
    return handlers['/api/documents'](req, res);
  }

  // 3. Root fallback
  if (pathname === '' || pathname === '/api') {
    return handlers['/api/health'](req, res);
  }

  res.status(404).json({ error: 'Endpoint not found', path: pathname });
};
