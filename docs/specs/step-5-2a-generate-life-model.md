# Technical Specification: Step 5.2a — Life Model Generation Orchestrator

## 1. Context & Objectives
- **Module**: `src/lib/ai/generate-life-model.ts`
- **Related Store**: `src/stores/settings-store.ts`, `src/stores/life-model-store.ts`
- **Related Client & Prompts**: `src/lib/ai/client.ts`, `src/lib/prompts/life-model-generator.ts`
- **Domain Types**: `LifeModel`, `OnboardingData`, `AISettings`
- **Objective**: Author the primary generation orchestrator function `generateLifeModel()` that consumes validated `OnboardingData`, connects to the configured OpenAI-compatible AI client, issues system and user reflection prompts, handles streaming/non-streaming response extraction, parses and validates the structured `LifeModel`, provides exponential backoff retry on transient/parse errors, tracks token usage metrics, supports `AbortSignal` cancellation, and handles errors with user-friendly diagnostics.

## 2. Requirements & Invariants
1. **Mandatory Honesty Disclaimer**:
   - The generation orchestrator uses `buildLifeModelSystemPrompt()`, which injects `"You are a reflection tool, not a prediction engine."`
2. **Local-First & Client-Side Configuration**:
   - Dynamic credential lookup: Default settings read from `useSettingsStore.getState()`.
   - Never hardcode API keys or send data to intermediate cloud backend servers.
   - If not configured (missing key when required), throws a clean user-facing error.
3. **Resilient Retry & Error Taxonomy**:
   - Supports configurable retry attempts (default: 1 retry, maxRetries adjustable).
   - Differentiates between non-retryable errors (e.g. `AbortError`, 401 Unauthorized, unconfigured API key) and retryable errors (parse errors, 429 rate limit, 500/503 server error).
   - AbortController / AbortSignal cancellation immediately halts execution without retrying.
4. **Token Usage Reporting**:
   - Captures usage metadata (`promptTokens`, `completionTokens`, `totalTokens`) when returned by the LLM response, reporting via an optional `onTokenUsage` callback.
5. **Code Style & 300 LOC Invariant**:
   - Function declarations for exported and utility functions.
   - Comprehensive JSDoc documentation on all exports.
   - Maximum 300 lines of code per file.

## 3. Testing Plan
- Test successful generation with mocked OpenAI client returning valid JSON completion.
- Test that missing API credentials throw a clear descriptive error.
- Test retry mechanism when first response is invalid JSON, succeeding on second attempt.
- Test fatal non-retryable errors (e.g. 401 Unauthorized, aborted signal).
- Test token usage reporting callback when usage metrics are present in response.
- Test custom settings injection bypassing the store.
