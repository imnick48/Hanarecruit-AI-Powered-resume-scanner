const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const register = async (req, res) => {
  const { organizationName, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO recruiters (organization_name, email, password) VALUES ($1, $2, $3) RETURNING id",
      [organizationName, email, hashedPassword],
    );
    res
      .status(201)
      .json({ message: "Recruiter created", id: result.rows[0].id });
  } catch (err) {
    console.error("Register error:", err);
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error", detail: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM recruiters WHERE email = $1",
      [email],
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const recruiter = result.rows[0];
    const validPassword = await bcrypt.compare(password, recruiter.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: recruiter.id, email: recruiter.email },
      process.env.JWT_SECRET,
    );
    res.json({
      token,
      recruiter: {
        id: recruiter.id,
        email: recruiter.email,
        organizationName: recruiter.organization_name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
};

module.exports = { register, login };
