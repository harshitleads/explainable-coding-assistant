# CLAUDE.md

## Vision and Mission
An explainability layer for AI code suggestions. Trust through transparency.

## Current Stack
- Next.js (App Router), TypeScript, Tailwind CSS
- Anthropic SDK (claude-sonnet-4-6)
- Deployed on Vercel at trust.harshit.ai

## Code Rules
- No em dashes anywhere in copy
- NEVER run git commit, git push, git reset, git checkout, or any git write commands
- NEVER delete files unless the task spec explicitly says to delete a specific named file

---

## ACTIVE TASK: Simplify Case Study Bubble — persistent, all pages

### What to Do

**1. Replace `components/CaseStudyBubble.tsx`** with this simplified version:

```tsx
"use client";

export default function CaseStudyBubble() {
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
    </a>
  );
}
```

**2. In `app/globals.css`**, REMOVE the mobile full-width override if present. Keep `bubbleIn` keyframe.

**3. Ensure bubble renders on ALL screens** (input, loading, result, error).

### Files to Touch (ONLY these)
- EDIT: `components/CaseStudyBubble.tsx`
- EDIT: `app/globals.css` (remove mobile override only)
