import { Router } from 'express';
import { createLLMProvider } from '../llm/index.js';
import { sanitizeInput, truncateIfNeeded } from '../prompts/truthfulness.js';
import { JD_ANALYSIS_SYSTEM, JD_ANALYSIS_USER } from '../prompts/jd-analysis.js';
import { RESUME_MATCH_SYSTEM, RESUME_MATCH_USER } from '../prompts/resume-match.js';
import { REWRITE_SYSTEM, REWRITE_BULLETS_USER } from '../prompts/rewrite-bullets.js';
import { CRITIC_SYSTEM, CRITIC_USER } from '../prompts/critic-review.js';

export const pipelineRouter = Router();
const llm = createLLMProvider();

pipelineRouter.post('/:stepName', async (req, res) => {
  const { stepName } = req.params;

  try {
    let result;

    switch (stepName) {
      case 'jd-analysis': {
        const jd = sanitizeInput(req.body.jd);
        const { text } = truncateIfNeeded(jd, 'JD');
        result = await llm.completeJSON(JD_ANALYSIS_SYSTEM, JD_ANALYSIS_USER(text), { temperature: 0.2 });
        break;
      }

      case 'resume-match': {
        const resume = sanitizeInput(req.body.resume);
        const jd = sanitizeInput(req.body.jd);
        const { text: rText } = truncateIfNeeded(resume, 'Resume');
        const { text: jText } = truncateIfNeeded(jd, 'JD');
        result = await llm.completeJSON(
          RESUME_MATCH_SYSTEM,
          RESUME_MATCH_USER(rText, jText, req.body.jdAnalysis),
          { temperature: 0.2 }
        );
        break;
      }

      case 'rewrite-bullets': {
        const { jdAnalysis, matchResult, intensity, criticFeedback } = req.body;
        const resumeSanitized = sanitizeInput(req.body.resume);
        const jdSanitized = sanitizeInput(req.body.jd);
        const { text: resume } = truncateIfNeeded(resumeSanitized, 'Resume');
        const { text: jd } = truncateIfNeeded(jdSanitized, 'JD');
        const tempMap = { nudge: 0.4, keywords: 0.5, full: 0.6 };
        if (!['nudge', 'keywords', 'full'].includes(intensity)) {
          return res.status(400).json({ success: false, error: `Invalid intensity: ${intensity}. Use nudge, keywords, or full.` });
        }
        result = await llm.completeJSON(
          REWRITE_SYSTEM(intensity),
          REWRITE_BULLETS_USER(resume, jd, jdAnalysis, matchResult, intensity, criticFeedback),
          { temperature: tempMap[intensity], maxTokens: 8192 }
        );
        break;
      }

      case 'critic-review': {
        const { jdAnalysis, matchResult, rewrittenBullets, attempt } = req.body;
        const resumeSanitized = sanitizeInput(req.body.resume);
        const jdSanitized = sanitizeInput(req.body.jd);
        const { text: resume } = truncateIfNeeded(resumeSanitized, 'Resume');
        const { text: jd } = truncateIfNeeded(jdSanitized, 'JD');
        result = await llm.completeJSON(
          CRITIC_SYSTEM,
          CRITIC_USER(resume, jd, jdAnalysis, matchResult, rewrittenBullets, attempt || 1),
          { temperature: 0.3 }
        );
        break;
      }

      default:
        return res.status(400).json({ success: false, error: `Unknown step: ${stepName}` });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error(`Step ${stepName} failed:`, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});
