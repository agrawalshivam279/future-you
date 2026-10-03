# Technical Specification: Step 5.1a — Core Life Model AI Prompt Generator

## 1. Context & Objectives
- **Module**: `src/lib/prompts/life-model-generator.ts`
- **Related Store**: `src/stores/life-model-store.ts`
- **Domain Types**: `LifeModel`, `HabitLever` from `src/types/life-model.types.ts`, `Persona` from `src/types/persona.types.ts`, `OnboardingData` from `src/types/onboarding.types.ts`
- **Objective**: Author the primary prompt generator and response parser for synthesizing user onboarding survey data into the dual 5-year simulation models (Current Path vs. Improved Path), enforcing the mandatory reflection disclaimer, strict tone differentiation, and schema conformance.

## 2. Requirements & Invariants
1. **Mandatory Honesty Disclaimer**:
   - The system prompt MUST contain: `"You are a reflection tool, not a prediction engine."`
2. **Character & Tone Differentiation**:
   - **Current Path (Inertia)**: Voice is reflective, pragmatic, carrying the subtle friction of unaddressed habits and deferred dreams, but never despairing or fatalistic.
   - **Improved Path (Deliberate Compound)**: Voice is energized, disciplined, grounded in everyday practice, avoiding magical thinking or overnight billionaire tropes.
3. **Structured Schema Output**:
   - Pure JSON response containing `currentPath`, `improvedPath`, and `habitLevers`.
   - Complete sub-objects for `career`, `health`, `finances`, and `relationships`.
   - Age calculation: current age + 5 years.
4. **Resilient JSON Parser (`parseLifeModelResponse`)**:
   - Handles LLM markdown code blocks (````json ... ````).
   - Validates required fields, populates missing attributes with safe fallbacks, injects unique `id`, `createdAt`, and original `inputs`.
5. **LOC & Privacy Invariants**:
   - Under 300 LOC per file.
   - Zero cloud persistence; no hardcoded API keys.

## 3. Testing Plan
- Test that `buildLifeModelSystemPrompt` includes the exact mandatory honesty disclaimer.
- Test that `buildLifeModelUserPrompt` correctly formats all 6 onboarding sections into the prompt payload.
- Test that `parseLifeModelResponse` correctly cleans markdown code blocks, parses valid JSON, and produces a valid `LifeModel` instance matching domain types.
- Test that `parseLifeModelResponse` throws helpful error if JSON is completely malformed.
