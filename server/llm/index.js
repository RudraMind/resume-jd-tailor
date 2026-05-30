import { GeminiAdapter } from './providers/gemini.js';
import { OpenAICompatAdapter } from './providers/openai-compat.js';
import { AnthropicAdapter } from './providers/anthropic.js';

const PROVIDER_DEFAULTS = {
  gemini:    { model: 'gemini-2.0-flash' },
  openai:    { model: 'gpt-4o-mini', baseUrl: 'https://api.openai.com/v1' },
  anthropic: { model: 'claude-sonnet-4-20250514' },
  groq:      { model: 'llama-3.3-70b-versatile', baseUrl: 'https://api.groq.com/openai/v1' },
  ollama:    { model: 'llama3.1', baseUrl: 'http://localhost:11434/v1' },
  openrouter:{ model: 'deepseek/deepseek-v4-flash', baseUrl: 'https://openrouter.ai/api/v1' },
};

export function createLLMProvider(requestModel) {
  const provider = process.env.LLM_PROVIDER || 'gemini';
  const defaults = PROVIDER_DEFAULTS[provider];

  if (!defaults) throw new Error(`Unknown LLM_PROVIDER: ${provider}. Options: ${Object.keys(PROVIDER_DEFAULTS).join(', ')}`);

  const model = requestModel || process.env.LLM_MODEL || defaults.model;

  switch (provider) {
    case 'gemini':
      return new GeminiAdapter(process.env.GEMINI_API_KEY, model);
    case 'openai':
      return new OpenAICompatAdapter(process.env.OPENAI_API_KEY, model, defaults.baseUrl);
    case 'groq':
      return new OpenAICompatAdapter(process.env.GROQ_API_KEY, model, defaults.baseUrl);
    case 'ollama':
      return new OpenAICompatAdapter('ollama', model, process.env.OLLAMA_BASE_URL || defaults.baseUrl);
    case 'openrouter':
      return new OpenAICompatAdapter(process.env.OPENROUTER_API_KEY, model, defaults.baseUrl);
    case 'anthropic':
      return new AnthropicAdapter(process.env.ANTHROPIC_API_KEY, model);
    default:
      throw new Error(`No adapter for provider: ${provider}`);
  }
}
