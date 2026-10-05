# Technical Specification: Step 16.2b — AI Check-in Reflection Prompt & Feedback Engine

> **Feature**: Version 3 — Check-in Mode (AI Reflection Prompt & Feedback Engine)  
> **Target Branch**: `feat/step-16-2b-check-in-feedback`  
> **Status**: In Progress  

---

## 1. Context & Objective

In Step 16.1, we implemented the persistent `check-in-store` and foundational domain types (`CheckInLog`, `HabitDriftVector`, `CheckInEvaluation`). In Step 16.2a, we shipped the mathematical scoring engine `drift-calculator.ts` that deterministically quantifies habit drift vectors and composite 0-100% alignment scores.

Step 16.2b integrates AI intelligence into Check-in Mode:
1. `src/lib/prompts/check-in-reflection.ts`: Authors prompt generators that ground the LLM in the user's logged habits, calculated drift vectors, baseline profile, and Improved Path persona, generating structured reflections.
2. `src/lib/ai/check-in-feedback.ts`: Provides a resilient client-side orchestrator that coordinates drift scoring, calls the user-configured LLM with timeout and retry handling, formats the complete `CheckInEvaluation`, and caches it into `useCheckInStore`.

---

## 2. Invariants & Guardrails

- **Client-Side Privacy**: All prompt creation and LLM invocations occur in the user's browser. Zero backend storage.
- **Honesty Disclaimer**: Every AI system prompt must explicitly state: *"You are a reflection tool, not a prediction engine"*.
- **Persona Grounding**: The voice reflects the **Improved Path Future Self** (5 years out). It is calm, empathetic, and grounded—acknowledging realistic obstacles without scolding, toxic positivity, or fatalism.
- **Structured JSON**: Output must be parsed from structured JSON:
  ```json
  {
    "futureSelfReflection": "2-3 sentences reflecting on current habit alignment and drift",
    "recommendedAdjustment": "One specific, realistic micro-action for the coming week",
    "encouragement": "One grounding phrase"
  }
  ```
- **Timeouts & Safety**: Enforce maximum 60-second execution window with `AbortController` and transient error retries.
- **File Length Limit**: Strictly $\le 300$ lines of code per file.

---

## 3. Interfaces & Modules

### 3.1 Prompt Module (`src/lib/prompts/check-in-reflection.ts`)
- `buildCheckInReflectionSystemPrompt(): string`
- `buildCheckInReflectionUserPrompt(log: CheckInLog, driftVectors: HabitDriftVector[], alignmentScore: number, inputs?: Partial<OnboardingData>, improvedPersona?: Partial<Persona>): string`
- `parseCheckInReflectionResponse(raw: string): CheckInReflectionResult`

### 3.2 AI Orchestrator (`src/lib/ai/check-in-feedback.ts`)
- `evaluateAndGenerateCheckInFeedback(log: CheckInLog, options?: CheckInFeedbackOptions): Promise<CheckInEvaluation>`
- Caches evaluation into `useCheckInStore.getState().setEvaluation(log.id, evaluation)`.

---

## 4. Verification Plan

1. **Prompt Unit Tests** (`src/lib/prompts/__tests__/check-in-reflection.test.ts`):
   - Validates mandatory honesty disclaimer in system prompt.
   - Validates prompt structure across surpassing, aligned, and drifting logs.
   - Validates robust JSON parsing and error handling for malformed outputs.
2. **AI Orchestrator Unit Tests** (`src/lib/ai/__tests__/check-in-feedback.test.ts`):
   - Validates end-to-end execution with mocked LLM client.
   - Validates store caching behavior in `useCheckInStore`.
   - Validates missing API key validation and abort signal propagation.
