import Card from '../ui/Card.jsx';
import ScoreDisplay from '../ui/ScoreDisplay.jsx';
import { ShieldCheck, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

const SEVERITY_CONFIG = {
  error:   { Icon: AlertCircle,   color: 'text-red-500',   bg: 'bg-red-50',   border: 'border-red-200' },
  warning: { Icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  info:    { Icon: Info,          color: 'text-blue-500',  bg: 'bg-blue-50',  border: 'border-blue-200' },
};

export default function ATSCheck({ data }) {
  if (!data) return null;

  return (
    <Card className="animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck size={18} className="text-green-600" />
        <h2 className="font-semibold text-gray-800">ATS Compatibility Check</h2>
      </div>

      <div className="mb-6">
        <ScoreDisplay score={data.score} max={100} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Issues</p>
          <div className="space-y-2">
            {(data.issues?.length ?? 0) === 0 && (
              <p className="text-sm text-gray-400">No issues found</p>
            )}
            {data.issues?.map((issue, i) => {
              const cfg = SEVERITY_CONFIG[issue.severity] ?? SEVERITY_CONFIG.info;
              return (
                <div key={i} className={`p-3 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                  <div className="flex items-start gap-2">
                    <cfg.Icon size={14} className={`mt-0.5 shrink-0 ${cfg.color}`} />
                    <div>
                      <p className="text-sm text-gray-800">{issue.message}</p>
                      {issue.fix && <p className="text-xs text-gray-500 italic mt-0.5">{issue.fix}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Passes</p>
          <div className="space-y-2">
            {data.passes?.map((pass, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-green-50 border border-green-200">
                <CheckCircle size={14} className="text-green-500 shrink-0" />
                <p className="text-sm text-gray-700">{pass.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
