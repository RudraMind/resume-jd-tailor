import Card from '../ui/Card.jsx';
import { Trophy, RefreshCw } from 'lucide-react';

export default function RevisionSummary({ data }) {
  if (!data) return null;

  return (
    <Card className="border-2 border-purple-100 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={18} className="text-amber-500" />
        <h2 className="font-semibold text-gray-800">Revision Summary</h2>
      </div>

      <div className="flex items-center gap-6 mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Attempts</p>
          <p className="text-2xl font-bold text-gray-800 font-mono">{data.totalAttempts}/3</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Final Score</p>
          <p className={`text-2xl font-bold font-mono ${data.passed ? 'text-green-600' : 'text-amber-600'}`}>
            {data.finalScore}/10
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
          data.passed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {data.passed ? 'Passed threshold (8+)' : 'Best result shown'}
        </div>
      </div>

      {data.scores?.length > 1 && (
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw size={12} className="text-gray-400" />
          <p className="text-sm text-gray-600">
            Score progression: {data.scores.map(s => `${s.score}/10`).join(' → ')}
          </p>
        </div>
      )}

      {data.keyChanges?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Key Changes Made</p>
          <ul className="list-disc list-inside space-y-1">
            {data.keyChanges.map((change, i) => (
              <li key={i} className="text-sm text-gray-700">{change}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
