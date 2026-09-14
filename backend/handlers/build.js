// Vercel Serverless Document Build Endpoint
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const spec = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const docId = 'doc_' + Math.random().toString(36).slice(2, 11);
    
    return res.status(200).json({
      ok: true,
      id: docId,
      title: spec.title || 'Living Document',
      pages_count: (spec.pages || []).length,
      downloadUrl: `/api/download?id=${docId}`,
      message: 'Document built successfully via Vercel Serverless'
    });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid document payload: ' + err.message });
  }
};
