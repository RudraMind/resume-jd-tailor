import { useState } from 'react';
import { FileText, ClipboardList, Rocket } from 'lucide-react';

const INTENSITY_OPTIONS = [
  {
    key: 'nudge',
    label: 'Light Nudge',
    description: 'Minimal rephrasing only. Preserves your original voice.',
  },
  {
    key: 'keywords',
    label: 'Keyword Enhance',
    description: 'Weaves JD keywords into existing bullets naturally.',
  },
  {
    key: 'full',
    label: 'Full Tailor',
    description: 'Comprehensive rewrite for maximum JD alignment.',
  },
];

export default function InputScreen({ onRun }) {
  const [resume, setResume] = useState('');
  const [jd, setJd] = useState('');
  const [intensity, setIntensity] = useState('keywords');
  const [targetRole, setTargetRole] = useState('');

  const canRun = resume.trim().length > 0 && jd.trim().length > 0;

  const handleRun = () => {
    if (canRun) onRun({ resume, jd, intensity, targetRole });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6C3FC5] to-[#3B82F6] px-6 py-10 text-center">
        <p className="text-purple-200 text-xs tracking-widest uppercase font-semibold mb-3">
          AI Agent &nbsp;|&nbsp; 6-Step Pipeline &nbsp;|&nbsp; Critic Loop
        </p>
        <h1 className="text-4xl font-bold text-white font-display">
          Resume <span className="text-amber-300">JD</span> Tailor Agent
        </h1>
        <p className="mt-3 text-purple-100 text-base max-w-xl mx-auto">
          Paste your resume and a job description. The AI agent analyzes, rewrites, critiques,
          and improves your application. Honestly.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Textareas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText size={16} className="text-purple-600" />
              Your Resume
            </label>
            <div className="relative">
              <textarea
                value={resume}
                onChange={e => setResume(e.target.value)}
                placeholder="Paste your full resume text here..."
                className="w-full min-h-[300px] p-4 font-mono text-sm border border-gray-200 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
              />
              <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                {resume.length} chars
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ClipboardList size={16} className="text-blue-500" />
              Job Description
            </label>
            <div className="relative">
              <textarea
                value={jd}
                onChange={e => setJd(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full min-h-[300px] p-4 font-mono text-sm border border-gray-200 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              />
              <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                {jd.length} chars
              </span>
            </div>
          </div>
        </div>

        {/* Intensity Picker */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Tailoring Intensity</p>
          <div className="grid grid-cols-3 gap-3">
            {INTENSITY_OPTIONS.map(opt => (
              <label
                key={opt.key}
                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors
                  ${intensity === opt.key
                    ? 'border-l-4 border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
              >
                <input
                  type="radio"
                  name="intensity"
                  value={opt.key}
                  checked={intensity === opt.key}
                  onChange={() => setIntensity(opt.key)}
                  className="mt-0.5 accent-purple-600"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Target Role */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Target Role (optional)
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            placeholder="e.g. Applied AI Engineer, Senior Data Analyst"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
          />
        </div>

        {/* Run Button */}
        <button
          onClick={handleRun}
          disabled={!canRun}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-semibold text-white text-base transition-all
            ${canRun
              ? 'bg-gradient-to-r from-[#6C3FC5] to-[#3B82F6] hover:opacity-90 shadow-md'
              : 'bg-gray-300 cursor-not-allowed'
            }`}
        >
          <Rocket size={18} />
          Run Agent Pipeline
        </button>
      </div>
    </div>
  );
}
