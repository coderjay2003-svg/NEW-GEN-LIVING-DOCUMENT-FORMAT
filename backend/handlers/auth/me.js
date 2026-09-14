const { verifyToken } = require('../../auth_service');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = req.headers['authorization'] || '';
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = verifyToken(auth.slice(7));
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  return res.status(200).json({ ok: true, user });
};
