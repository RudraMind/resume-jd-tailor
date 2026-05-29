import Card from '../ui/Card.jsx';
import ScoreDisplay from '../ui/ScoreDisplay.jsx';
import { MessageCircle } from 'lucide-react';

const AREA_COLORS = {
  resume_bullets:    'bg-blue-50 border-blue-200 text-blue-800',
  keyword_alignment: 'bg-purple-50 border-purple-200 text-purple-800',
  honesty:           'bg-red-50 border-red-200 text-red-800',
  tone:              'bg-amber-50 border-amber-200 text-amber-800',
  consistency:       'bg-gray-50 border-gray-200 text-gray-800',
};

export default function CriticReview({ data, attempt }) {
  if (!data) return null;

  return (
    <Card className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageCircle size={18} className="text-indigo-600" />
          <h2 className="font-semibold text-gray-800">Critic Review</h2>
          {attempt > 1 && (
            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Revised {attempt - 1}×
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <ScoreDisplay score={data.score} max={10} />
      </div>

      {data.issues?.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {data.issues.map((issue, i) => {
            const style = AREA_COLORS[issue.area] ?? AREA_COLORS.consistency;
            return (
              <div key={i} className={`p-3 rounded-lg border ${style}`}>
                <p className="text-xs font-bold uppercase tracking-wide mb-1 opacity-70">
                  {issue.area?.replace(/_/g, ' ')}
                </p>
                <p className="text-sm mb-1">{issue.description}</p>
                <p className="text-xs italic opacity-80 border-t border-current border-opacity-20 pt-1 mt-1">
                  → {issue.suggestion}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {data.overall_assessment && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <p className="text-sm text-gray-700">{data.overall_assessment}</p>
        </div>
      )}
    </Card>
  );
}
