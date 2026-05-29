import { useState } from 'react';
import InputScreen from './components/InputScreen.jsx';
import PipelineProgress from './components/PipelineProgress.jsx';

// ResultsView will be wired in Phase 5.
// Stub prevents import errors when the file does not exist yet.
let ResultsView = null;
try {
  // Dynamic require used to avoid compile-time failure on missing module.
  // Will be replaced with a static import once ResultsView is created.
  ResultsView = require('./components/ResultsView.jsx').default;
} catch (_) {
  // not yet built — renders placeholder below
}

export default function App() {
  const [pipelineState, setPipelineState] = useState(null);

  const handleRun = (inputs) => {
    setPipelineState({
      status: 'idle',
      inputs,
      currentStep: null,
      attempt: 0,
      error: null,
      outputs: {},
    });
  };

  const handleReset = () => setPipelineState(null);

  if (!pipelineState) {
    return <InputScreen onRun={handleRun} />;
  }

  return (
    <div>
      <PipelineProgress
        status={pipelineState.status}
        currentStep={pipelineState.currentStep}
        attempt={pipelineState.attempt}
        error={pipelineState.error}
      />

      {ResultsView && pipelineState.outputs != null ? (
        <ResultsView outputs={pipelineState.outputs} onReset={handleReset} />
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-8">
          <p className="text-gray-500 text-sm text-center">
            Pipeline wiring coming in Phase 5...
          </p>
          <button
            onClick={handleReset}
            className="mt-4 mx-auto block text-sm text-purple-600 underline"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
