// Endpoint decommissioned for security: Key generation is handled exclusively by Lemon Squeezy Store webhook
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(404).json({ ok: false, error: 'Endpoint decommissioned.' });
};

