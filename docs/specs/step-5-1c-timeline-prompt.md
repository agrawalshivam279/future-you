# Technical Specification: Step 5.1c — Timeline Prompt Generator & Resilient Parser

## 1. Context & Objectives
- **Target File**: `src/lib/prompts/timeline-generator.ts`
- **Associated Tests**: `src/lib/prompts/__tests__/timeline-generator.test.ts`
- **Roadmap Step**: Phase 5 (AI Integration Core), Step 5.1c
- **Goal**: Implement deterministic prompt generation and resilient parsing for 5-year chronological timeline milestones (Years 1, 3, and 5) across both Current Path and Improved Path trajectories.

---

## 2. Invariants & Guardrails
- **Honesty Disclaimer**: Must embed exact phrase: `"You are a reflection tool, not a prediction engine."`
- **Zero Cloud Storage**: All input and parsed timeline data operates client-side in memory.
- **Strict Data Contracts**: Output conforms to `TimelineMilestone` (`year: 1 | 3 | 5`, `mood: 'positive' | 'neutral' | 'negative'`).
- **File Length Limit**: Strictly $\le 300$ LOC per file.
- **Resilient Parsing**: Strips markdown code fences, sanitizes non-standard mood strings, normalizes year values, and supplies coherent fallback milestones on parse failure.

---

## 3. Public API & Interfaces

```typescript
export interface TimelineGenerationResult {
  currentTimeline: TimelineMilestone[];
  improvedTimeline: TimelineMilestone[];
}

export function buildTimelineSystemPrompt(): string;
export function buildTimelineUserPrompt(inputs: OnboardingData, currentSummary?: string, improvedSummary?: string): string;
export function buildSinglePathTimelineUserPrompt(path: 'current' | 'improved', inputs: OnboardingData, personaSummary?: string): string;
export function parseTimelineResponse(rawText: string, inputs?: OnboardingData): TimelineGenerationResult;
export function parseSinglePathTimelineResponse(rawText: string, path: 'current' | 'improved', inputs?: OnboardingData): TimelineMilestone[];
```

---

## 4. Verification & Testing Strategy
- Unit test suite verifying:
  1. System prompt contains reflection disclaimer.
  2. Dual user prompt injects user name, age, horizon milestones (Years 1, 3, 5), and persona context.
  3. Single path user prompt injects path-specific focus instructions.
  4. Response parser successfully extracts JSON from markdown-wrapped and clean completions.
  5. Parser normalizes unexpected moods (e.g., 'optimistic' -> 'positive', 'pessimistic' -> 'negative').
  6. Robust fallbacks populate valid milestones when completion is truncated or invalid.
