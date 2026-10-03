# Technical Specification: Step 5.2b — Persona Generation & Enrichment Orchestrator

## 1. Context & Objectives
- **Modules**:
  - `src/lib/prompts/persona-generator.ts`: Externalized system and user prompt formulation and resilient JSON parsing for individual personas.
  - `src/lib/ai/generate-personas.ts`: Generation orchestrator invoking the OpenAI-compatible client to synthesize or enrich individual and dual personas (`currentPath` and `improvedPath`).
- **Related Stores & Clients**: `src/stores/settings-store.ts`, `src/lib/ai/client.ts`
- **Domain Types**: `Persona`, `PersonaId`, `OnboardingData`, `HabitLever`, `AISettings`
- **Objective**: Author dedicated prompt builders and LLM generation orchestrators (`generatePersona` and `generatePersonas`) to synthesize rich 5-year future self profiles (career, health, finances, relationships, emotional state, daily routine, skills, achievements, struggles) with exponential backoff retries, resilient JSON schema parsing, token usage metrics, and `AbortSignal` cancellation support.

## 2. Requirements & Invariants
1. **Mandatory Honesty Disclaimer**:
   - `buildPersonaSystemPrompt(pathId)` MUST contain: `"You are a reflection tool, not a prediction engine."`
2. **Psychological & Emotional Tone Differentiation**:
   - **Current Path (`current`)**: Weary, honest, reflective, carrying unaddressed frictions and delayed decisions over 5 continuous years without nihilism or despair.
   - **Improved Path (`improved`)**: Calm, purposeful, disciplined, compounding steady micro-habits without toxic positivity or miraculous fantasies.
3. **Structured Schema Output & Resilient Parser**:
   - Parses pure JSON or markdown code fenced objects with fallback defaults.
   - Preserves or injects `id`, `name`, `age` (current age + 5), `career`, `health`, `finances`, `relationships`, `dailyRoutine`, `skills`, `achievements`, `struggles`.
4. **Local-First & Client-Side Privacy**:
   - Zero backend persistence. Settings dynamically retrieved from `useSettingsStore.getState()`.
   - Clear diagnostic error if API key is not configured (unless provider is `freellmapi`).
5. **Robust Retry & Cancellation**:
   - Configurable retry attempts on parse or transient HTTP failures.
   - Immediate halt on fatal errors (401 Unauthorized, unconfigured credentials, or `AbortSignal`).
6. **Code Style & 300 LOC Invariant**:
   - Max 300 LOC per file.
   - Function declarations for exported functions.
   - Comprehensive JSDoc documentation.

## 3. Testing Plan
- Test that `buildPersonaSystemPrompt` contains the honesty disclaimer and distinguishes Current vs Improved paths.
- Test `parsePersonaResponse` handles valid JSON, stripped code fences, and fills missing fields with typed fallbacks.
- Test `generatePersona` succeeds with valid mocked OpenAI completion.
- Test `generatePersonas` synthesizes both Current and Improved personas concurrently.
- Test unconfigured settings throw clear user-friendly error.
- Test retry logic on malformed JSON responses.
- Test fatal non-retryable errors (401 Unauthorized, `AbortSignal`).
