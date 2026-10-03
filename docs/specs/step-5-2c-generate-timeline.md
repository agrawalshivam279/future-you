# Technical Specification: Step 5.2c — Timeline Milestone Generation Orchestrator

## 1. Context & Objectives
- **Module**: `src/lib/ai/generate-timeline.ts`
- **Related Store**: `src/stores/settings-store.ts`, `src/stores/life-model-store.ts`
- **Related Client & Prompts**: `src/lib/ai/client.ts`, `src/lib/prompts/timeline-generator.ts`
- **Domain Types**: `TimelineMilestone`, `TimelineGenerationResult`, `OnboardingData`, `PersonaId`, `AISettings`
- **Objective**: Author the timeline generation orchestrator providing `generateTimelines` (synthesizing Years 1, 3, and 5 chronological milestones for both Current and Improved paths simultaneously) and `generateSingleTimeline` (for individual path regeneration during habit lever adjustments).

## 2. Requirements & Invariants
1. **Mandatory Honesty Disclaimer**:
   - Both orchestrator functions use `buildTimelineSystemPrompt()`, which injects: `"CRITICAL INVARIANT: You are a reflection tool, not a prediction engine. Frame all milestones as plausible exploratory projections based on compounding habits and human inertia, NEVER absolute certainties."`
2. **Chronological Structure (Years 1, 3, 5)**:
   - Enforces valid milestones for each of Years 1, 3, and 5.
   - Moods normalized to `'positive' | 'neutral' | 'negative'`.
3. **Local-First & Client-Side Configuration**:
   - Dynamic credential lookup: Default settings read from `useSettingsStore.getState()`.
   - Clear diagnostic error if API key is unconfigured (unless provider is `freellmapi`).
4. **Resilient Retry & Error Handling**:
   - Supports configurable retry attempts (default: 1 retry).
   - Halts immediately on non-retryable errors (401 Unauthorized, unconfigured credentials, or `AbortSignal`).
5. **Token Usage Metrics**:
   - Reports usage metadata (`promptTokens`, `completionTokens`, `totalTokens`) via optional `onTokenUsage` callback.
6. **Code Style & 300 LOC Invariant**:
   - Function declarations for exported functions.
   - Comprehensive JSDoc documentation.
   - Strictly under 300 LOC per file.

## 3. Testing Plan
- Test `generateTimelines` successfully produces both `currentTimeline` and `improvedTimeline` with 3 milestones each (Years 1, 3, 5).
- Test `generateSingleTimeline` successfully produces a single path's milestones.
- Test error thrown when settings are unconfigured.
- Test retry logic on malformed LLM responses.
- Test non-retryable 401 Unauthorized halts immediately.
- Test `AbortSignal` cancellation immediately aborts generation.
- Test token usage reporting callback.
