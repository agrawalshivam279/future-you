# Technical Specification: Step 15.2 — AI Decision Simulator Prompt & Evaluation Engine

## 1. Overview
Step 15.2 delivers the AI evaluation pipeline for the **Decision Simulator ("What If?" Fork Engine)**. It creates the structured prompt templates and response parsing engine in `src/lib/prompts/decision-simulator.ts` and the resilient execution orchestrator in `src/lib/ai/simulate-decision.ts`. The engine projects a user's chosen life decision across Years 1, 3, and 5, scores multi-domain impacts (-10 to +10), generates first-person verdicts from both Current and Improved path personas, and surfaces unforeseen risks.

---

## 2. File Layout & LOC Budget
- **Prompt Builder & Parser**: `src/lib/prompts/decision-simulator.ts` ($\le 220$ LOC)
- **AI Orchestrator**: `src/lib/ai/simulate-decision.ts` ($\le 200$ LOC)
- **Prompt Unit Tests**: `src/lib/prompts/__tests__/decision-simulator.test.ts` ($\le 180$ LOC)
- **AI Orchestrator Tests**: `src/lib/ai/__tests__/simulate-decision.test.ts` ($\le 180$ LOC)

---

## 3. Data Flow & Interface Contracts

### 3.1 Prompt Engine (`src/lib/prompts/decision-simulator.ts`)
```typescript
export function buildDecisionSimulatorSystemPrompt(): string;
export function buildDecisionSimulatorUserPrompt(
  scenario: DecisionScenario,
  inputs?: Partial<OnboardingData>,
  currentPersona?: Partial<Persona>,
  improvedPersona?: Partial<Persona>
): string;
export function parseDecisionSimulatorResponse(
  rawContent: string,
  scenarioId: string
): DecisionEvaluation;
```

### 3.2 Evaluation Orchestrator (`src/lib/ai/simulate-decision.ts`)
```typescript
export interface SimulateDecisionOptions {
  signal?: AbortSignal;
  maxRetries?: number;
  customSettings?: AISettings;
  onProgress?: (status: string) => void;
  onTokenUsage?: (usage: TokenUsage) => void;
}

export async function simulateDecisionScenario(
  scenario: DecisionScenario,
  options?: SimulateDecisionOptions
): Promise<DecisionEvaluation>;
```

---

## 4. Privacy & System Invariants
1. **Honesty Disclaimer**: Every system prompt includes: *"You are a reflection tool, not a prediction engine. Frame these projections as exploratory what-if heuristics, never as prophetic certainties."*
2. **Deterministic Fallbacks**: If the LLM generates slightly malformed JSON, `parseDecisionSimulatorResponse` cleans markdown fences and normalizes delta scores into valid $[-10, 10]$ boundaries.
3. **Timeout & Abort**: Built-in 60s timeout abort controller using `AI_TIMEOUT_MS`.
4. **Zero Cloud Storage**: All outputs return to caller to store directly into client-side Zustand store (`future-you:decisions`).
5. **LOC Invariant**: Strictly $\le 300$ lines per file.
