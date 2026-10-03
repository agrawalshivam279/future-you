# Technical Specification: Step 5.1d — Letters & Regret/Gratitude Prompts

## 1. Context & Objectives
- **Target Files**:
  - `src/lib/prompts/letter-generator.ts`
  - `src/lib/prompts/regret-gratitude-generator.ts`
- **Associated Tests**:
  - `src/lib/prompts/__tests__/letter-generator.test.ts`
  - `src/lib/prompts/__tests__/regret-gratitude-generator.test.ts`
- **Roadmap Step**: Phase 5 (AI Integration Core), Step 5.1d
- **Goal**: Implement deterministic prompt generation for the future self's introspective letter and structured regret/gratitude extractions for both Current Path and Improved Path personas.

---

## 2. Invariants & Guardrails
- **Honesty Disclaimer**: Every system prompt must embed the exact phrase: `"You are a reflection tool, not a prediction engine."`
- **Tone Differentiation**:
  - Current Path: A poignant, honest letter from a future self living through 5 more years of inertia; loving but sobering reflection on quiet procrastination and deferred aspirations. Regrets heavily outweigh gratitudes.
  - Improved Path: An inspiring, grounded letter acknowledging the real difficulty of habit change and gratitude for daily discipline. Gratitudes heavily outweigh regrets.
- **Strict Data Contracts**:
  - Letter prompt generates 3-5 paragraph prose suitable for display and Web Speech API TTS reading.
  - Regret/Gratitude response parses strictly into `{ regrets: string[], gratitudes: string[] }` with fallbacks.
- **File Length Limit**: Strictly $\le 300$ LOC per file.
- **Zero Cloud Storage**: All prompts and parsed structures operate client-side only.

---

## 3. Public APIs & Signatures

### Letter Generator (`src/lib/prompts/letter-generator.ts`)
```typescript
export function buildLetterSystemPrompt(path: PersonaId): string;
export function buildLetterUserPrompt(
  path: PersonaId,
  inputs?: Partial<OnboardingData>,
  personaContext?: string
): string;
```

### Regret & Gratitude Generator (`src/lib/prompts/regret-gratitude-generator.ts`)
```typescript
export interface RegretGratitudeResult {
  regrets: string[];
  gratitudes: string[];
}

export function buildRegretGratitudeSystemPrompt(path: PersonaId): string;
export function buildRegretGratitudeUserPrompt(
  path: PersonaId,
  inputs?: Partial<OnboardingData>,
  personaContext?: string
): string;
export function parseRegretGratitudeResponse(
  rawText: string,
  path: PersonaId,
  inputs?: Partial<OnboardingData>
): RegretGratitudeResult;
```

---

## 4. Verification & Testing Strategy
- Unit tests verifying:
  1. System prompts contain the mandatory honesty disclaimer.
  2. Letter prompts ground the tone according to `current` vs. `improved` paths.
  3. Prompts inject user name, current age, target age (age + 5), career, goals, and fears.
  4. Regret/Gratitude parser extracts JSON from markdown-wrapped and raw completions.
  5. Parser provides graceful, high-quality fallback items when output is truncated or malformed.
