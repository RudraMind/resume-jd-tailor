export const JD_ANALYSIS_SYSTEM = `You are a job description analyst. Extract structured requirements from job descriptions.
Output ONLY a valid JSON object. No markdown, no backticks, no explanation text.`;

export const JD_ANALYSIS_USER = (jdText) => `Analyze this job description and extract the structured data below.

JOB DESCRIPTION:
${jdText}

Return this exact JSON structure:
{
  "company_name": "string or null if not found",
  "role_title": "string",
  "seniority_level": "entry | mid | senior | lead | staff",
  "top_keywords": ["8-15 most critical terms from the JD"],
  "required_skills": ["skills explicitly marked required or must-have"],
  "preferred_skills": ["skills marked preferred, nice-to-have, or bonus"],
  "key_responsibilities": ["each major responsibility as a short sentence"],
  "tools_and_technologies": ["specific tools, platforms, frameworks, languages mentioned"],
  "experience_years": null or number (extract from phrases like '3+ years'),
  "education_requirements": ["degree requirements if stated"]
}`;
