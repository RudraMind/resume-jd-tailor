import Card from '../ui/Card.jsx';
import Pill from '../ui/Pill.jsx';
import CopyButton from '../ui/CopyButton.jsx';
import { FileSearch } from 'lucide-react';

const SENIORITY_COLORS = {
  entry: 'green', mid: 'green', senior: 'blue', lead: 'purple', staff: 'purple',
};

export default function JDAnalysis({ data }) {
  if (!data) return null;

  const copyText = JSON.stringify(data, null, 2);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileSearch size={18} className="text-purple-600" />
          <h2 className="font-semibold text-gray-800">JD Analysis</h2>
          {data.company_name && <span className="text-gray-400 text-sm">— {data.company_name}</span>}
        </div>
        <div className="flex items-center gap-2">
          {data.seniority_level && (
            <Pill variant={SENIORITY_COLORS[data.seniority_level] ?? 'gray'}>
              {data.seniority_level}
            </Pill>
          )}
          <CopyButton text={copyText} />
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-4">{data.role_title}</h3>

      {data.top_keywords?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Top Keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {data.top_keywords.map(kw => <Pill key={kw} variant="purple">{kw}</Pill>)}
          </div>
        </div>
      )}

      {data.tools_and_technologies?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tools & Technologies</p>
          <div className="flex flex-wrap gap-1.5">
            {data.tools_and_technologies.map(t => <Pill key={t} variant="teal">{t}</Pill>)}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {data.required_skills?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {data.required_skills.map(s => <Pill key={s} variant="amber">{s}</Pill>)}
            </div>
          </div>
        )}
        {data.preferred_skills?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Preferred Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {data.preferred_skills.map(s => <Pill key={s} variant="gray">{s}</Pill>)}
            </div>
          </div>
        )}
      </div>

      {data.key_responsibilities?.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Key Responsibilities</p>
          <ul className="list-disc list-inside space-y-1">
            {data.key_responsibilities.map((r, i) => (
              <li key={i} className="text-sm text-gray-700">{r}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
