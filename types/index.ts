// Shared TypeScript types for the Explainable AI Coding Assistant

/** What the user pastes into the input screen */
export interface UserInput {
  originalCode: string;
  aiSuggestion: string;
  filename: string; // optional, defaults to "untitled.ts"
}

/** Structured analysis returned by the Claude API route */
export interface Analysis {
  confidence: number;       // 0-100, Claude-generated
  whyThisChange: string[];  // 2-4 bullets: why this approach over alternatives
  assumptions: string[];    // 2-3 bullets: what the AI is assuming about the codebase
  impactAnalysis: string[]; // 1-4 short labels: affected files or concerns
  verification: string;     // one concrete step to verify correctness
}

/** App-level state machine */
export type AppState =
  | { phase: 'input' }
  | { phase: 'loading'; input: UserInput }
  | { phase: 'result'; input: UserInput; analysis: Analysis }
  | { phase: 'error'; message: string; input: UserInput };

/** User decision after seeing the analysis */
export type Decision = 'pending' | 'accepted' | 'discarded';

/** API request body */
export interface ExplainRequest {
  originalCode: string;
  aiSuggestion: string;
  filename?: string;
}

/** API response body */
export interface ExplainResponse {
  analysis?: Analysis;
  error?: string;
}
