const { renderHeadlessPdf } = require('../../pdf_flattener');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const pdfBuf = renderHeadlessPdf(payload);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${(payload.title || 'document').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf"`);
    return res.status(200).send(pdfBuf);
  } catch (err) {
    return res.status(400).json({ error: 'PDF export failed: ' + err.message });
  }
};
