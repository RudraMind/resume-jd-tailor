import {
  FileSearch,
  ShieldCheck,
  Search,
  Pencil,
  Sparkles,
  MessageCircle,
  CheckCircle,
  XCircle,
  Loader,
} from 'lucide-react';

const STEPS = [
  { key: 'jd-analysis',       label: 'JD Analysis',    Icon: FileSearch },
  { key: 'ats-check',         label: 'ATS Check',       Icon: ShieldCheck },
  { key: 'resume-match',      label: 'Resume Match',    Icon: Search },
  { key: 'rewrite-bullets',   label: 'Rewrite Bullets', Icon: Pencil },
  { key: 'ai-phrase-cleanup', label: 'AI Cleanup',      Icon: Sparkles },
  { key: 'critic-review',     label: 'Critic Review',   Icon: MessageCircle },
];

const LOADING_TEXT = {
  'jd-analysis':       'Analyzing job description...',
  'ats-check':         'Checking ATS compatibility...',
  'resume-match':      'Scoring resume match...',
  'rewrite-bullets':   'Rewriting bullets...',
  'ai-phrase-cleanup': 'Cleaning AI-sounding language...',
  'critic-review':     'Critic agent reviewing output...',
};

const STATUS_BANNER = {
  running:  { bg: 'bg-gradient-to-r from-[#6C3FC5] to-[#3B82F6]', text: 'Running Pipeline...' },
  revising: { bg: 'bg-amber-500',  text: 'Revising — improving quality...' },
  complete: { bg: 'bg-green-600',  text: 'Pipeline Complete' },
  error:    { bg: 'bg-red-600',    text: 'Pipeline Error' },
};

export default function PipelineProgress({ status, currentStep, attempt, error }) {
  const banner = STATUS_BANNER[status] ?? STATUS_BANNER.running;
  const currentIndex = STEPS.findIndex(s => s.key === currentStep);

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      {/* Status banner */}
      <div className={`${banner.bg} px-6 py-2 text-white text-sm font-semibold text-center`}>
        {status === 'revising'
          ? `Revising (attempt ${attempt}/3) — improving quality...`
          : banner.text}
        {error && (
          <span className="ml-2 font-normal opacity-90">— {error.message}</span>
        )}
      </div>

      {/* Step bar */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {STEPS.map((step, i) => {
            const isDone    = i < currentIndex || status === 'complete';
            const isActive  = step.key === currentStep && status !== 'complete';
            const isError   = error?.step === step.key;

            return (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all
                      ${isError  ? 'bg-red-50 border-red-400 text-red-500' :
                        isDone   ? 'bg-green-50 border-green-400 text-green-600' :
                        isActive ? 'bg-blue-50 border-blue-400 text-blue-600 animate-pulse' :
                                   'bg-gray-50 border-gray-200 text-gray-400'}`}
                  >
                    {isError  ? <XCircle size={16} /> :
                     isDone   ? <CheckCircle size={16} /> :
                     isActive ? <Loader size={16} className="animate-spin" /> :
                                <step.Icon size={16} />}
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap
                      ${isDone   ? 'text-green-600' :
                        isActive ? 'text-blue-600'  :
                                   'text-gray-400'}`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 transition-all duration-500
                      ${i < currentIndex || status === 'complete'
                        ? 'bg-green-400'
                        : 'bg-gray-200'}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Loading text */}
        {currentStep && status !== 'complete' && (
          <p className="text-center text-sm text-gray-500 mt-3">
            {LOADING_TEXT[currentStep] ?? ''}
          </p>
        )}
      </div>
    </div>
  );
}
