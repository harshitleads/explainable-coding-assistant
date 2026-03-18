# CLAUDE.md — Project Intelligence File
# This file is read automatically by Claude Code at 
# the start of every session. Keep it updated.
# Last updated: March 16, 2026

---

## Who I Am
Harshit Sharma — AI PM, UC Berkeley MEng
Building real products fast using AI tools
Non-technical background, learning through building
Goal: ship working products, learn from them, iterate

---

## How I Work
- I use AI tools (Claude Code, Cursor) to build
- I am learning to code — explain changes simply
- Assume I don't know technical terms — define them
- Show me what changed and why, not just what changed
- When in doubt, ask me before making large changes

---

## Workflow (always follow this order)
1. /explore — understand the codebase first
2. /create-plan — propose the approach, wait for approval
3. /execute — build only what was approved
4. /review — check for errors and quality
5. /document — update this CLAUDE.md with what changed

Never skip straight to executing without exploring first.

---

## Code Hygiene (non-negotiable)
- No em dashes anywhere in copy — sounds AI-written
- No placeholder content in production
- Always test mobile viewport before shipping
- Handle errors gracefully — never show raw errors to users
- Keep components small and focused on one job
- Delete unused code — don't leave commented-out blocks
- Meaningful commit messages — describe what changed and why

---

## How to Update This File
At the end of every significant build session, append 
to the Project Log section below:
- What was built
- What stack/tools were used and why
- What was learned or discovered
- What's next

This keeps the file as a living record of the project.

---

## Project Log

### March 14 2026 — Project initialized
- Template applied, vision defined, stack chosen. No app code yet.

### March 14 2026 — v1 prototype built
- Built complete working app: input screen, Claude API route, three-panel result layout
- Stack finalized: Next.js + TypeScript + Tailwind + Anthropic SDK
- Five AI reasoning sections: Confidence Score, Why this change, Assumptions, Impact Analysis, Verification
- Confidence score is Claude-generated (0-100), color-coded green/yellow/red
- Accept/Discard buttons with undo; accepted code can be copied
- Build passes, dev server confirmed working

### March 16 2026 — Deployed to Vercel + case study written
- Deployed live to Vercel with ANTHROPIC_API_KEY env var
- Case study page lives in the harshit.ai portfolio repo (separate repository), not here
- Confidence score limitation documented as a known design constraint:
  Score is LLM-generated pattern matching, not grounded in static analysis, test coverage, or codebase context
- Custom domain pending
- Next: codebase context API, confidence grounding with static analysis, VS Code extension scaffold

---

## Current Stack
- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 with CSS custom properties for the dark theme
- **AI:** Anthropic SDK (`@anthropic-ai/sdk`) — model: `claude-sonnet-4-6`
- **Deploy:** Vercel (requires `ANTHROPIC_API_KEY` env var)
- **Auth:** None — fully public

Key files:
- `app/page.tsx` — state machine (input / loading / result / error)
- `app/api/explain/route.ts` — Claude API route, server-side
- `components/InputScreen.tsx` — input form (two code textareas)
- `components/ResultLayout.tsx` — three-panel wrapper
- `components/FilePanel.tsx` — left panel (file tree + metadata)
- `components/CodePanel.tsx` — center panel (code + ghost suggestion + Accept/Discard)
- `components/ReasoningPanel.tsx` — right panel (five AI reasoning sections)
- `types/index.ts` — shared TypeScript types
- `app/globals.css` — CSS custom properties for color palette

---

## Known Issues / Backlog
- No syntax highlighting in code panels (plain monospace — intentional for prototype speed)
- No mobile layout for the three-panel result view (input screen works on mobile)
- Model is `claude-sonnet-4-6` — upgrade to `claude-opus-4-6` in `app/api/explain/route.ts` if explanation quality needs improvement
- Confidence score is LLM pattern matching only — no static analysis, test coverage, or codebase context grounding
- Screenshots and case study content live in the harshit.ai portfolio repo, not this repo
- Custom domain not yet configured

---

## Vision & Mission
An explainability layer for AI code suggestions. Developers paste their original code and an AI suggestion. The tool returns three panels: why this approach was chosen over alternatives, what tradeoffs exist, and what the developer needs to know to evaluate it. Target user: junior to mid-level developers using Copilot or Cursor who either accept suggestions blindly or waste time verifying them.

### 2026-03-18
## Known Issues / Backlog — updated 2026-03-17
- [ ] Wire screenshots into harshit.ai case study page at /work/explainable-ai
      Images already exist in harshit.ai repo at /public/images/:
      explainable-1.jpg, explainable-2.jpg, explainable-3.jpg, 
      explainable-4.jpeg, explainable-summary.jpg
- [ ] Add /work/explainable-ai to sitemap.ts in harshit.ai repo
- [ ] Configure custom domain explainable.harshit.ai in Vercel
- [ ] Update Live Product button URL on case study page after domain is live
