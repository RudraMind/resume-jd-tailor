import InputScreen from './components/InputScreen.jsx';
import PipelineProgress from './components/PipelineProgress.jsx';
import ResultsView from './components/ResultsView.jsx';
import { usePipeline } from './hooks/usePipeline.js';

export default function App() {
  const { state, runPipeline, reset } = usePipeline();
  const { status, currentStep, attempt, error, outputs } = state;

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
      <ResultsView
        outputs={outputs}
        attempt={attempt}
        onReset={status === 'complete' || status === 'error' ? reset : null}
      />
    </div>
  );
}
