# Resume JD Tailor

AI-powered resume tailoring pipeline with multi-provider LLM support. Paste a resume + job description → 6-step AI pipeline → tailored resume bullets with ATS score, match analysis, and critic review.

## Pipeline Steps

1. **JD Analysis** — extracts role, seniority, keywords, and requirements
2. **ATS Check** — client-side compatibility check (no API call)
3. **Resume Match** — scores alignment, identifies matched/weak/missing skills
4. **Rewrite Bullets** — rewrites resume bullets targeting the JD
5. **AI Phrase Cleanup** — removes generic AI phrasing (client-side)
6. **Critic Review + Revision** — up to 3 iteration loops until score ≥ 8/10

## Quick Start

```bash
# 1. Clone and install
git clone <repo>
cd Resume-JD-Tailor
npm run install:all

# 2. Configure
cp .env.example .env
# Edit .env — add your API key

# 3. Run
npm run dev
# Client: http://localhost:5173
# Server: http://localhost:3001
```

## LLM Provider Configuration

Set `LLM_PROVIDER` in `.env` to select your provider. Optionally set `LLM_MODEL` to override the default model.

| Provider | `LLM_PROVIDER` value | Required env var | Default model |
|----------|----------------------|-----------------|---------------|
| Google Gemini | `gemini` | `GEMINI_API_KEY` | `gemini-2.0-flash` |
| OpenAI | `openai` | `OPENAI_API_KEY` | `gpt-4o-mini` |
| Anthropic | `anthropic` | `ANTHROPIC_API_KEY` | `claude-sonnet-4-20250514` |
| Groq | `groq` | `GROQ_API_KEY` | `llama-3.3-70b-versatile` |
| Ollama (local) | `ollama` | _(none)_ | `llama3.1` |
| OpenRouter | `openrouter` | `OPENROUTER_API_KEY` | `google/gemini-2.0-flash-exp:free` |

Ollama users: set `OLLAMA_BASE_URL` to override the default `http://localhost:11434`.

Default provider: `gemini`.

## Intensity Levels

Control how aggressively bullets are rewritten:

| Level | Effect |
|-------|--------|
| `nudge` | Light edits — preserve voice, improve alignment |
| `keywords` | Weave in JD keywords naturally |
| `full` | Aggressive rewrite targeting JD requirements |

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express (ESM)
- **LLM:** Multi-provider (Gemini / OpenAI / Anthropic / Groq / Ollama / OpenRouter)

## License

MIT License — see LICENSE file
