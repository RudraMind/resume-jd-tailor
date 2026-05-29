const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/gi,
  /disregard\s+(all\s+)?above/gi,
  /forget\s+(everything|all)/gi,
  /new\s+instructions?:/gi,
  /system\s*:/gi,
  /<\s*\/?\s*system\s*>/gi,
  /\[\s*INST\s*\]/gi,
  /\[\s*\/\s*INST\s*\]/gi,
];

export function sanitizeInput(text) {
  let sanitized = text;
  for (const pattern of INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }
  return sanitized;
}

export const TRUTHFULNESS_RULES = {
  nudge: `TRUTHFULNESS RULES (VIOLATIONS HARM THE CANDIDATE):
1. Do NOT add any skill, tool, technology, or certification not explicitly in the original resume.
2. Do NOT invent numeric achievements unless they exist in the original.
3. Do NOT add company names, product names, or technical terms not in the original.
4. Do NOT upgrade experience level (e.g. Junior to Senior).
5. Do NOT add languages, frameworks, or platforms the candidate has not used.
6. Do NOT change employment dates. Copy date ranges exactly as written.
7. Do NOT add new bullet points. Only rephrase existing content.
8. Preserve factual accuracy. Only use information the candidate provided.
9. NEVER remove existing skills, certifications, languages, or awards. You may reorder them.`,

  keywords: `TRUTHFULNESS RULES (VIOLATIONS HARM THE CANDIDATE):
1. Do NOT add any skill, tool, technology, or certification not explicitly in the original resume.
2. Do NOT invent numeric achievements unless they exist in the original.
3. Do NOT add company names, product names, or technical terms not in the original.
4. Do NOT upgrade experience level (e.g. Junior to Senior).
5. Do NOT add languages, frameworks, or platforms the candidate has not used.
6. Do NOT change employment dates. Copy date ranges exactly as written.
7. You may rephrase existing bullet points to include JD keywords, but do NOT add new bullet points.
8. Preserve factual accuracy. Only use information the candidate provided.
9. NEVER remove existing skills, certifications, languages, or awards. You may reorder them.`,

  full: `TRUTHFULNESS RULES (VIOLATIONS HARM THE CANDIDATE):
1. Do NOT add any skill, tool, technology, or certification not explicitly in the original resume.
2. Do NOT invent numeric achievements unless they exist in the original.
3. Do NOT add company names, product names, or technical terms not in the original.
4. Do NOT upgrade experience level (e.g. Junior to Senior).
5. Do NOT add languages, frameworks, or platforms the candidate has not used.
6. Do NOT change employment dates. Copy date ranges exactly as written.
7. You may expand existing bullets or add new ones that elaborate on existing work, but do NOT invent new responsibilities.
8. Preserve factual accuracy. Only use information the candidate provided.
9. NEVER remove existing skills, certifications, languages, or awards. You may reorder them.`,
};

const MAX_INPUT_CHARS = 15000;

export function truncateIfNeeded(text, label = 'input') {
  if (text.length <= MAX_INPUT_CHARS) return { text, truncated: false };
  console.warn(`${label} truncated from ${text.length} to ${MAX_INPUT_CHARS} chars`);
  return { text: text.slice(0, MAX_INPUT_CHARS), truncated: true };
}
