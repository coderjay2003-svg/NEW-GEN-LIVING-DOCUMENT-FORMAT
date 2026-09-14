// Vercel Serverless Health Check
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  return res.status(200).json({
    status: 'ok',
    service: 'LDOC Studio Serverless Engine',
    version: '2.5.2',
    platform: 'Vercel Edge',
    timestamp: new Date().toISOString()
  });
};
