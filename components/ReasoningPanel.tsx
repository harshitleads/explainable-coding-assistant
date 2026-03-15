"use client";

import type { Analysis } from "@/types";
import { confidenceStyle } from "./CodePanel";

interface Props {
  analysis: Analysis;
}

// Right panel — the core product surface.
// Five sections, always rendered. Content quality depends on the Claude prompt.
export default function ReasoningPanel({ analysis }: Props) {
  const { color, label, bgColor } = confidenceStyle(analysis.confidence);

  return (
    <aside
      className="flex flex-col h-full overflow-y-auto code-scroll"
      style={{
        background: "var(--bg-panel)",
        borderLeft: "1px solid var(--border)",
        width: "320px",
        minWidth: "280px",
        maxWidth: "360px",
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center gap-2 px-5 py-3 border-b shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <SparkleIcon />
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          AI Reasoning
        </span>
      </div>

      {/* Confidence score — hero section */}
      <div
        className="mx-4 mt-4 mb-2 rounded-lg p-4 shrink-0"
        style={{ background: bgColor, border: `1px solid ${color}25` }}
      >
        <div className="flex items-center justify-between mb-1">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Confidence Score
          </span>
          <ConfidenceIcon score={analysis.confidence} color={color} />
        </div>

        {/* Score number */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-bold tracking-tight" style={{ color }}>
            {analysis.confidence}%
          </span>
          <span className="text-sm font-medium" style={{ color }}>
            {label}
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="mt-3 h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${analysis.confidence}%`,
              background: color,
            }}
          />
        </div>
      </div>

      {/* Five sections */}
      <div className="flex flex-col gap-0 flex-1 pb-4">
        <Section
          title="Why this change"
          icon={<WhyIcon />}
          color="var(--accent)"
        >
          <BulletList items={analysis.whyThisChange} />
        </Section>

        <Section
          title="Assumptions"
          icon={<AssumptionsIcon />}
          color="var(--accent)"
        >
          <BulletList items={analysis.assumptions} />
        </Section>

        <Section
          title="Impact Analysis"
          icon={<ImpactIcon />}
          color="var(--accent)"
        >
          <TagList items={analysis.impactAnalysis} />
        </Section>

        <Section
          title="Verification"
          icon={<VerifyIcon />}
          color="var(--accent)"
        >
          <CodeBlock content={analysis.verification} />
        </Section>
      </div>
    </aside>
  );
}

// --- Sub-components ---

function Section({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 pt-4">
      {/* Section header with left accent bar */}
      <div className="flex items-center gap-2 mb-2.5">
        <div
          className="w-0.5 h-4 rounded-full shrink-0"
          style={{ background: color }}
        />
        <div className="flex items-center gap-1.5">
          <span style={{ color: "var(--text-muted)" }}>{icon}</span>
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            {title}
          </span>
        </div>
      </div>
      <div className="pl-3">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm leading-snug">
          <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: "var(--text-muted)" }} />
          <span style={{ color: "var(--text-secondary)" }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span
          key={i}
          className="text-xs px-2.5 py-1 rounded-md font-mono"
          style={{
            background: "var(--bg-subtle)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function CodeBlock({ content }: { content: string }) {
  const isCommand = content.startsWith("npm ") || content.startsWith("yarn ") || content.startsWith("pnpm ") || content.startsWith("npx ") || content.startsWith("python ") || content.startsWith("go ") || content.startsWith("cargo ");

  return (
    <div
      className="rounded-md px-3 py-2.5 font-mono text-xs leading-relaxed"
      style={{
        background: "var(--bg-base)",
        border: "1px solid var(--border-subtle)",
        color: "var(--text-secondary)",
      }}
    >
      {isCommand && (
        <span className="mr-1.5" style={{ color: "var(--green)" }}>
          $
        </span>
      )}
      {content}
    </div>
  );
}

// --- Icons ---

function SparkleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M6.5 1L7.5 5.5H12L8.5 8L9.5 12.5L6.5 10L3.5 12.5L4.5 8L1 5.5H5.5L6.5 1Z"
        stroke="var(--accent)"
        strokeWidth="1"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function WhyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
      <path d="M6 4v2.5M6 8h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function AssumptionsIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 2h8M2 5h6M2 8h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ImpactIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v4l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="7" r="4.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function VerifyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 2.5h8v7H2z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <path d="M4 5.5l1.5 1.5L8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ConfidenceIcon({ score, color }: { score: number; color: string }) {
  if (score >= 75) {
    // Checkmark circle
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.5" />
        <path d="M5 8l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // Warning triangle
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L14.5 13H1.5L8 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6.5v3M8 11h.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
