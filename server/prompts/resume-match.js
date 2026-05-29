export const RESUME_MATCH_SYSTEM = `You are a technical recruiter scoring a resume against a job description.
Be precise and honest. If a skill is only mentioned as "learning" or "interested in", it does NOT count as a match.
Output ONLY a valid JSON object. No markdown, no backticks, no explanation.`;

export const RESUME_MATCH_USER = (resume, jd, jdAnalysis) => `Score this resume against this job description.

RESUME:
${resume}

JOB DESCRIPTION:
${jd}

JD ANALYSIS (already extracted):
${JSON.stringify(jdAnalysis, null, 2)}

Scoring guidelines:
- Start at 50 (candidate submitted, so baseline credit)
- Each required skill with STRONG evidence: +5
- Each required skill with WEAK evidence (mentioned casually, in learning): +2
- Each preferred skill matched: +3
- Each MISSING required skill: -5
- Each MISSING preferred skill: -2
- Cap at 100, floor at 0

Return this exact JSON:
{
  "overall_score": 0-100,
  "summary": "One paragraph honest assessment. Write like a recruiter's internal note, not a pep talk.",
  "matched_skills": [
    { "skill": "Python", "evidence": "Where in the resume this appears", "strength": "strong or weak" }
  ],
  "weak_skills": [
    { "skill": "Docker", "evidence": "What the resume says", "reason": "Why it counts as weak" }
  ],
  "missing_skills": [
    { "skill": "Kubernetes", "in_jd_as": "required or preferred" }
  ],
  "sections_to_improve": [
    { "section": "Projects", "issue": "What is wrong with this section" }
  ]
}`;
