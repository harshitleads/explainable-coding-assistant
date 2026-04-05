# Explainable Coding Assistant

**AI code suggestions tell you what to write. This tool tells you why.**

Developers using Copilot and Cursor face the same problem: they get a code suggestion, and they either accept it blindly or spend time manually verifying it. Neither is good. Blind acceptance introduces bugs and technical debt. Manual verification defeats the purpose of AI assistance.

Explainable Coding Assistant is a three-panel web app that surfaces the reasoning behind AI code suggestions. Paste your original code and a suggestion. The tool returns why the approach was chosen, what assumptions it encodes, what tradeoffs exist, and what you need to verify before accepting.

**Live:** [trust.harshit.ai](https://trust.harshit.ai) | **Full case study:** [harshit.ai/work/explainable-ai](https://harshit.ai/work/explainable-ai)

---

## Why I built this

Every AI coding tool optimizes for speed of generation. None optimize for developer understanding. The result is a trust problem: senior developers distrust suggestions they can't verify quickly, and junior developers trust suggestions they shouldn't.

I built this to explore what it would look like to make explainability a first-class feature of AI coding tools, not an afterthought. The core insight: if you can't explain why a suggestion was made, you can't evaluate whether it's right for your codebase.

---

## How it works

1. Paste your original code in the left panel
2. Paste the AI-generated suggestion in the center panel
3. The tool sends both to Claude with a structured prompt
4. Five reasoning sections appear in the right panel: approach rationale, assumption mapping, tradeoff analysis, confidence score, and verification checklist
5. Accept or discard the suggestion with full context

## Design decisions worth noting

**Three-panel layout over chat interface.** The core value is side-by-side comparison of original code, suggestion, and reasoning. A chat interface buries the comparison. Three panels keep everything visible simultaneously.

**Confidence score is LLM pattern matching, not measurement.** This is a documented honest limitation. The confidence score reflects Claude's assessment of its own suggestion, not a grounded metric against your actual codebase. Acknowledging this explicitly signals product maturity.

**Web app over VS Code extension for V1.** A VS Code extension would be the right long-term form factor, but it adds weeks of scope. Validating the core concept in a web app first is the right sequencing.

**Server-side API route, not client-side calls.** Claude API calls go through a Next.js API route to keep the Anthropic API key secure. No key is exposed to the browser.

For the full product narrative, design decisions, and honest limitations, see the [case study on harshit.ai](https://harshit.ai/work/explainable-ai).

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS
- Anthropic SDK (Claude Sonnet)
- Deployed on Vercel
- No auth, no database, fully public

## Local development

```bash
pnpm install
pnpm dev
```

Add `ANTHROPIC_API_KEY` to `.env.local` before running.

---

Built by [Harshit Sharma](https://harshit.ai).
