import Card from '../ui/Card.jsx';
import Pill from '../ui/Pill.jsx';
import CopyButton from '../ui/CopyButton.jsx';
import { Pencil } from 'lucide-react';

export default function RewriteBullets({ data }) {
  if (!data) return null;

  const allRewritten = data.rewritten_bullets
    ?.map(b => b.rewritten || '')
    .join('\n') ?? '';

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Pencil size={18} className="text-orange-500" />
          <h2 className="font-semibold text-gray-800">Rewritten Bullets</h2>
        </div>
        <CopyButton text={allRewritten} />
      </div>

      <div className="space-y-4">
        {data.rewritten_bullets?.map((bullet, i) => (
          <div key={bullet.id ?? i} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
              Bullet {i + 1} — {bullet.section?.replace('_', ' ')}
            </p>
            <p className="text-sm text-blue-700 mb-1">
              <span className="font-semibold">Original:</span> {bullet.original}
            </p>
            <p className="text-sm text-orange-700 font-medium mb-1">
              <span className="font-semibold">Rewritten:</span> {bullet.rewritten}
            </p>
            {bullet.changes_made && (
              <p className="text-xs text-gray-500 italic">{bullet.changes_made}</p>
            )}
            {bullet.keywords_added?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {bullet.keywords_added.map(kw => <Pill key={kw} variant="green">{kw}</Pill>)}
              </div>
            )}
          </div>
        ))}
      </div>

      {data.keywords_not_added?.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-xs font-semibold text-amber-700 mb-1">Keywords not added (honesty constraints):</p>
          <div className="flex flex-wrap gap-1 mb-1">
            {data.keywords_not_added.map(kw => <Pill key={kw} variant="amber">{kw}</Pill>)}
          </div>
          {data.keywords_not_added_reason && (
            <p className="text-xs text-amber-600 italic">{data.keywords_not_added_reason}</p>
          )}
        </div>
      )}
    </Card>
  );
}
