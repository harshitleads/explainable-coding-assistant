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

---

## ACTIVE TASK: Redesign result screen layout

### Context
The result screen currently has three panels: FilePanel (left, 220px) | CodePanel (center, flex) | ReasoningPanel (right, 320px). The FilePanel is decorative -- it shows a fake file explorer that wastes space and doesn't add value in a browser context. The ReasoningPanel (the actual product) is too narrow. The confidence score doesn't visually dominate enough.

The case study page on harshit.ai shows Figma mockup screenshots of what this product should look like. The narrative is: research > design > working prototype. The closer this UI matches the design intent, the stronger the portfolio story.

### What to do

#### Step 1: Remove FilePanel from the result layout
In `components/ResultLayout.tsx`:
- Remove the `<FilePanel>` component from the three-panel body
- Remove the FilePanel import
- The layout should now be two panels: CodePanel (left) | ReasoningPanel (right)

Do NOT delete `components/FilePanel.tsx` -- just stop rendering it.

#### Step 2: Rebalance the two-panel layout
In `components/ResultLayout.tsx`:
- The body `<div>` currently has `<FilePanel>`, `<CodePanel>`, `<ReasoningPanel>` in a flex row
- After removing FilePanel, adjust widths so:
  - CodePanel: takes roughly 55% of space (flex-1, unchanged -- it already uses flex-1)
  - ReasoningPanel: takes roughly 45% of space -- widen from current 320px max to ~420px
  
In `components/ReasoningPanel.tsx`:
- Change width from `320px` to `400px`
- Change minWidth from `280px` to `360px`  
- Change maxWidth from `360px` to `440px`

#### Step 3: Make confidence score visually dominant
In `components/ReasoningPanel.tsx`, the confidence score section (the `mx-4 mt-4 mb-2 rounded-lg p-4` div):
- Increase the score font size from `text-3xl` to `text-5xl`
- Add `text-center` to the confidence container so the score is centered
- Make the progress bar thicker: change `h-1.5` to `h-2.5`
- Add subtle padding increase: change `p-4` to `p-6` on the confidence container
- The confidence score should be the first thing someone sees when the result loads

#### Step 4: Improve ReasoningPanel section spacing
In `components/ReasoningPanel.tsx`:
- The sections feel cramped at the narrower width. Now that we have more space:
- Change the section body text from `text-sm` to `text-[13px]` (BulletList items) -- actually keep as is, the wider panel will help
- Add more vertical breathing room: change `gap-0` on the sections container to `gap-1`
- Add `mt-2` to the confidence container (currently `mt-4`) -- actually keep `mt-4`, just widen

#### Step 5: Verify the input screen is untouched
- `components/InputScreen.tsx` should NOT be modified
- The input screen is functional and acceptable as-is

### Files to modify
- MODIFY: `components/ResultLayout.tsx` -- remove FilePanel, keep two-panel layout
- MODIFY: `components/ReasoningPanel.tsx` -- widen panel, enlarge confidence score
- DO NOT MODIFY: `components/InputScreen.tsx`
- DO NOT MODIFY: `components/FilePanel.tsx` (keep file, just don't render it)
- DO NOT MODIFY: `app/api/explain/route.ts`

### Acceptance Criteria
- [ ] Result screen shows two panels only: CodePanel (left) + ReasoningPanel (right)
- [ ] No FilePanel / file explorer visible
- [ ] ReasoningPanel is wider (~400-440px)
- [ ] Confidence score is large (text-5xl) and visually dominant
- [ ] Progress bar is thicker (h-2.5)
- [ ] Code panel still shows original code, ghost suggestion, Accept/Discard buttons
- [ ] All five reasoning sections still render (Why, Assumptions, Impact, Verification)
- [ ] Input screen is unchanged
- [ ] `npm run build` passes with no errors
- [ ] Top header bar and bottom status bar still render correctly

---

## Known Issues and Backlog
- No syntax highlighting in code panels (intentional for prototype speed)
- No mobile layout for two-panel result view (input screen works on mobile)
- Confidence score is LLM pattern matching only, not grounded in static analysis
- Custom domain: configure explainable.harshit.ai in Vercel

## Project Log
[Technical decisions appended here automatically via claude-code-bridge.]
