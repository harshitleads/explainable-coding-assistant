# CLAUDE.md

## Vision and Mission
An explainability layer for AI code suggestions. Trust through transparency.

## Current Stack
- Next.js (App Router), TypeScript, Tailwind CSS
- Anthropic SDK (claude-sonnet-4-6)
- Deployed on Vercel at trust.harshit.ai

## Architecture
- `app/page.tsx` — state machine (input, loading, result, error)
- `components/CaseStudyBubble.tsx` — persistent floating popup linking to harshit.ai/work/explainable-ai, indigo accent

## Code Rules
- No em dashes anywhere in copy
- NEVER run git commit, git push, git reset, git checkout, or any git write commands
- NEVER delete files unless the task spec explicitly says to delete a specific named file

## Completed Work
- 2026-03-14: Initial build and deploy
- 2026-04-04: UI redesign (two-panel layout)
- 2026-04-10: Persistent case study bubble on all screens
