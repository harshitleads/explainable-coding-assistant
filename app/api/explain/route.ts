import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { Analysis, ExplainRequest, ExplainResponse } from "@/types";

// Initialize the Anthropic client — key is read from ANTHROPIC_API_KEY env var
const anthropic = new Anthropic();

// Build the prompt that instructs Claude how to analyze the suggestion.
// The entire value of this product is in the quality of this prompt.
function buildPrompt(originalCode: string, aiSuggestion: string, filename: string): string {
  return `You are an expert code reviewer helping a junior-to-mid developer evaluate an AI coding suggestion.

You will receive the original code and the AI's suggested replacement. Your job is to explain WHY this approach was chosen, what tradeoffs exist, and what the developer needs to know to decide whether to accept it.

FILE: ${filename}

ORIGINAL CODE:
\`\`\`
${originalCode}
\`\`\`

AI SUGGESTION:
\`\`\`
${aiSuggestion}
\`\`\`

Return ONLY valid JSON — no markdown fences, no explanation outside the JSON object.

{
  "confidence": <integer 0-100>,
  "whyThisChange": ["<bullet>", "<bullet>", "<bullet>"],
  "assumptions": ["<bullet>", "<bullet>"],
  "impactAnalysis": ["<label>", "<label>"],
  "verification": "<one concrete step>"
}

Rules:
- confidence: How well does this suggestion fit the original code's intent and context?
    75-100: Clearly improves the code, low risk
    40-74: May be correct but has notable assumptions or tradeoffs
    0-39: Makes large assumptions, high risk, or could break things
- whyThisChange: 2-4 short bullets explaining WHY this approach over alternatives. Focus on the tradeoff, not just what changed. No em dashes.
- assumptions: 2-3 bullets of what the AI is assuming about the codebase, data, or intent. No em dashes.
- impactAnalysis: 1-4 short labels like a filename, "Performance risk", "Type safety", "Breaking change", etc.
- verification: One concrete action the developer should take — a test command, a specific line to check, or a pattern to verify.

Be terse. Write for a developer who wants signal, not explanation.`;
}

export async function POST(req: NextRequest): Promise<NextResponse<ExplainResponse>> {
  try {
    const body: ExplainRequest = await req.json();
    const { originalCode, aiSuggestion, filename = "untitled.ts" } = body;

    // Basic validation — catch empty inputs before hitting the API
    if (!originalCode?.trim() || !aiSuggestion?.trim()) {
      return NextResponse.json(
        { error: "Both original code and AI suggestion are required." },
        { status: 400 }
      );
    }

    // Enforce input length limits to manage API cost
    if (originalCode.length > 2000 || aiSuggestion.length > 2000) {
      return NextResponse.json(
        { error: "Code inputs must be 2,000 characters or fewer each." },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(originalCode.trim(), aiSuggestion.trim(), filename);

    // Call Claude. Using claude-sonnet-4-6 for strong reasoning with fast responses.
    // Upgrade to claude-opus-4-6 if explanation quality needs improvement.
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    // Extract the text content from the response
    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude API.");
    }

    // Parse the JSON response — Claude should return clean JSON per the prompt
    let analysis: Analysis;
    try {
      analysis = JSON.parse(content.text) as Analysis;
    } catch {
      // If Claude returned text instead of JSON, surface a useful error
      throw new Error("Could not parse Claude response as JSON. Raw: " + content.text.slice(0, 200));
    }

    // Clamp confidence to 0-100 in case of model drift
    analysis.confidence = Math.max(0, Math.min(100, Math.round(analysis.confidence)));

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("[/api/explain]", message);

    return NextResponse.json(
      { error: "Failed to analyze the suggestion. Please try again." },
      { status: 500 }
    );
  }
}
