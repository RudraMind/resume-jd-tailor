import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const REQUIRED_KEYS = {
  gemini: 'GEMINI_API_KEY',
  openai: 'OPENAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
  groq: 'GROQ_API_KEY',
  openrouter: 'OPENROUTER_API_KEY',
  ollama: null,
};

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  provider: process.env.LLM_PROVIDER || 'gemini',
  model: process.env.LLM_MODEL || null,
};

const requiredKey = REQUIRED_KEYS[config.provider];
if (requiredKey && !process.env[requiredKey]) {
  console.warn(`Warning: ${requiredKey} not set for provider "${config.provider}"`);
}
