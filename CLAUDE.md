# CLAUDE.md

## Vision and Mission
An explainability layer for AI code suggestions. Developers paste their original code and an AI suggestion. The tool returns why the approach was chosen, what tradeoffs exist, and what the developer needs to verify before accepting. Target user: junior to mid-level developers using Copilot or Cursor who accept suggestions blindly or waste time verifying them.

## Current Stack
- Next.js (App Router), TypeScript, Tailwind CSS
- Anthropic SDK (claude-sonnet-4-6)
- Deployed on Vercel at trust.harshit.ai (requires ANTHROPIC_API_KEY env var)
- No auth -- fully public

## Architecture
- `app/page.tsx` -- state machine (input, loading, result, error)
- `app/api/explain/route.ts` -- Claude API route, server-side
- `components/InputScreen.tsx` -- input form with two code textareas and filename field
- `components/ResultLayout.tsx` -- two-panel wrapper: CodePanel (left) + ReasoningPanel (right)
- `components/FilePanel.tsx` -- EXISTS but NOT rendered. Removed from ResultLayout on 2026-04-04.
- `components/CodePanel.tsx` -- center panel (code, ghost suggestion, Accept/Discard)
- `components/ReasoningPanel.tsx` -- right panel (five AI reasoning sections, width 400px)
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

## Known Issues and Backlog
- No syntax highlighting in code panels (intentional for prototype speed)
- No mobile layout for two-panel result view (input screen works on mobile)
- Confidence score is LLM pattern matching only, not grounded in static analysis -- documented as known limitation on case study page

## Project Log

### 2026-03-14 -- Initial build
Built and deployed full Next.js app. Three-panel layout: FilePanel (left) + CodePanel (center) + ReasoningPanel (right). Claude API route server-side. Input screen with two textareas and filename field. Five reasoning sections always rendered. Deployed to Vercel.

### 2026-04-04 -- UI redesign shipped
Removed FilePanel from result layout. Now two panels: CodePanel + ReasoningPanel. ReasoningPanel widened to 400px (was 320px). Confidence score enlarged to text-5xl (was text-3xl). Progress bar thickened to h-2.5. Custom domain trust.harshit.ai live.

---

## ACTIVE TASK: Add Floating Case Study Bubble

### Context
Every sub-site in the portfolio needs a floating popup (bottom-right corner) linking back to its case study on harshit.ai. This helps hiring managers and recruiters discover the product thinking behind the tool. Same pattern as Eval Studio's bubble.

### What to Build
Create a new component `components/CaseStudyBubble.tsx` and render it in `app/page.tsx`.

### Component Spec: CaseStudyBubble.tsx

```tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function CaseStudyBubble() {
  const [visible, setVisible] = useState(false);
  const reappearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleShow = useCallback((delay: number) => {
    if (reappearTimer.current) clearTimeout(reappearTimer.current);
    reappearTimer.current = setTimeout(() => setVisible(true), delay);
  }, []);

  useEffect(() => {
    scheduleShow(3000);
    return () => {
      if (reappearTimer.current) clearTimeout(reappearTimer.current);
    };
  }, [scheduleShow]);

  function hide() {
    setVisible(false);
    scheduleShow(7000);
  }

  function handleDismiss(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    hide();
  }

  if (!visible) return null;

  return (
    <a
      href="https://harshit.ai/work/explainable-ai"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] flex items-center gap-[10px] rounded-2xl border px-4 py-3 no-underline transition-all hover:brightness-110"
      style={{
        background: "rgba(10,10,10,0.95)",
        borderColor: "rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        animation: "bubbleIn 0.4s ease-out",
      }}
    >
      <div
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
        style={{ background: "rgba(99,102,241,0.1)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent, #6366f1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </div>
      <div>
        <p className="text-[13px] font-medium" style={{ color: "#e2e8f0", margin: 0 }}>
          See the product thinking behind this
        </p>
        <p className="text-[11px]" style={{ color: "#94a3b8", margin: 0 }}>
          Research, design, and prototype process
        </p>
      </div>
      <button
        onClick={handleDismiss}
        className="ml-1 bg-transparent border-none cursor-pointer text-[16px] leading-none p-0"
        style={{ color: "#64748b" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#e2e8f0")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
        aria-label="Dismiss"
      >
        &#215;
      </button>
    </a>
  );
}
```

### Add the bubbleIn keyframe animation
In `app/globals.css`, add at the bottom (only if not already present):
```css
@keyframes bubbleIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Wire it into the page
In `app/page.tsx`:

1. Add import at top: `import CaseStudyBubble from "@/components/CaseStudyBubble";`

2. The page has multiple return paths (loading, error, result, input). The bubble must show on ALL screens. For each return block, wrap in a fragment and add the bubble:

   ```tsx
   // Example for loading phase:
   if (state.phase === "loading") {
     return (
       <>
         <div className="min-h-screen flex flex-col items-center justify-center gap-4" ...>
           ...
         </div>
         <CaseStudyBubble />
       </>
     );
   }
   ```

   Do the same for error, result, and input returns.

### Mobile Responsiveness
Add to globals.css alongside the keyframe:
```css
@media (max-width: 639px) {
  .fixed.bottom-6.right-6 {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
  }
}
```

### Acceptance Criteria
- [ ] Bubble appears bottom-right after 3 seconds on all screens (input, loading, result, error)
- [ ] Clicking the bubble opens https://harshit.ai/work/explainable-ai in a new tab
- [ ] Clicking x dismisses it; it reappears after 7 seconds
- [ ] Consistent with the dark purple/indigo theme of the app
- [ ] Works on mobile
- [ ] No em dashes in any copy

### Files to Touch
- CREATE: `components/CaseStudyBubble.tsx`
- EDIT: `app/page.tsx` (import + render in all return paths)
- EDIT: `app/globals.css` (keyframe + mobile media query)
