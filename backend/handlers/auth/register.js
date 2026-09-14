const { register } = require('../../auth_service');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const r = await register(body);
    return res.status(200).json(r);
  } catch (err) { return res.status(400).json({ error: err.message }); }
};
