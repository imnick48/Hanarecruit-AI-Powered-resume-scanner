const pool = require('../config/db');
const path = require('path');

const getResume = async (req, res) => {
  const { appId } = req.params;
  try {
    const result = await pool.query(
      `SELECT a.resume_path, a.resume_pdf, j.recruiter_id 
       FROM applications a 
       JOIN jobs j ON a.job_id = j.id 
       WHERE a.id = $1`,
      [appId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    if (result.rows[0].recruiter_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const row = result.rows[0];

    // Prefer disk-based file (new uploads)
    if (row.resume_path) {
      const absPath = path.resolve(row.resume_path);
      return res.sendFile(absPath, { headers: { 'Content-Type': 'application/pdf' } });
    }

    // Fall back to binary blob stored in DB (old submissions)
    if (row.resume_pdf) {
      res.setHeader('Content-Type', 'application/pdf');
      return res.send(row.resume_pdf);
    }

    return res.status(404).json({ error: 'No resume found for this application' });
  } catch (err) {
    console.error('Get resume error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getResume };
