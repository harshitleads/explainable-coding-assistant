"use client";

import { useState } from "react";
import type { Analysis, Decision, UserInput } from "@/types";
import CodePanel from "./CodePanel";
import ReasoningPanel from "./ReasoningPanel";

interface Props {
  input: UserInput;
  analysis: Analysis;
  onReset: () => void;
}

// Two-panel result layout.
// CodePanel (left) | ReasoningPanel (right)
export default function ResultLayout({ input, analysis, onReset }: Props) {
  const [decision, setDecision] = useState<Decision>("pending");

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-5 py-2.5 border-b shrink-0"
        style={{
          background: "var(--bg-panel)",
          borderColor: "var(--border)",
          minHeight: "44px",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Explainable AI
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded font-mono"
            style={{ background: "var(--bg-subtle)", color: "var(--text-muted)" }}
          >
            Analysis complete
          </span>
        </div>

        <button
          onClick={onReset}
          className="text-xs px-3 py-1.5 rounded-md border transition-colors"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
            background: "transparent",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--text-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          Start over
        </button>
      </header>

      {/* Two-panel body */}
      <div className="flex flex-1 overflow-hidden">
        <CodePanel
          originalCode={input.originalCode}
          aiSuggestion={input.aiSuggestion}
          confidence={analysis.confidence}
          filename={input.filename}
          onDecision={setDecision}
          decision={decision}
        />
        <ReasoningPanel analysis={analysis} />
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between px-4 py-1.5 shrink-0"
        style={{
          background: "var(--accent)",
          minHeight: "24px",
        }}
      >
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-white opacity-90">main</span>
          <span className="text-xs text-white opacity-70">{input.filename}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white opacity-70">
            {input.originalCode.split("\n").length} lines
          </span>
          <span className="text-xs text-white opacity-70">
            <a
              href="https://harshit.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              harshit.ai
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
