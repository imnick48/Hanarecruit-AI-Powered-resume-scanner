const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");

const createJob = async (req, res) => {
  const { title, description } = req.body;
  const linkId = uuidv4();
  try {
    const result = await pool.query(
      "INSERT INTO jobs (title, description, link_id, recruiter_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, linkId, req.user.id],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getJobs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM jobs WHERE recruiter_id = $1 ORDER BY created_at DESC",
      [req.user.id],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getJobByLinkId = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jobs WHERE link_id = $1", [
      req.params.linkId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createJob, getJobs, getJobByLinkId };
