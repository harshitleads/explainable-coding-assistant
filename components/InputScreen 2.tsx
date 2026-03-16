"use client";

import { useState } from "react";
import type { UserInput } from "@/types";

const MAX_CHARS = 2000;

interface Props {
  onSubmit: (input: UserInput) => void;
  isLoading: boolean;
}

export default function InputScreen({ onSubmit, isLoading }: Props) {
  const [originalCode, setOriginalCode] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [filename, setFilename] = useState("untitled.ts");

  const canSubmit =
    originalCode.trim().length > 0 &&
    aiSuggestion.trim().length > 0 &&
    originalCode.length <= MAX_CHARS &&
    aiSuggestion.length <= MAX_CHARS &&
    !isLoading;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ originalCode, aiSuggestion, filename });
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <header className="border-b px-8 py-5" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Explainable AI
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              Trust through transparency
            </p>
          </div>
          <a
            href="https://harshit.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            harshit.ai
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-5xl">
          {/* Hero text */}
          <div className="mb-10 text-center">
            <h2
              className="text-3xl font-semibold tracking-tight mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Should you accept this suggestion?
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Paste your original code and the AI suggestion. Get back the rationale, tradeoffs, and what to verify before you accept.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Filename row */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium shrink-0" style={{ color: "var(--text-secondary)" }}>
                Filename
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="untitled.ts"
                className="text-xs px-3 py-1.5 rounded-md border outline-none transition-colors font-mono w-48"
                style={{
                  background: "var(--bg-panel)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                optional — helps Claude give file-aware analysis
              </span>
            </div>

            {/* Two code textareas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CodeTextarea
                label="Your original code"
                value={originalCode}
                onChange={setOriginalCode}
                placeholder={`// Paste your original code here\nconst data = await fetch(url)\n  .then(r => r.json());`}
                maxChars={MAX_CHARS}
              />
              <CodeTextarea
                label="AI suggestion"
                value={aiSuggestion}
                onChange={setAiSuggestion}
                placeholder={`// Paste the AI suggestion here\nconst response = await fetch(url);\nif (!response.ok) throw new Error(...);\nconst data = await response.json();`}
                maxChars={MAX_CHARS}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!canSubmit}
                className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-150"
                style={{
                  background: canSubmit ? "var(--accent)" : "var(--bg-subtle)",
                  color: canSubmit ? "#fff" : "var(--text-muted)",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  border: "none",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Spinner /> Analyzing...
                  </span>
                ) : (
                  "Analyze suggestion"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

interface CodeTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxChars: number;
}

function CodeTextarea({ label, value, onChange, placeholder, maxChars }: CodeTextareaProps) {
  const isOverLimit = value.length > maxChars;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
          {label}
        </label>
        <span
          className="text-xs font-mono"
          style={{ color: isOverLimit ? "var(--red)" : "var(--text-muted)" }}
        >
          {value.length.toLocaleString()} / {maxChars.toLocaleString()}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={14}
        spellCheck={false}
        className="w-full p-4 rounded-lg border text-sm font-mono resize-none outline-none transition-colors code-scroll"
        style={{
          background: "var(--bg-panel)",
          borderColor: isOverLimit ? "var(--red)" : "var(--border)",
          color: "var(--text-primary)",
          lineHeight: "1.6",
        }}
        onFocus={(e) =>
          !isOverLimit && (e.currentTarget.style.borderColor = "var(--accent)")
        }
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = isOverLimit ? "var(--red)" : "var(--border)")
        }
      />
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}
