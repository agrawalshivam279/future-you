# Technical Specification: Step 5.2d — Letter & Regret/Gratitude Generation Orchestrators

## 1. Context & Objectives
- **Modules**:
  - `src/lib/ai/generate-letter.ts`: Orchestrates LLM prompt formulations, completions, and clean text extraction for future self letters (`generateLetter` and `generateLetters`).
  - `src/lib/ai/generate-regret-gratitude.ts`: Orchestrates structured regret and gratitude synthesis for Current and Improved paths (`generateRegretGratitude` and `generateDualRegretGratitude`).
- **Related Stores & Clients**: `src/stores/settings-store.ts`, `src/lib/ai/client.ts`, `src/lib/ai/ai-utils.ts`
- **Related Prompts**: `src/lib/prompts/letter-generator.ts`, `src/lib/prompts/regret-gratitude-generator.ts`
- **Domain Types**: `PersonaId`, `OnboardingData`, `RegretGratitudeResult`, `AISettings`
- **Objective**: Author the generation orchestrators for introspective future self letters and structured regret & gratitude lists for both Current and Improved paths, enforcing exponential backoff retries, token usage metrics, cancellation support via `AbortSignal`, and client-side privacy.

## 2. Requirements & Invariants
1. **Mandatory Honesty Disclaimer**:
   - Both orchestrator modules use system prompts (`buildLetterSystemPrompt` and `buildRegretGratitudeSystemPrompt`) containing: `"CRITICAL INVARIANT: You are a reflection tool, not a prediction engine."`
2. **Local-First & Client-Side Configuration**:
   - Dynamic credential lookup via `useSettingsStore.getState()` / `resolveAISettings()`.
   - Clear diagnostic error if API credentials are unconfigured.
3. **Resilient Text & JSON Parsing**:
   - `generateLetter`: Cleans extraneous markdown fencing and trims letter content.
   - `generateRegretGratitude`: Employs `parseRegretGratitudeResponse` with retry-aware `throwOnError` on non-final attempts and default fallbacks.
4. **Retry & Error Handling**:
   - Exponential backoff retries on transient errors.
   - Immediate termination on non-retryable errors (401 Unauthorized, unconfigured API key, or `AbortSignal`).
5. **Token Metrics Reporting**:
   - Reports usage metadata via optional `onTokenUsage` callbacks.
6. **Code Style & 300 LOC Invariant**:
   - Function declarations for exported functions.
   - Comprehensive JSDoc documentation.
   - Max 300 LOC per file.

## 3. Testing Plan
- Test `generateLetter` single path and `generateLetters` dual path synthesis.
- Test `generateRegretGratitude` single path and `generateDualRegretGratitude` dual path synthesis.
- Test error thrown when AI settings are unconfigured.
- Test retry mechanism on empty letter response or malformed regret/gratitude JSON.
- Test fatal non-retryable 401 Unauthorized errors halt immediately.
- Test `AbortSignal` cancellation immediately halts generation.
- Test token usage reporting callback.
