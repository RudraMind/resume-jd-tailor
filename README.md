<div align="center">

# Resume JD Tailor

**An AI pipeline that fights the ATS filter — so humans actually read your resume.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Providers](https://img.shields.io/badge/LLM%20Providers-6-purple)](#llm-providers)

</div>

---

## The Story

You spend two hours on a cover letter. You tailor your resume. You click submit.

A bot reads it in 0.3 seconds and rejects you before a human ever sees your name.

**Applicant Tracking Systems (ATS)** don't evaluate talent — they keyword-match. A brilliant candidate with the wrong phrasing scores lower than a mediocre one who gamed the system. The job market doesn't reward the best person for the job. It rewards the best-optimized resume.

That's what this tool fixes.

Paste your resume. Paste the job description. The pipeline runs 6 AI steps: it extracts what the JD actually wants, scores your alignment, rewrites your bullets to match, strips the AI-sounding filler, then loops a critic AI up to 3 times — scoring your materials like a senior hiring manager — until you hit an 8/10 or above.

No templates. No keyword stuffing. No fake experience invented. Just your real story, told in the language that gets you past the filter and into the room.

---

## How It Works

```
Your Resume + Job Description
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│  Step 1 │  JD Analysis                                  │
│         │  Extracts role, seniority, top keywords,      │
│         │  required skills, tools, and responsibilities │
└─────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│  Step 2 │  ATS Check                          (local)   │
│         │  Scores keyword overlap before any rewrites   │
│         │  Flags critical missing terms                 │
└─────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│  Step 3 │  Resume Match                                 │
│         │  Scores alignment 0-100                       │
│         │  Splits skills: matched / weak / missing      │
└─────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│  Step 4 │  Rewrite Bullets                              │
│         │  Rewrites your experience targeting the JD    │
│         │  Three intensities: nudge / keywords / full   │
└─────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│  Step 5 │  AI Phrase Cleanup                  (local)   │
│         │  Strips "leveraged synergies", "drove impact" │
│         │  Makes it sound like a person wrote it        │
└─────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│  Step 6 │  Critic Review + Revision           (loop)    │
│         │  Senior hiring manager AI scores 1-10         │
│         │  Revises until score ≥ 8, max 3 iterations    │
└─────────────────────────────────────────────────────────┘
           │
           ▼
    Tailored Resume Bullets
    ATS Score · Match Analysis · Critic Notes
```

---

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/RudraMind/resume-jd-tailor.git
cd resume-jd-tailor
npm run install:all

# 2. Configure your LLM provider
cp .env.example .env
# Open .env and add your API key (see providers table below)

# 3. Run
npm run dev
```

Open **http://localhost:5173** → paste resume → paste job description → click **Run Agent Pipeline**.

> Takes ~30-60 seconds with cloud providers. Gemini 2.5 Pro recommended for best rewrite quality.

---

## LLM Providers

Set `LLM_PROVIDER` in `.env`. All providers use the same pipeline — swap freely.

| Provider | `LLM_PROVIDER` | Env var needed | Default model | Cost / run |
|----------|----------------|----------------|---------------|------------|
| **OpenRouter** | `openrouter` | `OPENROUTER_API_KEY` | `google/gemini-2.0-flash-exp:free` | free tier available |
| **Google Gemini** | `gemini` | `GEMINI_API_KEY` | `gemini-2.0-flash` | ~$0.01 |
| **Anthropic** | `anthropic` | `ANTHROPIC_API_KEY` | `claude-sonnet-4-20250514` | ~$0.05 |
| **OpenAI** | `openai` | `OPENAI_API_KEY` | `gpt-4o-mini` | ~$0.02 |
| **Groq** | `groq` | `GROQ_API_KEY` | `llama-3.3-70b-versatile` | ~free |
| **Ollama (local)** | `ollama` | _(none)_ | `llama3.1` | free |

**Best quality:** `gemini-2.5-pro` via OpenRouter (~$0.45/run) — strongest reasoning for resume rewrite tasks.

**Free option:** Groq or Ollama local.

```env
# .env example
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-...
LLM_MODEL=google/gemini-2.5-pro   # optional override
```

---

## Rewrite Intensity

Control how aggressively bullets are rewritten via the UI or `REWRITE_INTENSITY` in `.env`:

| Level | Behavior |
|-------|----------|
| `nudge` | Light edits — preserve voice, improve alignment |
| `keywords` | Weave in JD keywords naturally without structural changes |
| `full` | Aggressive rewrite targeting JD requirements directly |

---

## What the Critic Cares About

The Step 6 critic scores your materials on 5 axes — the same things a senior hiring manager notices:

1. **Keyword alignment** — are the right JD terms present and natural?
2. **Honesty** — do any claims feel inflated beyond what the resume supports?
3. **Tone** — does it read like a real person or like AI wrote it?
4. **Specificity** — are claims backed by numbers and details, or vague?
5. **Consistency** — do all parts tell a coherent story?

Score 8+ = ready to submit. The pipeline loops up to 3 times if it falls short.

---

## Architecture

```
resume-jd-tailor/
├── client/                  # React + Vite + Tailwind
│   └── src/
│       ├── components/
│       │   ├── steps/       # One card per pipeline step
│       │   └── ui/          # CopyButton, shared components
│       ├── hooks/
│       │   └── usePipeline.js   # Pipeline state machine
│       └── api.js           # Fetch wrapper with error handling
│
└── server/                  # Node.js + Express (ESM)
    ├── llm/
    │   ├── providers/       # gemini.js, openai-compat.js, anthropic.js
    │   ├── adapter.js       # Routes to correct provider
    │   └── json-extractor.js  # Robust JSON parsing from LLM output
    └── prompts/             # System + user prompts per step
        ├── jd-analysis.js
        ├── resume-match.js
        ├── rewrite-bullets.js
        └── critic-review.js
```

The server is a thin Express layer. Each pipeline step is a `POST /api/pipeline/:step` endpoint. The frontend calls them sequentially, showing live progress as each card fills in.

---

## Principles

**No hallucination by design.** The rewrite prompt explicitly receives your original resume and only rewrites what's there. The critic scores for honesty and flags inflated claims. The pipeline doesn't invent experience — it translates yours.

**Privacy first.** Your resume never leaves your machine if you use Ollama. With cloud providers, it's sent only to that provider's API — nothing is stored or logged by this app.

**Minimal dependencies.** No database, no auth, no accounts. Clone, configure, run.

---

## Contributing

Issues and PRs welcome. The prompts in `server/prompts/` are the heart of the pipeline — if you find a better framing for any step, test it and open a PR with before/after examples.

---

## License

MIT — do whatever you want with it.

---

<div align="center">

*Built because the job market is broken.*
*At least the resume part is fixable.*

</div>
