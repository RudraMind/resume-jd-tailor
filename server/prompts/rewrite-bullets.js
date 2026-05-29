import { TRUTHFULNESS_RULES } from './truthfulness.js';

const REWRITE_SYSTEM = (intensity) => `You are a professional resume writer. You tailor resumes for specific job descriptions.
You NEVER fabricate experience. You ONLY work with what the candidate actually has.
Do not use em-dashes. Do not use AI buzzwords like "spearheaded", "leveraged", "orchestrated".
Output ONLY a valid JSON object. No markdown, no backticks, no explanation.`;

const INTENSITY_INSTRUCTIONS = {
  nudge: `TAILORING MODE: Light Nudge
- Make minimal edits where there is a clear existing match to the JD
- Only rephrase. Do NOT add new bullet points.
- Do NOT introduce keywords the resume does not already support.
- Preserve the candidate's original voice and structure.`,

  keywords: `TAILORING MODE: Keyword Enhance
- Weave JD keywords into existing bullet points where the resume content supports them.
- Rephrase bullets to include keyword phrasing naturally.
- Do NOT add new bullet points.
- Do NOT introduce skills or tools not already in the resume.`,

  full: `TAILORING MODE: Full Tailor
- Comprehensive rewrite of bullet points to maximize JD alignment.
- You may add new bullets that elaborate on EXISTING work (not invent new work).
- You may restructure bullets for better impact.
- Still do NOT fabricate new skills, metrics, or responsibilities.`,
};

export { REWRITE_SYSTEM };

export const REWRITE_BULLETS_USER = (resume, jd, jdAnalysis, matchResult, intensity, criticFeedback = null) => {
  let prompt = `${INTENSITY_INSTRUCTIONS[intensity]}

${TRUTHFULNESS_RULES[intensity]}

RESUME:
${resume}

JOB DESCRIPTION:
${jd}

JD ANALYSIS:
${JSON.stringify(jdAnalysis, null, 2)}

MATCH ANALYSIS:
${JSON.stringify(matchResult, null, 2)}`;

  if (criticFeedback) {
    prompt += `

CRITIC FEEDBACK FROM PREVIOUS ATTEMPT (address these issues):
${JSON.stringify(criticFeedback, null, 2)}`;
  }

  prompt += `

Return this exact JSON:
{
  "rewritten_bullets": [
    {
      "id": "exp_0_bullet_0",
      "section": "work_experience or projects or education",
      "entry_index": 0,
      "bullet_index": 0,
      "original": "exact original text",
      "rewritten": "improved text",
      "changes_made": "what changed and why",
      "keywords_added": ["list of JD keywords woven in"]
    }
  ],
  "keywords_successfully_added": ["all keywords that made it into rewrites"],
  "keywords_not_added": ["keywords that could not be added honestly"],
  "keywords_not_added_reason": "why these could not be added"
}`;

  return prompt;
};
