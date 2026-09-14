const { executeAiChatProxy } = require('../../ai_proxy');
const { verifyToken } = require('../../auth_service');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = req.headers['authorization'] || '';
  const user = auth.startsWith('Bearer ') ? verifyToken(auth.slice(7)) : null;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const r = await executeAiChatProxy(body, user);
    return res.status(200).json(r);
  } catch (err) { return res.status(400).json({ error: err.message }); }
};
