import Card from '../ui/Card.jsx';
import Pill from '../ui/Pill.jsx';
import ScoreDisplay from '../ui/ScoreDisplay.jsx';
import CopyButton from '../ui/CopyButton.jsx';
import { Search } from 'lucide-react';

export default function ResumeMatch({ data }) {
  if (!data) return null;

  const copyText = `Resume Match Score: ${data.overall_score}/100\n\n${data.summary}`;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-blue-600" />
          <h2 className="font-semibold text-gray-800">Resume Match Score</h2>
        </div>
        <CopyButton text={copyText} />
      </div>

      <div className="mb-4">
        <ScoreDisplay score={data.overall_score} max={100} size="lg" />
      </div>

      {data.summary && (
        <blockquote className="border-l-4 border-blue-200 pl-4 py-2 bg-blue-50 rounded-r-lg mb-4">
          <p className="text-sm text-gray-700 italic">{data.summary}</p>
        </blockquote>
      )}

      <div className="grid grid-cols-3 gap-4 mb-4">
        {data.matched_skills?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Matched</p>
            <div className="flex flex-wrap gap-1">
              {data.matched_skills.map((s, i) => (
                <Pill key={i} variant={s.strength === 'strong' ? 'green' : 'amber'}>
                  {s.skill}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {data.weak_skills?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Weak</p>
            <div className="space-y-1">
              {data.weak_skills.map((s, i) => (
                <div key={i} className="p-2 rounded bg-amber-50 border border-amber-200">
                  <p className="text-xs font-medium text-amber-800">{s.skill}</p>
                  <p className="text-xs text-amber-600">{s.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.missing_skills?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Missing</p>
            <div className="flex flex-wrap gap-1">
              {data.missing_skills.map((s, i) => (
                <Pill key={i} variant="red">{s.skill}</Pill>
              ))}
            </div>
          </div>
        )}
      </div>

      {data.sections_to_improve?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sections to Improve</p>
          <div className="space-y-2">
            {data.sections_to_improve.map((s, i) => (
              <div key={i} className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm font-medium text-red-800">{s.section}</p>
                <p className="text-xs text-red-600">{s.issue}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
