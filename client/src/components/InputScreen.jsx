import { useState } from 'react';
import { FileText, ClipboardList, Rocket, Cpu } from 'lucide-react';

const MODEL_OPTIONS = [
  // FREE — confirmed on OpenRouter
  { label: 'Nemotron 3 Super (free)',  slug: 'nvidia/nemotron-3-super-120b-a12b:free', context: '262K', price: 'Free' },
  // CHEAP PAID — confirmed on OpenRouter
  { label: 'DeepSeek V4 Flash ⭐',    slug: 'deepseek/deepseek-v4-flash',              context: '1M',   price: '$0.10/1M' },
  { label: 'Qwen 3.5 Flash',          slug: 'qwen/qwen3.5-flash-02-23',                context: '1M',   price: '$0.065/1M' },
  { label: 'DeepSeek V3 0324',        slug: 'deepseek/deepseek-chat-v3-0324',          context: '164K', price: '$0.20/1M' },
  // STANDARD PAID
  { label: 'GPT-4o Mini',             slug: 'openai/gpt-4o-mini',                      context: '128K', price: '$0.15/1M' },
  { label: 'GPT-4o',                  slug: 'openai/gpt-4o',                           context: '128K', price: '$2.50/1M' },
  { label: 'DeepSeek R1',             slug: 'deepseek/deepseek-r1',                    context: '164K', price: '$0.55/1M' },
  { label: 'Llama 3.3 70B',          slug: 'meta-llama/llama-3.3-70b-instruct',        context: '128K', price: '$0.12/1M' },
  { label: 'Gemini 2.0 Flash',        slug: 'google/gemini-2.0-flash',                 context: '1M',   price: '$0.10/1M' },
  // PREMIUM
  { label: 'Gemini 2.5 Pro',          slug: 'google/gemini-2.5-pro',                   context: '128K', price: '~$0.45/run' },
];

const DEFAULT_MODEL = 'deepseek/deepseek-v4-flash';

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

const STORAGE_KEY = 'rjt_last_resume';

export default function InputScreen({ onRun }) {
  const [resume, setResume] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  const [jd, setJd] = useState('');
  const [resumePreFilled, setResumePreFilled] = useState(
    () => (localStorage.getItem(STORAGE_KEY) || '').length > 0
  );
  const [intensity, setIntensity] = useState('keywords');
  const [targetRole, setTargetRole] = useState('');
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [retryModel, setRetryModel] = useState(DEFAULT_MODEL);
  const [retryModelCustomized, setRetryModelCustomized] = useState(false);

  const handleModelChange = (val) => {
    setModel(val);
    if (!retryModelCustomized) setRetryModel(val);
  };

  const handleRetryModelChange = (val) => {
    setRetryModel(val);
    setRetryModelCustomized(true);
  };

  const canRun = resume.trim().length > 0 && jd.trim().length > 0;

  const handleRun = () => {
    if (canRun) {
      localStorage.setItem(STORAGE_KEY, resume);
      onRun({ resume, jd, intensity, targetRole, model, retryModel });
    }
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
              {resumePreFilled && (
                <span className="ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-600">
                  Last used
                </span>
              )}
            </label>
            <div className="relative">
              <textarea
                value={resume}
                onChange={e => { setResume(e.target.value); setResumePreFilled(false); }}
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
                className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-colors
                  ${intensity === opt.key
                    ? 'border-l-4 border border-purple-500 bg-purple-50'
                    : 'border-2 border-gray-200 bg-white hover:bg-gray-50'
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

        {/* Model Selectors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
              <Cpu size={14} className="text-purple-600" />
              AI Model
            </label>
            <p className="text-xs text-gray-400">Attempts 1 &amp; 2</p>
            <select
              value={model}
              onChange={e => handleModelChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-gray-800"
            >
              {MODEL_OPTIONS.map(opt => (
                <option key={opt.slug} value={opt.slug}>
                  {opt.label} · {opt.context} · {opt.price}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
              <Cpu size={14} className="text-amber-500" />
              3rd Retry Model
            </label>
            <p className="text-xs text-gray-400">Used if score &lt; 8 after 2 attempts</p>
            <select
              value={retryModel}
              onChange={e => handleRetryModelChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-gray-800"
            >
              {MODEL_OPTIONS.map(opt => (
                <option key={opt.slug} value={opt.slug}>
                  {opt.label} · {opt.context} · {opt.price}
                </option>
              ))}
            </select>
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
