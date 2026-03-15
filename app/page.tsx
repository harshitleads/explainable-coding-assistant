"use client";

import { useState } from "react";
import type { AppState, UserInput } from "@/types";
import InputScreen from "@/components/InputScreen";
import ResultLayout from "@/components/ResultLayout";

// App state machine:
//   input -> loading -> result
//                    -> error -> input (retry)
export default function Home() {
  const [state, setState] = useState<AppState>({ phase: "input" });

  async function handleAnalyze(input: UserInput) {
    setState({ phase: "loading", input });

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalCode: input.originalCode,
          aiSuggestion: input.aiSuggestion,
          filename: input.filename,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setState({
          phase: "error",
          message: data.error ?? "Something went wrong. Please try again.",
          input,
        });
        return;
      }

      setState({ phase: "result", input, analysis: data.analysis });
    } catch {
      setState({
        phase: "error",
        message: "Could not reach the server. Please check your connection and try again.",
        input,
      });
    }
  }

  function handleReset() {
    setState({ phase: "input" });
  }

  // Loading phase — full-screen spinner while Claude processes
  if (state.phase === "loading") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "var(--bg-base)" }}
      >
        <LoadingSpinner />
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Analyzing suggestion...
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {state.input.filename}
        </p>
      </div>
    );
  }

  // Error phase — friendly message with retry option
  if (state.phase === "error") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "var(--bg-base)" }}
      >
        <div
          className="w-full max-w-md rounded-xl border p-6 text-center"
          style={{ background: "var(--bg-panel)", borderColor: "var(--border)" }}
        >
          <div className="mb-3 flex justify-center">
            <ErrorIcon />
          </div>
          <h2 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Analysis failed
          </h2>
          <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
            {state.message}
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-md text-sm font-medium"
            style={{ background: "var(--accent)", color: "#fff", border: "none", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Result phase — three-panel layout
  if (state.phase === "result") {
    return (
      <ResultLayout
        input={state.input}
        analysis={state.analysis}
        onReset={handleReset}
      />
    );
  }

  // Input phase (default)
  return (
    <InputScreen
      onSubmit={handleAnalyze}
      isLoading={false}
    />
  );
}

// --- Loading components ---

function LoadingSpinner() {
  return (
    <svg className="animate-spin w-10 h-10" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke="var(--border)" strokeWidth="3" />
      <path
        d="M44 24a20 20 0 0 0-20-20"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <div
      className="inline-flex items-center justify-center w-10 h-10 rounded-full"
      style={{ background: "rgba(248,81,73,0.1)" }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 2L16.5 15H1.5L9 2Z"
          stroke="var(--red)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M9 7v3.5M9 12.5h.01"
          stroke="var(--red)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
