# Step 2.1 Technical Specification: Core Domain Type Definitions

## 1. Overview
Step 2.1 establishes the foundational TypeScript type definitions and interfaces for Future You in `src/types/`. These types form the contract between client-side Zustand stores, UI components, AI prompts, and browser persistence (localStorage + IndexedDB).

---

## 2. Invariants & Rules Checklist
- [x] Zero plain JavaScript: Strict TypeScript everywhere.
- [x] Type declaration style: Prefer `interface` over `type` (except for literal unions).
- [x] Naming: Suffix filenames with `.types.ts` in `src/types/`.
- [x] Max 300 LOC per file: Each type domain resides in its own isolated file.
- [x] JSDoc on every interface and type definition.
- [x] Barrel export: `src/types/index.ts` provides clean module exports.

---

## 3. Type Module Specifications

### 3.1 `src/types/onboarding.types.ts`
- Form models for 6-step onboarding wizard:
  - `GoalsData`: shortTerm, longTerm, dreamLife
  - `HabitsData`: sleepHours, exerciseFrequency, dietQuality, screenTime, meditationOrReflection
  - `TimeData`: workHoursPerWeek, studyHoursPerWeek, socialHoursPerWeek, creativeHoursPerWeek, wastedHoursPerWeek
  - `MoneyData`: incomeRange, savingsRate, debtLevel, spendingHabits, financialGoal
  - `SkillsData`: currentSkills, learningGoals, careerField, careerSatisfaction, growthMindset
  - `FearsAndValuesData`: biggestFears, coreValues, regrets, motivation, riskTolerance
  - `OnboardingData`: Root aggregation

### 3.2 `src/types/timeline.types.ts`
- Milestone data models:
  - `MilestoneYear`: `1 | 3 | 5`
  - `MilestoneMood`: `'positive' | 'neutral' | 'negative'`
  - `TimelineMilestone`: year, title, description, mood, metrics

### 3.3 `src/types/persona.types.ts`
- Persona simulation contracts:
  - `PersonaId`: `'current' | 'improved'`
  - Sub-dimensions: `PersonaCareer`, `PersonaHealth`, `PersonaFinances`, `PersonaRelationships`
  - `Persona`: Complete persona profile with narrative, routine, timeline, letter, regrets, and gratitudes

### 3.4 `src/types/life-model.types.ts`
- LLM-generated life simulation model:
  - `HabitLever`: id, label, min, max, step, currentValue, unit
  - `LifeModel`: id, createdAt, inputs, currentPath, improvedPath, habitLevers

### 3.5 `src/types/chat.types.ts`
- Streaming and persisted chat models:
  - `ChatMessageRole`: `'user' | 'assistant'`
  - `ChatMessage`: id, personaId, role, content, timestamp, isStreaming
  - `ChatConversation`: personaId, messages, lastUpdated

### 3.6 `src/types/settings.types.ts`
- Provider and client settings:
  - `AIProvider`: `'openai' | 'gemini' | 'freellmapi' | 'openrouter' | 'custom'`
  - `AISettings`: provider, apiKey, baseURL, modelName, temperature, maxTokens
  - `ProviderPreset`: metadata, presets, and validation rules

---

## 4. Verification Plan
- **TypeScript strict check**: `npx tsc --noEmit`
- **Lint**: `npm run lint`
- **Type Test**: `src/types/__tests__/types.test.ts` to assert runtime compatibility and type shapes.
