# CLAUDE.md

## Vision and Mission
An explainability layer for AI code suggestions. Developers paste their original code and an AI suggestion. The tool returns why the approach was chosen, what tradeoffs exist, and what the developer needs to verify before accepting. Target user: junior to mid-level developers using Copilot or Cursor who accept suggestions blindly or waste time verifying them.

## Current Stack
- Next.js (App Router), TypeScript, Tailwind CSS
- Anthropic SDK (claude-sonnet-4-6)
- Deployed on Vercel (requires ANTHROPIC_API_KEY env var)
- No auth -- fully public

## Architecture
- `app/page.tsx` -- state machine (input, loading, result, error)
- `app/api/explain/route.ts` -- Claude API route, server-side
- `components/InputScreen.tsx` -- input form with two code textareas
- `components/ResultLayout.tsx` -- three-panel wrapper
- `components/FilePanel.tsx` -- left panel (file tree and metadata)
- `components/CodePanel.tsx` -- center panel (code, ghost suggestion, Accept/Discard)
- `components/ReasoningPanel.tsx` -- right panel (five AI reasoning sections)
- `types/index.ts` -- shared TypeScript types
- `app/globals.css` -- CSS custom properties for color palette

## Code Rules
- No em dashes anywhere in copy
- No placeholder content in production
- Test mobile viewport before shipping
- Handle errors gracefully, never show raw errors to users
- Keep components small and focused on one job
- Delete unused code, no commented-out blocks
- Meaningful commit messages
- NEVER run git commit, git push, git reset, git checkout, or any git write commands. Only the developer commits and pushes manually. This rule has no exceptions.
- NEVER delete files unless the task spec explicitly says to delete a specific named file. If unsure, rename or comment out instead of deleting.

## Decision Logging
When you make or execute a product or technical decision, append it to `docs/decisions.md` in this format:
```
### YYYY-MM-DD -- Short title
**Decision:** What was decided.
**Why:** The reasoning.
**Rejected:** What alternatives were considered and why they lost.
```
This applies to every Claude session touching this project, not just the CTO chat.

## Known Issues and Backlog
- No syntax highlighting in code panels (intentional for prototype speed)
- No mobile layout for three-panel result view (input screen works on mobile)
- Confidence score is LLM pattern matching only, not grounded in static analysis
- Custom domain not yet configured

## Project Log
[Technical decisions appended here automatically via claude-code-bridge.]
