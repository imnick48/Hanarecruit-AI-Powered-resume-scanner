const pool = require("../config/db");
const fs = require("fs");
const { calculateScore } = require("../services/scoring.service");
const { PDFParse } = require("pdf-parse");
const submitApplication = async (req, res) => {
  const { name, email, reason } = req.body;
  const { linkId } = req.params;
  try {
    const jobResult = await pool.query(
      "SELECT * FROM jobs WHERE link_id = $1",
      [linkId],
    );
    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    const job = jobResult.rows[0];
    let resumeText = "";
    let resumePath = null;
    if (req.file) {
      resumePath = req.file.path;
      // Parse PDF text using pdf-parse
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        const parser = new PDFParse({
          data: fileBuffer,
        });
        const pdfData = await parser.getText();
        resumeText = pdfData.text;
      } catch (pdfErr) {
        console.error("PDF parse error:", pdfErr);
        // Resume text stays empty; file is still saved on disk
      }
    }
    await pool.query(
      "INSERT INTO applications (job_id, name, email, reason, resume_text, resume_path) VALUES ($1, $2, $3, $4, $5, $6)",
      [job.id, name, email, reason, resumeText, resumePath],
    );
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error("Submit application error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
const getApplications = async (req, res) => {
  const { jobId } = req.params;
  try {
    const jobCheck = await pool.query(
      "SELECT * FROM jobs WHERE id = $1 AND recruiter_id = $2",
      [jobId, req.user.id],
    );
    if (jobCheck.rows.length === 0) {
      return res.status(403).json({ error: "Access denied" });
    }
    const result = await pool.query(
      "SELECT id, name, email, reason, score, ai_suggestion, created_at FROM applications WHERE job_id = $1 ORDER BY created_at DESC",
      [jobId],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
// Call OpenRouter to generate a suggestion for a single applicant's resume
async function getAISuggestion(resumeText, jobDescription) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo";
  if (!apiKey || apiKey === "your_openrouter_api_key_here") {
    return "Configure OPENROUTER_API_KEY in .env to enable AI suggestions.";
  }
  const prompt = `You are a recruitment assistant. Given the job description and applicant's resume text, provide ONE concise, actionable suggestion (max 2 sentences) to improve the resume's relevance to the job.
Job Description:
${jobDescription.substring(0, 500)}
Resume Text:
${resumeText.substring(0, 1000)}
Suggestion:`;
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "RScann Recruitment",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      },
    );
    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter error:", err);
      return "Could not generate suggestion at this time.";
    }
    const data = await response.json();
    console.log("OpenRouter response:", JSON.stringify(data, null, 2));
    const message = data.choices?.[0]?.message;
    let content = message?.content;
    // Some models return content as an array of content blocks
    if (Array.isArray(content)) {
      content = content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join(" ")
        .trim();
    } else if (typeof content === "string") {
      content = content.trim();
    }
    console.log("Extracted suggestion:", content);
    return content || "No suggestion generated.";
  } catch (err) {
    console.error("AI suggestion fetch error:", err);
    return "Could not generate suggestion at this time.";
  }
}
const rankApplications = async (req, res) => {
  const { jobId } = req.params;
  try {
    const jobCheck = await pool.query(
      "SELECT * FROM jobs WHERE id = $1 AND recruiter_id = $2",
      [jobId, req.user.id],
    );
    if (jobCheck.rows.length === 0) {
      return res.status(403).json({ error: "Access denied" });
    }
    const job = jobCheck.rows[0];
    const applications = await pool.query(
      "SELECT * FROM applications WHERE job_id = $1",
      [jobId],
    );
    // Score all applicants
    for (const application of applications.rows) {
      const score = calculateScore(
        application.resume_text || "",
        job.description,
      );
      await pool.query("UPDATE applications SET score = $1 WHERE id = $2", [
        score,
        application.id,
      ]);
    }
    // Fetch ranked list
    const rankedResult = await pool.query(
      "SELECT id, name, email, reason, score, resume_text, created_at FROM applications WHERE job_id = $1 ORDER BY score DESC",
      [jobId],
    );
    // Generate AI suggestions in parallel and persist each one to the DB
    const suggestionPromises = rankedResult.rows.map(async (app) => {
      const suggestion = await getAISuggestion(
        app.resume_text || "",
        job.description,
      );
      await pool.query(
        "UPDATE applications SET ai_suggestion = $1 WHERE id = $2",
        [suggestion, app.id],
      );
      app.ai_suggestion = suggestion;
    });
    await Promise.all(suggestionPromises);
    // Build suggestions map and strip resume_text from response
    const suggestionsMap = {};
    const rows = rankedResult.rows.map(({ resume_text, ...rest }) => {
      suggestionsMap[rest.id] = rest.ai_suggestion || null;
      return rest;
    });
    res.json({ ranked: rows, suggestions: suggestionsMap });
  } catch (err) {
    console.error("Rank applications error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = { submitApplication, getApplications, rankApplications };
