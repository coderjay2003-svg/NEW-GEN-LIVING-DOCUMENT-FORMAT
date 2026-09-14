const db = require('../db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const tmpls = await db.templates.listAll();
    return res.status(200).json(tmpls || []);
  } catch (err) {
    return res.status(200).json([
      {
        id: 'tmpl-annual-report',
        title: 'Financial & ESG Annual Living Report',
        category: 'Executive & Financial',
        description: 'Interactive investor report with reactive revenue trajectory chart, dynamic balance sheet, and currency switcher.',
        pages_count: 3,
        is_official: true
      },
      {
        id: 'tmpl-scientific-paper',
        title: 'Quantum Qubit Fidelity Living Paper',
        category: 'Scientific & Academia',
        description: 'Scientific publication with live Python simulation block, 3D WebGL qubit Bloch sphere model, and interactive formulas.',
        pages_count: 3,
        is_official: true
      },
      {
        id: 'tmpl-tech-pitch',
        title: 'Hyperion Series A Dynamic Investor Deck',
        category: 'Investor Pitch & Venture',
        description: 'High-conversion startup deck with live ARR metrics, interactive architecture demo, and 1-click investor commitment form.',
        pages_count: 2,
        is_official: true
      },
      {
        id: 'tmpl-hardware-spec',
        title: 'Autonomous Robotics Architecture Datasheet',
        category: 'Hardware & Engineering',
        description: 'Interactive datasheet featuring 3D exploded chassis CAD model, live sensor telemetry, and dynamic bill of materials.',
        pages_count: 2,
        is_official: true
      }
    ]);
  }
};
