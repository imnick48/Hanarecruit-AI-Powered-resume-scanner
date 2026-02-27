const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const jobRoutes = require("./routes/jobs.routes");
const applicationRoutes = require("./routes/applications.routes");
const resumeRoutes = require("./routes/resume.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resume", resumeRoutes);

module.exports = app;
