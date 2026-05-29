import InputScreen from './components/InputScreen.jsx';
import PipelineProgress from './components/PipelineProgress.jsx';
import ResultsView from './components/ResultsView.jsx';
import { usePipeline } from './hooks/usePipeline.js';

export default function App() {
  const { state, runPipeline, reset } = usePipeline();
  const { status, currentStep, attempt, error, outputs, inputs } = state;

  if (status === 'idle') {
    return <InputScreen onRun={runPipeline} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PipelineProgress
        status={status}
        currentStep={currentStep}
        attempt={attempt}
        error={error}
      />
      {error && (
        <div className="max-w-4xl mx-auto px-6 pt-4">
          <div className="flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-red-800">
                Error in step: <span className="font-mono">{error.step}</span>
              </p>
              <p className="text-sm text-red-700 mt-0.5">{error.message}</p>
            </div>
            <button
              onClick={() => runPipeline(inputs)}
              className="shrink-0 px-3 py-1.5 rounded-md border border-red-300 bg-white text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      <ResultsView
        outputs={outputs}
        attempt={attempt}
        onReset={status === 'complete' || status === 'error' ? reset : null}
      />
    </div>
  );
}
