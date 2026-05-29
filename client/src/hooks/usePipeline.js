import { useReducer, useCallback } from 'react';
import { callStep } from '../api.js';
import { checkATSCompatibility } from '../lib/ats-checker.js';
import { cleanAIPhrases } from '../lib/ai-phrase-cleaner.js';

const INITIAL_STATE = {
  status: 'idle',
  currentStep: null,
  attempt: 0,
  inputs: { resume: '', jd: '', intensity: 'keywords', targetRole: '' },
  outputs: {
    jdAnalysis: null,
    atsCheck: null,
    resumeMatch: null,
    rewrittenBullets: null,
    aiPhraseCleanup: null,
    criticReview: null,
    revisionSummary: null,
  },
  bestScore: 0,
  bestOutputs: null,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...INITIAL_STATE, status: 'running', inputs: action.inputs };
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
    case 'SET_OUTPUT':
      return { ...state, outputs: { ...state.outputs, [action.key]: action.value } };
    case 'SET_ATTEMPT':
      return { ...state, attempt: action.attempt, status: action.attempt > 1 ? 'revising' : 'running' };
    case 'COMPLETE':
      return { ...state, status: 'complete', currentStep: null };
    case 'ERROR':
      return { ...state, status: 'error', error: action.error, currentStep: null };
    case 'RESET':
      return INITIAL_STATE;
    default:
      return state;
  }
}

function compileSummary(attempt, outputs) {
  return {
    totalAttempts: attempt,
    scores: [],
    finalScore: outputs.criticReview?.score ?? 0,
    passed: (outputs.criticReview?.score ?? 0) >= 8,
    keyChanges: attempt === 1
      ? ['First-pass score met threshold. No revisions needed.']
      : (outputs.criticReview?.issues?.map(i => i.suggestion) ?? []),
  };
}

export function usePipeline() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const runPipeline = useCallback(async (inputs) => {
    dispatch({ type: 'START', inputs });

    const { resume, jd, intensity } = inputs;
    let attempt = 0;
    let criticFeedback = null;
    let bestScore = 0;
    let bestOutputs = null;

    while (attempt < 3) {
      attempt++;
      dispatch({ type: 'SET_ATTEMPT', attempt });

      let currentStepLocal = null;

      try {
        // Step 1: JD Analysis
        currentStepLocal = 'jd-analysis';
        dispatch({ type: 'SET_STEP', step: currentStepLocal });
        const jdAnalysis = await callStep('jd-analysis', { jd });
        dispatch({ type: 'SET_OUTPUT', key: 'jdAnalysis', value: jdAnalysis });

        // Step 2: ATS Check (local)
        currentStepLocal = 'ats-check';
        dispatch({ type: 'SET_STEP', step: currentStepLocal });
        const atsCheck = checkATSCompatibility(resume);
        dispatch({ type: 'SET_OUTPUT', key: 'atsCheck', value: atsCheck });

        // Step 3: Resume Match
        currentStepLocal = 'resume-match';
        dispatch({ type: 'SET_STEP', step: currentStepLocal });
        const resumeMatch = await callStep('resume-match', { resume, jd, jdAnalysis });
        dispatch({ type: 'SET_OUTPUT', key: 'resumeMatch', value: resumeMatch });

        // Step 4: Rewrite Bullets
        currentStepLocal = 'rewrite-bullets';
        dispatch({ type: 'SET_STEP', step: currentStepLocal });
        const rewrittenBullets = await callStep('rewrite-bullets', {
          resume, jd, jdAnalysis, matchResult: resumeMatch, intensity, criticFeedback,
        });
        dispatch({ type: 'SET_OUTPUT', key: 'rewrittenBullets', value: rewrittenBullets });

        // Step 5: AI Phrase Cleanup (local)
        currentStepLocal = 'ai-phrase-cleanup';
        dispatch({ type: 'SET_STEP', step: currentStepLocal });
        const aiPhraseCleanup = cleanAIPhrases(rewrittenBullets.rewritten_bullets ?? [], jd);
        dispatch({ type: 'SET_OUTPUT', key: 'aiPhraseCleanup', value: aiPhraseCleanup });

        // Step 6: Critic Review
        currentStepLocal = 'critic-review';
        dispatch({ type: 'SET_STEP', step: currentStepLocal });
        const criticReview = await callStep('critic-review', {
          resume, jd, jdAnalysis, matchResult: resumeMatch, rewrittenBullets, attempt,
        });
        dispatch({ type: 'SET_OUTPUT', key: 'criticReview', value: criticReview });

        const currentOutputs = { jdAnalysis, atsCheck, resumeMatch, rewrittenBullets, aiPhraseCleanup, criticReview };

        if (criticReview.score > bestScore) {
          bestScore = criticReview.score;
          bestOutputs = currentOutputs;
        }

        if (criticReview.score >= 8) {
          const summary = compileSummary(attempt, bestOutputs);
          dispatch({ type: 'SET_OUTPUT', key: 'revisionSummary', value: summary });
          dispatch({ type: 'COMPLETE' });
          return;
        }

        criticFeedback = criticReview.issues;

      } catch (err) {
        dispatch({ type: 'ERROR', error: { step: currentStepLocal, message: err.message } });
        return;
      }
    }

    // Max attempts reached — use best result
    if (bestOutputs) {
      for (const [key, value] of Object.entries(bestOutputs)) {
        dispatch({ type: 'SET_OUTPUT', key, value });
      }
    }
    const summary = compileSummary(3, bestOutputs ?? {});
    dispatch({ type: 'SET_OUTPUT', key: 'revisionSummary', value: summary });
    dispatch({ type: 'COMPLETE' });
  }, []);

  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return { state, runPipeline, reset };
}
