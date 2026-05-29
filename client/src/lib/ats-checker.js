export function checkATSCompatibility(resumeText) {
  const issues = [];
  const passes = [];

  const standardSections = {
    experience: /\b(professional\s+|work\s+)?experience\b/i,
    education: /\beducation\b/i,
    skills: /\b(technical\s+)?skills\b/i,
    summary: /\b(professional\s+)?summary\b/i,
  };

  for (const [name, pattern] of Object.entries(standardSections)) {
    if (pattern.test(resumeText)) {
      passes.push({ category: 'headers', message: `"${name}" section found` });
    } else {
      issues.push({
        severity: name === 'experience' ? 'error' : 'warning',
        category: 'headers',
        message: `No "${name}" section header detected. ATS may not parse this correctly.`,
        fix: `Add a standard "${name}" section header.`,
      });
    }
  }

  const badHeaders = [
    { pattern: /my journey/i, replace: 'Work Experience' },
    { pattern: /what i bring/i, replace: 'Skills' },
    { pattern: /academic pursuits/i, replace: 'Education' },
    { pattern: /core competencies/i, replace: 'Skills' },
    { pattern: /where i'?ve been/i, replace: 'Work Experience' },
  ];
  for (const { pattern, replace } of badHeaders) {
    if (pattern.test(resumeText)) {
      issues.push({
        severity: 'warning',
        category: 'headers',
        message: `Non-standard header "${resumeText.match(pattern)?.[0]}" found.`,
        fix: `Replace with "${replace}" for ATS compatibility.`,
      });
    }
  }

  if (/[\w.-]+@[\w.-]+\.\w{2,}/.test(resumeText)) {
    passes.push({ category: 'contact', message: 'Email address found' });
  } else {
    issues.push({ severity: 'error', category: 'contact', message: 'No email address detected.', fix: 'Add your email address to the top of the resume.' });
  }

  if (/[\(]?\d{3}[\)]?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText)) {
    passes.push({ category: 'contact', message: 'Phone number found' });
  } else {
    issues.push({ severity: 'warning', category: 'contact', message: 'No phone number detected.', fix: 'Add a phone number.' });
  }

  const formats = [];
  if (/\d{2}\/\d{4}/.test(resumeText)) formats.push('MM/YYYY');
  if (/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4}/i.test(resumeText)) formats.push('Month YYYY');
  if (/\d{4}\s*[-–]\s*\d{4}/.test(resumeText)) formats.push('YYYY-YYYY');
  if (formats.length > 2) {
    issues.push({ severity: 'warning', category: 'formatting', message: `Mixed date formats (${formats.join(', ')}). Use one consistent format.`, fix: 'Standardize all dates to the same format (e.g. "Jan 2020 - Present").' });
  }

  const specialCount = (resumeText.match(/[^\x00-\x7F]/g) || []).length;
  if (specialCount > 10) {
    issues.push({ severity: 'warning', category: 'formatting', message: `${specialCount} non-ASCII characters found. Some ATS systems cannot process these.`, fix: 'Replace special characters with ASCII equivalents.' });
  }

  const words = resumeText.split(/\s+/).filter(Boolean).length;
  if (words < 150) {
    issues.push({ severity: 'warning', category: 'content', message: `Resume is short (${words} words). Most effective resumes are 400-800 words.`, fix: 'Add more detail to work experience and projects.' });
  } else if (words > 1200) {
    issues.push({ severity: 'info', category: 'content', message: `Resume is ${words} words. Consider condensing to under 2 pages.`, fix: 'Remove older or less relevant experience.' });
  } else {
    passes.push({ category: 'content', message: `Good length (${words} words)` });
  }

  const errors = issues.filter(i => i.severity === 'error').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;
  const score = Math.max(0, Math.min(100, 100 - (errors * 15) - (warnings * 5)));

  return { score, issues, passes };
}
