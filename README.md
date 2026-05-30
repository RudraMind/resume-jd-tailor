<div align="center">

# Resume JD Tailor

**An AI pipeline that fights the ATS filter — so humans actually read your resume.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![LLM Providers](https://img.shields.io/badge/LLM%20Providers-6-purple)](#llm-providers)
[![OpenRouter Models](https://img.shields.io/badge/OpenRouter%20Models-10-orange)](#model-selector)

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

## Features at a Glance

| | Feature | What it does |
|---|---------|-------------|
| 🔬 | **6-Step AI Pipeline** | Analyze → Score → Match → Rewrite → Clean → Critique |
| 🧠 | **Critic Loop** | Scores 1–10 like a hiring manager. Loops until ≥ 8/10 |
| ⚡ | **Smart Model Escalation** | Cheap model for attempts 1–2, premium auto-escalates on attempt 3 |
| 🎛️ | **10 Model Options** | Free to premium — swap without touching `.env` |
| 💾 | **Resume Memory** | Your last resume pre-loads on every new job posting |
| 🔒 | **Privacy First** | API key stays server-side. Resume never stored externally |
| 🏠 | **Local LLM Support** | Run 100% offline with Ollama — zero cost, zero data sent |

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
│         │  Senior hiring manager AI scores 1–10         │
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
# Add your OpenRouter (or other) API key

# 3. Run
npm run dev
```

Open **http://localhost:5173** → paste resume → paste job description → click **Run Agent Pipeline**.

> Default model: `DeepSeek V4 Flash` via OpenRouter (~$0.002/run). Change it in the UI — no restart needed.

---

## Model Selector

Pick your AI model directly in the dashboard — no `.env` edits required.

Two dropdowns per run:

```
┌──────────────────────────┐   ┌──────────────────────────┐
│  AI Model                │   │  3rd Retry Model         │
│  Attempts 1 & 2          │   │  If score < 8 after 2x   │
│                          │   │                          │
│  DeepSeek V4 Flash ⭐   │   │  Gemini 2.5 Pro          │
│  $0.10/1M  · 1M ctx      │   │  ~$0.45/run · 128K ctx   │
└──────────────────────────┘   └──────────────────────────┘
         cheap + fast                  best quality
         first 2 passes             only if needed
```

**Smart escalation:** use a free or cheap model for the first two attempts. If the critic still scores below 8, the third attempt automatically switches to your premium model. You get best-quality output only when the cheaper model falls short.

### Available Models (OpenRouter)

| Model | Context | Price | Notes |
|-------|---------|-------|-------|
| Nemotron 3 Super | 262K | **Free** | 120B params, slow (~19s/call) |
| DeepSeek V4 Flash ⭐ | 1M | $0.10/1M | Default — fast, confirmed |
| Qwen 3.5 Flash | 1M | $0.065/1M | Cheapest paid option |
| DeepSeek V3 0324 | 164K | $0.20/1M | Strong reasoning |
| GPT-4o Mini | 128K | $0.15/1M | OpenAI standard |
| GPT-4o | 128K | $2.50/1M | OpenAI flagship |
| DeepSeek R1 | 164K | $0.55/1M | Reasoning model |
| Llama 3.3 70B | 128K | $0.12/1M | Meta open model |
| Gemini 2.0 Flash | 1M | $0.10/1M | Google fast |
| Gemini 2.5 Pro | 128K | ~$0.45/run | Best quality, confirmed |

> **Recommended setup:** DeepSeek V4 Flash for primary, Gemini 2.5 Pro as retry escalation.

---

## LLM Providers

Set `LLM_PROVIDER` in `.env`. The UI model selector overrides this per-run — `.env` is the fallback default.

| Provider | `LLM_PROVIDER` | Env var needed | Default model |
|----------|----------------|----------------|---------------|
| **OpenRouter** | `openrouter` | `OPENROUTER_API_KEY` | `deepseek/deepseek-v4-flash` |
| **Google Gemini** | `gemini` | `GEMINI_API_KEY` | `gemini-2.0-flash` |
| **Anthropic** | `anthropic` | `ANTHROPIC_API_KEY` | `claude-sonnet-4-20250514` |
| **OpenAI** | `openai` | `OPENAI_API_KEY` | `gpt-4o-mini` |
| **Groq** | `groq` | `GROQ_API_KEY` | `llama-3.3-70b-versatile` |
| **Ollama (local)** | `ollama` | _(none)_ | `llama3.1` |

```env
# Minimal .env for OpenRouter
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-...
# LLM_MODEL=google/gemini-2.5-pro   # optional server-side default
```

---

## Rewrite Intensity

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

Score 8+ = ready to submit. The pipeline loops up to 3 times if it falls short — escalating to your premium model on the final attempt.

---

## Resume Memory

Your last-used resume is saved locally in the browser. When you click **New Job Posting**, the dashboard opens with your resume pre-loaded and a **"Last used"** badge — just paste the new job description and run.

Your resume never leaves your browser storage. It's only sent to the LLM provider when you click Run.

---

## Architecture

```
resume-jd-tailor/
├── client/                      # React + Vite + Tailwind
│   └── src/
│       ├── components/
│       │   ├── InputScreen.jsx  # Dual model selector, resume persistence
│       │   ├── steps/           # One card per pipeline step
│       │   └── ui/              # CopyButton, shared components
│       ├── hooks/
│       │   └── usePipeline.js   # Pipeline state machine + model escalation
│       └── api.js               # Fetch wrapper with error handling
│
└── server/                      # Node.js + Express (ESM)
    ├── llm/
    │   ├── providers/           # gemini.js, openai-compat.js, anthropic.js
    │   ├── index.js             # Per-request provider creation with model override
    │   └── json-extractor.js   # Robust JSON parsing from LLM output
    └── prompts/                 # System + user prompts per step
        ├── jd-analysis.js
        ├── resume-match.js
        ├── rewrite-bullets.js
        └── critic-review.js
```

The server is a thin Express layer. Each pipeline step is a `POST /api/step/:step` endpoint. The model is passed per-request from the frontend — the API key stays server-side and never reaches the browser.

---

## Principles

**No hallucination by design.** The rewrite prompt receives your original resume and only rewrites what's there. The critic scores for honesty and flags inflated claims. The pipeline doesn't invent experience — it translates yours.

**Privacy first.** Your resume never leaves your machine if you use Ollama. With cloud providers, it's sent only to that provider's API — nothing is stored or logged by this app. The API key lives in `.env` on your machine only.

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
