import Card from '../ui/Card.jsx';
import CopyButton from '../ui/CopyButton.jsx';
import { Sparkles, CheckCircle } from 'lucide-react';

export default function AIPhraseCleanup({ data }) {
  if (!data) return null;

  const cleanedText = data.cleaned?.map(b => b.cleaned || '').join('\n') ?? '';

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-violet-500" />
          <h2 className="font-semibold text-gray-800">AI Phrase Cleanup</h2>
        </div>
        <CopyButton text={cleanedText} />
      </div>

      {data.count === 0 ? (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle size={16} />
          <p className="text-sm font-medium">No AI-sounding phrases detected</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-3">
            <span className="font-semibold text-violet-700">{data.count}</span> AI phrase{data.count !== 1 ? 's' : ''} replaced
          </p>
          <div className="space-y-1">
            {data.replacements.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="line-through text-red-400">{r.original}</span>
                <span className="text-gray-400">→</span>
                <span className="text-green-600 font-medium">{r.replacement || '(removed)'}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
