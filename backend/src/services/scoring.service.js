function extractSection(text, sectionName) {
  const terminators =
    "EDUCATION|EXPERIENCE|PROJECTS|SKILLS|SUMMARY|WORK|LANGUAGES|CERTIFICATIONS|ACHIEVEMENTS|INTERESTS";
  const patterns = [
    new RegExp(`${sectionName}[\\s\\S]*?(?=(?:${terminators}|$))`, "i"),
    new RegExp(`(?<=${sectionName})[\\s\\S]*?(?=(?:${terminators}|$))`, "i"),
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }
  return "";
}

function calculateScore(resumeText, jobDescription) {
  let score = 0;

  // Keyword match (up to 40pts)
  const jdKeywords = jobDescription.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const resumeLower = resumeText.toLowerCase();
  const keywordMatches = jdKeywords.filter((kw) =>
    resumeLower.includes(kw),
  ).length;
  score += Math.min((keywordMatches / Math.max(jdKeywords.length, 1)) * 40, 40);

  // Experience section (up to 35pts)
  const experienceSection = extractSection(
    resumeText,
    "EXPERIENCE|WORK EXPERIENCE|WORK HISTORY|PROFESSIONAL EXPERIENCE",
  );
  if (experienceSection) {
    const yearsMatch = experienceSection.match(/(\d+)\s*\+?\s*years?/i);
    if (yearsMatch) score += Math.min(parseInt(yearsMatch[1]) * 3, 20);
    score += Math.min(experienceSection.length / 50, 15);
  }

  // Projects section (up to 15pts)
  const projectsSection = extractSection(resumeText, "PROJECTS|PROJECT");
  if (projectsSection) {
    const projectCount = (projectsSection.match(/project/gi) || []).length;
    score += Math.min(projectCount * 3, 10);
    score += Math.min(projectsSection.length / 100, 5);
  }

  // Skills section (up to 10pts)
  const skillsSection = extractSection(
    resumeText,
    "SKILLS|TECHNICAL SKILLS|TECHNOLOGIES",
  );
  if (skillsSection) {
    const skills = skillsSection.match(/[,•\n]/g) || [];
    score += Math.min(skills.length, 10);
  }

  return Math.min(Math.round(score), 100);
}

module.exports = { calculateScore };
