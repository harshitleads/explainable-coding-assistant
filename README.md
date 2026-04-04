# Explainable Coding Assistant

An explainability layer for AI code suggestions. Paste your original code and an AI suggestion. The tool returns why the approach was chosen, what tradeoffs exist, and what you need to verify before accepting.

Target user: developers using Copilot or Cursor who either accept suggestions blindly or waste time manually verifying them.

Live at: [trust.harshit.ai](https://trust.harshit.ai)

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS
- Anthropic SDK (claude-sonnet-4-6)
- Deployed on Vercel (requires ANTHROPIC_API_KEY env var)
- No auth, fully public

## Structure

- `app/page.tsx` — state machine (input, loading, result, error)
- `app/api/explain/route.ts` — Claude API route, server-side
- `components/InputScreen.tsx` — input form with two code textareas
- `components/ResultLayout.tsx` — three-panel wrapper
- `components/CodePanel.tsx` — center panel with Accept/Discard
- `components/ReasoningPanel.tsx` — five AI reasoning sections
- `docs/decisions.md` — product and technical decision log

## Running Locally

```bash
pnpm install
pnpm dev
```

Add `ANTHROPIC_API_KEY` to `.env.local` before running.

## Repo Files

**CLAUDE.md** — technical context for Claude Code. Stack, architecture, code rules, and a log of technical decisions. Read automatically by Cursor at session start.

**docs/decisions.md** — product decision log. Why certain decisions were made, what tradeoffs were accepted, what alternatives were rejected. Useful for PMs and engineers reviewing the work.
