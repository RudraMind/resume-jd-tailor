import CopyButton from '../ui/CopyButton.jsx';
import JDAnalysis from './steps/JDAnalysis.jsx';
import ATSCheck from './steps/ATSCheck.jsx';
import ResumeMatch from './steps/ResumeMatch.jsx';
import RewriteBullets from './steps/RewriteBullets.jsx';
import AIPhraseCleanup from './steps/AIPhraseCleanup.jsx';
import CriticReview from './steps/CriticReview.jsx';
import RevisionSummary from './steps/RevisionSummary.jsx';

export default function ResultsView({ outputs, attempt, onReset }) {
  const allText = [
    `JD Analysis: ${outputs.jdAnalysis?.role_title ?? ''} | ${outputs.jdAnalysis?.seniority_level ?? ''} | Keywords: ${outputs.jdAnalysis?.top_keywords?.join(', ') ?? ''}`,
    `ATS Score: ${outputs.atsCheck?.score ?? ''}`,
    `Resume Match Score: ${outputs.resumeMatch?.overall_score ?? ''} — ${outputs.resumeMatch?.summary ?? ''}`,
    `Rewritten Bullets:\n${outputs.rewrittenBullets?.rewritten_bullets?.map(b => b.rewritten).join('\n') ?? ''}`,
    `Critic Score: ${outputs.criticReview?.score ?? ''} — ${outputs.criticReview?.overall_assessment ?? ''}`,
  ].join('\n\n');

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">Copy All Results</span>
        <CopyButton text={allText} />
      </div>
      <JDAnalysis data={outputs.jdAnalysis} />
      <ATSCheck data={outputs.atsCheck} />
      <ResumeMatch data={outputs.resumeMatch} />
      <RewriteBullets data={outputs.rewrittenBullets} />
      <AIPhraseCleanup data={outputs.aiPhraseCleanup} />
      <CriticReview data={outputs.criticReview} attempt={attempt} />
      <RevisionSummary data={outputs.revisionSummary} />

      {onReset && (
        <div className="text-center pt-4">
          <button
            onClick={onReset}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
