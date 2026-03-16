"use client";

import { useState } from "react";
import type { Decision } from "@/types";

interface Props {
  originalCode: string;
  aiSuggestion: string;
  confidence: number;
  filename: string;
  onDecision: (decision: Decision) => void;
  decision: Decision;
}

// Returns Tailwind-compatible inline style values for confidence level
export function confidenceStyle(score: number): {
  color: string;
  label: string;
  bgColor: string;
} {
  if (score >= 75) {
    return { color: "var(--green)", label: "High Confidence", bgColor: "rgba(63,185,80,0.1)" };
  } else if (score >= 40) {
    return { color: "var(--yellow)", label: "Low Confidence", bgColor: "rgba(210,153,34,0.1)" };
  } else {
    return { color: "var(--red)", label: "Very Low", bgColor: "rgba(248,81,73,0.1)" };
  }
}

export default function CodePanel({
  originalCode,
  aiSuggestion,
  confidence,
  filename,
  onDecision,
  decision,
}: Props) {
  const { color, label, bgColor } = confidenceStyle(confidence);

  // Split code into lines for line-number rendering
  const originalLines = originalCode.split("\n");
  const suggestionLines = aiSuggestion.split("\n");

  return (
    <div
      className="flex flex-col h-full overflow-hidden flex-1"
      style={{ background: "var(--bg-base)", minWidth: 0 }}
    >
      {/* Tab bar — shows open file */}
      <div
        className="flex items-center border-b px-4 gap-4"
        style={{ borderColor: "var(--border)", background: "var(--bg-panel)", minHeight: "40px" }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2 border-b-2 text-xs font-mono"
          style={{ borderColor: "var(--accent)", color: "var(--text-primary)" }}
        >
          <span>{filename}</span>
        </div>

        {/* Confidence badge in tab bar */}
        <div
          className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
          style={{ background: bgColor, color }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: color }}
          />
          {confidence}% Confident
          <span className="ml-1 font-normal" style={{ color: "var(--text-muted)" }}>
            {label}
          </span>
        </div>
      </div>

      {/* Code display area */}
      <div className="flex-1 overflow-y-auto code-scroll font-mono text-sm">
        {decision === "accepted" ? (
          // Accepted state — show the accepted suggestion in full
          <AcceptedView lines={suggestionLines} filename={filename} />
        ) : decision === "discarded" ? (
          // Discarded state — show original code
          <DiscardedView lines={originalLines} />
        ) : (
          // Pending — show original + ghosted suggestion
          <PendingView
            originalLines={originalLines}
            suggestionLines={suggestionLines}
            confidence={confidence}
            color={color}
            label={label}
            bgColor={bgColor}
          />
        )}
      </div>

      {/* Action buttons — only shown while decision is pending */}
      {decision === "pending" && (
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t"
          style={{ borderColor: "var(--border)", background: "var(--bg-panel)" }}
        >
          <button
            onClick={() => onDecision("discarded")}
            className="px-4 py-2 rounded-md text-sm font-medium border transition-colors"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--red)";
              e.currentTarget.style.color = "var(--red)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            Discard
          </button>
          <button
            onClick={() => onDecision("accepted")}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{ background: "var(--accent)", color: "#fff", border: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Accept
          </button>
        </div>
      )}

      {/* Post-decision banner */}
      {decision !== "pending" && (
        <div
          className="flex items-center justify-between px-6 py-3 border-t text-sm"
          style={{
            borderColor: "var(--border)",
            background: decision === "accepted" ? "rgba(63,185,80,0.06)" : "rgba(248,81,73,0.06)",
            color: decision === "accepted" ? "var(--green)" : "var(--red)",
          }}
        >
          <span className="font-medium">
            {decision === "accepted" ? "Suggestion accepted" : "Suggestion discarded"}
          </span>
          <button
            onClick={() => onDecision("pending")}
            className="text-xs underline"
            style={{ color: "var(--text-muted)" }}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

// --- Sub-views ---

function LineNumbers({ count }: { count: number }) {
  return (
    <div
      className="select-none text-right pr-4 py-5 shrink-0"
      style={{
        color: "var(--text-muted)",
        borderRight: "1px solid var(--border-subtle)",
        minWidth: "52px",
        lineHeight: "1.625rem",
        fontSize: "0.8rem",
        paddingLeft: "12px",
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
}

function PendingView({
  originalLines,
  suggestionLines,
  confidence,
  color,
  label,
  bgColor,
}: {
  originalLines: string[];
  suggestionLines: string[];
  confidence: number;
  color: string;
  label: string;
  bgColor: string;
}) {
  return (
    <div>
      {/* Original code block */}
      <div className="flex">
        <LineNumbers count={originalLines.length} />
        <pre
          className="flex-1 py-5 px-4 overflow-x-auto code-scroll"
          style={{
            color: "var(--text-primary)",
            lineHeight: "1.625rem",
            fontSize: "0.8rem",
            margin: 0,
            background: "transparent",
          }}
        >
          {originalLines.map((line, i) => (
            <div key={i}>{line || " "}</div>
          ))}
        </pre>
      </div>

      {/* AI Suggestion divider */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 mx-0"
        style={{
          background: bgColor,
          borderTop: `1px solid ${color}30`,
          borderBottom: `1px solid ${color}30`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: color }}
        />
        <span className="text-xs font-medium" style={{ color }}>
          AI Suggestion
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {confidence}% confident
        </span>
        <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>
          · {label}
        </span>
        <span
          className="ml-auto text-xs px-1.5 py-0.5 rounded border font-mono"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-muted)",
            background: "var(--bg-subtle)",
          }}
        >
          Tab
        </span>
      </div>

      {/* Ghosted suggestion */}
      <div className="flex" style={{ opacity: 0.45 }}>
        <LineNumbers count={suggestionLines.length} />
        <pre
          className="flex-1 py-5 px-4 overflow-x-auto code-scroll"
          style={{
            color: "var(--text-primary)",
            lineHeight: "1.625rem",
            fontSize: "0.8rem",
            margin: 0,
            background: "transparent",
            fontStyle: "italic",
          }}
        >
          {suggestionLines.map((line, i) => (
            <div key={i}>{line || " "}</div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function AcceptedView({ lines, filename }: { lines: string[]; filename: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      {/* Accepted header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          background: "rgba(63,185,80,0.06)",
          borderBottom: "1px solid rgba(63,185,80,0.2)",
        }}
      >
        <div className="flex items-center gap-2">
          <CheckIcon />
          <span className="text-xs font-medium" style={{ color: "var(--green)" }}>
            Accepted — {filename}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 rounded transition-colors"
          style={{
            color: copied ? "var(--green)" : "var(--text-muted)",
            background: "var(--bg-subtle)",
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Accepted code */}
      <div className="flex">
        <LineNumbers count={lines.length} />
        <pre
          className="flex-1 py-5 px-4 overflow-x-auto code-scroll"
          style={{
            color: "var(--text-primary)",
            lineHeight: "1.625rem",
            fontSize: "0.8rem",
            margin: 0,
            background: "transparent",
          }}
        >
          {lines.map((line, i) => (
            <div key={i}>{line || " "}</div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function DiscardedView({ lines }: { lines: string[] }) {
  return (
    <div>
      {/* Discarded header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{
          background: "rgba(248,81,73,0.05)",
          borderBottom: "1px solid rgba(248,81,73,0.15)",
        }}
      >
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Original code — suggestion discarded
        </span>
      </div>

      <div className="flex">
        <LineNumbers count={lines.length} />
        <pre
          className="flex-1 py-5 px-4 overflow-x-auto code-scroll"
          style={{
            color: "var(--text-primary)",
            lineHeight: "1.625rem",
            fontSize: "0.8rem",
            margin: 0,
            background: "transparent",
          }}
        >
          {lines.map((line, i) => (
            <div key={i}>{line || " "}</div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="6" stroke="var(--green)" strokeWidth="1" />
      <path
        d="M3.5 6.5l2 2 3.5-3.5"
        stroke="var(--green)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
