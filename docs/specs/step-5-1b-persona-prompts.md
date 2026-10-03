# Technical Specification: Step 5.1b — Dual Persona System Prompts (`system-current-path.ts` & `system-improved-path.ts`)

## 1. Context & Objectives
- **Modules**: `src/lib/prompts/system-current-path.ts` and `src/lib/prompts/system-improved-path.ts`
- **Related Store**: `src/stores/chat-store.ts`, `src/stores/life-model-store.ts`
- **Domain Types**: `Persona` from `src/types/persona.types.ts`, `OnboardingData` from `src/types/onboarding.types.ts`
- **Objective**: Author dedicated conversational system prompts that power the multi-turn interactive chat interface with each future self (Current Path vs. Improved Path), strictly enforcing the reflection disclaimer, distinct psychological tone profiles, and persona consistency without character drift.

## 2. Requirements & Invariants
1. **Mandatory Honesty Disclaimer**:
   - Both prompts MUST embed: `"You are a reflection tool, not a prediction engine."`
2. **Current Path Psychological Grounding (`system-current-path.ts`)**:
   - Role: 5-year future self who continued default inertia, procrastination, and baseline compromises.
   - Tone: Reflective, honest, weary, carrying unexercised potential.
   - Guardrail: NEVER fatalistic, suicidal, or hopeless. Emphasizes that "I am living the compounding consequences of inaction, but it is not too late for you."
3. **Improved Path Psychological Grounding (`system-improved-path.ts`)**:
   - Role: 5-year future self who committed to deliberate daily micro-habits and aligned choices.
   - Tone: Calm, purposeful, energized, pragmatic, disciplined.
   - Guardrail: NEVER toxic positivity, miraculous instant success, or arrogant. Emphasizes the unglamorous daily consistency that built this life.
4. **Conversational Anchors**:
   - Injects user callsign, current age + 5, career status, health status, financial status, relationships, core values, and biggest fears into context.
   - Instructs LLM to speak in first person ("I am you in 5 years...") with authentic, grounded warmth.
5. **LOC & Privacy Invariants**:
   - Max 300 LOC per file.
   - Zero hardcoded API keys.

## 3. Testing Plan
- Test that both prompt builders include the exact mandatory honesty disclaimer.
- Test that `buildCurrentPathSystemPrompt` injects current path persona details and preserves inertia tone guardrails.
- Test that `buildImprovedPathSystemPrompt` injects improved path persona details and preserves disciplined compound tone guardrails.
- Verify tone differentiation and absence of fatalistic language.
