"use client";

import type { UserInput } from "@/types";

interface Props {
  input: UserInput;
}

// Left panel — shows file context.
// For the prototype this is partially decorative but grounds
// the tool in a realistic developer workflow.
export default function FilePanel({ input }: Props) {
  const ext = input.filename.split(".").pop() ?? "ts";
  const lang = languageLabel(ext);

  // Build a plausible path from the filename
  const parts = input.filename.split("/");
  const file = parts[parts.length - 1];
  const folder = parts.length > 1 ? parts.slice(0, -1).join("/") : "src";

  return (
    <aside
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: "var(--bg-panel)",
        borderRight: "1px solid var(--border)",
        width: "220px",
        minWidth: "180px",
        maxWidth: "240px",
      }}
    >
      {/* Panel header */}
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          Explorer
        </span>
      </div>

      {/* File tree */}
      <div className="flex-1 px-2 py-3 overflow-y-auto code-scroll">
        {/* Project root */}
        <div className="flex items-center gap-1.5 px-2 py-1">
          <ChevronDown />
          <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            project-root
          </span>
        </div>

        {/* src folder */}
        <div className="pl-4">
          <div className="flex items-center gap-1.5 px-2 py-1">
            <ChevronDown />
            <FolderIcon />
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {folder}
            </span>
          </div>

          {/* Active file — the one being analyzed */}
          <div
            className="pl-4 flex items-center gap-1.5 px-2 py-1 rounded-md mx-1"
            style={{ background: "var(--bg-subtle)" }}
          >
            <FileIcon ext={ext} />
            <span className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
              {file}
            </span>
          </div>
        </div>
      </div>

      {/* File metadata footer */}
      <div
        className="px-4 py-3 border-t flex flex-col gap-1"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <MetaRow label="Language" value={lang} />
        <MetaRow
          label="Original"
          value={`${input.originalCode.split("\n").length} lines`}
        />
        <MetaRow
          label="Suggestion"
          value={`${input.aiSuggestion.split("\n").length} lines`}
        />
      </div>
    </aside>
  );
}

// --- Sub-components ---

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
        {value}
      </span>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 3.5l3 3 3-3" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M1 3.5a1 1 0 0 1 1-1h2.5l1 1.5H11a1 1 0 0 1 1 1V9.5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3.5z"
        fill="var(--text-muted)"
        opacity="0.7"
      />
    </svg>
  );
}

function FileIcon({ ext }: { ext: string }) {
  // Color-code by file type
  const color =
    ext === "ts" || ext === "tsx"
      ? "#4493f8"
      : ext === "js" || ext === "jsx"
      ? "#d29922"
      : ext === "py"
      ? "#3fb950"
      : ext === "css"
      ? "#a78bfa"
      : "var(--text-muted)";

  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1" y="0.5" width="7.5" height="11" rx="1" fill={color} opacity="0.3" />
      <path d="M8.5 0.5L11 3H8.5V0.5Z" fill={color} opacity="0.6" />
      <path d="M3 4.5h5M3 6.5h4M3 8.5h3" stroke={color} strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

function languageLabel(ext: string): string {
  const map: Record<string, string> = {
    ts: "TypeScript",
    tsx: "TypeScript React",
    js: "JavaScript",
    jsx: "JavaScript React",
    py: "Python",
    go: "Go",
    rs: "Rust",
    rb: "Ruby",
    java: "Java",
    css: "CSS",
    html: "HTML",
    json: "JSON",
    md: "Markdown",
    sh: "Shell",
  };
  return map[ext] ?? ext.toUpperCase();
}
