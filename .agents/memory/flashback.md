# 🕰️ FLASHBACK — Project Memory & Decision Ledger

> **Project**: Future You
> **Status**: 📋 Phase 4 / Onboarding Wizard
> **Last Synchronized**: 2026-10-03

---

## 1. Executive Status Snapshot

Future You is a client-side web application using AI to generate two simulated future versions of the user (5 years from now). Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, and the OpenAI-compatible SDK.

| Module | Stack | Status |
| :--- | :--- | :--- |
| **UI Primitives & Layout** | React + Tailwind + Framer Motion | 🟢 Phase 1 Complete (100% Shipped) |
| **Type System** | TypeScript strict | 🟢 Phase 2 Complete (100% Shipped) |
| **State Management** | Zustand + localStorage + IndexedDB | 🟢 Phase 2 Complete (All 5 Stores Shipped) |
| **AI Integration** | OpenAI SDK (configurable) | 🟡 In Progress (Life Model Generator Shipped) |
| **Settings & Data Management** | React + Zustand + IndexedDB | 🟢 Phase 3 Complete (100% Shipped) |
| **Onboarding** | 6-step wizard | 🟢 Phase 4 Complete (100% Shipped) |
| **Dashboard** | Split view + Timeline + Habit Levers | 🔴 Not Started |
| **Chat** | Streaming persona chat | 🔴 Not Started |
| **Letter + TTS** | Web Speech API | 🔴 Not Started |

---

## 2. Architecture Decision Records (ADRs)

### ADR-001: Client-Side Only Architecture
- **Date**: 2026-10-03
- **Status**: Accepted
- **Context**: Privacy is the #1 principle. Users must trust that their personal reflections never leave their device.
- **Decision**: Build entirely client-side with Next.js 14. No backend, no database, no auth. All data in localStorage + IndexedDB. Only external calls are to the user's configured LLM API.
- **Consequences**: Zero hosting cost, zero privacy risk, but limited to browser storage limits.

### ADR-002: OpenAI-Compatible SDK for All Providers
- **Date**: 2026-10-03
- **Status**: Accepted
- **Context**: Users should be free to choose their LLM provider (OpenAI, Gemini, FreeLLMAPI, OpenRouter, etc.).
- **Decision**: Use the OpenAI SDK with configurable `baseURL`. All providers that offer OpenAI-compatible endpoints work out of the box.
- **Consequences**: Single SDK, single error-handling path. Some providers may have edge-case incompatibilities.

### ADR-003: Zustand Over React Context
- **Date**: 2026-10-03
- **Status**: Accepted
- **Context**: Need state management that works both inside and outside React components (AI modules need store access).
- **Decision**: Use Zustand with `persist` middleware for localStorage. IndexedDB for chat history (which can grow large).
- **Consequences**: Simpler than Context, no provider nesting, works in lib/ai/ modules.

### ADR-004: Mandatory /eval_persona Audit for AI Prompts & Chat Personas
- **Date**: 2026-10-03
- **Status**: Accepted
- **Context**: Future You generates two distinct personas (Current Path and Improved Path) across 1/3/5-year horizons. In Phase 5 (AI Integration Core) and Phase 9 (Chat Interface), prompt changes risk character drift, toxic positivity, fatalism, or schema mismatch.
- **Decision**: Mandate running `/eval_persona` during Phase 5 (validating prompt templates in `lib/prompts/`) and Phase 9 (evaluating persona chat grounding and tone differentiation).
- **Consequences**: Guarantees tone differentiation, structured JSON compliance, and presence of the mandatory reflection disclaimer.

---

## 3. Implementation Phase Tracker

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 0** | Project Scaffold & Tooling | 🟢 Completed |
| **Phase 1** | Design System & UI Primitives | 🟢 Completed |
| **Phase 2** | Type Definitions & State Management | 🟢 Completed |
| **Phase 3** | Settings & Configuration | 🟢 Completed |
| **Phase 4** | Onboarding Wizard | 🟢 Completed |
| **Phase 5** | AI Integration Core | 🟢 Completed |
| **Phase 6** | Generation Flow | 🟡 In Progress (Step 6.1b UI Components & Hook Shipped) |
| **Phase 7** | Dashboard & Split View | 🔴 Not Started |
| **Phase 8** | Timeline | 🔴 Not Started |
| **Phase 9** | Chat Interface | 🔴 Not Started *(⚠️ Run /eval_persona on persona chat tone)* |
| **Phase 10** | Habit Levers | 🔴 Not Started |
| **Phase 11** | Letter from Future Self + TTS | 🔴 Not Started |
| **Phase 12** | Regret & Gratitude View | 🔴 Not Started |
| **Phase 13** | Landing Page | 🔴 Not Started |
| **Phase 14** | Polish & Integration Testing | 🔴 Not Started |

---

## 4. Chronological Activity & Change Log

### [2026-10-04] — Step 6.1b: Generation Flow UI Components & Pipeline Hook Shipped
- **Details**: Implemented `useGenerationPipeline` hook (`src/hooks/use-generation-pipeline.ts`), `GenerationStepper` (`src/components/generation/generation-stepper.tsx`), `GenerationErrorCard` (`src/components/generation/generation-error-card.tsx`), and `ReflectiveQuoteTicker` (`src/components/generation/reflective-quote-ticker.tsx`). Drives the 5-stage generation lifecycle with client-side AbortController unmount safety, animated Framer Motion progress bars with full WCAG AA accessibility (`role="progressbar"`), clear error recovery actions (Try Again, Edit Onboarding), and philosophical quote ticker. 100% test coverage with 60 passing test suites (336 tests).
- **Commit**: `feat(generation): implement generation pipeline hook and ui stepper components`
- **Key Files**: `src/hooks/use-generation-pipeline.ts`, `src/components/generation/generation-stepper.tsx`, `src/components/generation/generation-error-card.tsx`, `src/components/generation/reflective-quote-ticker.tsx`, `src/components/generation/index.ts`, `docs/specs/step-6-1b-generation-ui.md`

### [2026-10-04] — Step 6.1a: Sequential Generation Pipeline Orchestrator Shipped
- **Details**: Implemented `generatePipeline` in `src/lib/ai/generate-pipeline.ts` with complete integration across all 5 AI modules (`generateLifeModel`, `generatePersonas`, `generateTimelines`, `generateLetters`, `generateDualRegretGratitude`). Provides granular stage tracking (`life-model` -> `personas` -> `timelines` -> `letters` -> `reflections` -> `complete`), cumulative token tracking across calls, immediate `AbortSignal` cancellation support, and unified `LifeModel` assembly with full persona structures. 100% test coverage with 56 passing test suites (321 tests).
- **Commit**: `feat(ai): implement sequential generation pipeline orchestrator with progress tracking`
- **Key Files**: `src/lib/ai/generate-pipeline.ts`, `src/lib/ai/index.ts`, `src/lib/ai/__tests__/generate-pipeline.test.ts`, `docs/specs/step-6-1a-generate-pipeline.md`

### [2026-10-04] — Step 5.2f: Habit Levers Futures Regeneration Orchestrator Shipped (Phase 5 Complete)
- **Details**: Implemented `applyLeverUpdates` and `regenerateFutures` in `src/lib/ai/regenerate-futures.ts`. Recalculates Improved Path persona and timeline dynamically when habit lever sliders shift, clamping values strictly to lever limits, preserving user inputs and Current Path data, supporting optional timeline regeneration, accumulating token metrics, and enforcing AbortSignal cancellation. Concludes Phase 5 AI Integration Core. 100% test coverage with 55 passing test suites (315 tests).
- **Commit**: `feat(ai): implement habit levers futures regeneration orchestrator with tests`
- **Key Files**: `src/lib/ai/regenerate-futures.ts`, `src/lib/ai/index.ts`, `src/lib/ai/__tests__/regenerate-futures.test.ts`, `docs/specs/step-5-2f-regenerate-futures.md`

### [2026-10-04] — Step 5.2e: Streaming Persona Chat Orchestrator Shipped
- **Details**: Implemented `chatWithPersona` and `buildChatMessages` in `src/lib/ai/chat-with-persona.ts`. Seamlessly connects persona conversational prompts (`buildCurrentPathSystemPrompt` and `buildImprovedPathSystemPrompt`) with historical chat transcripts, caps prior message history to `maxContextMessages` (default 16), executes OpenAI-compatible token streaming with real-time `onToken` callbacks, and supports immediate cancellation via `AbortSignal`. 100% test coverage with 54 passing test suites (308 tests).
- **Commit**: `feat(ai): implement streaming persona chat orchestrator with history and abort support`
- **Key Files**: `src/lib/ai/chat-with-persona.ts`, `src/lib/ai/index.ts`, `src/lib/ai/__tests__/chat-with-persona.test.ts`, `docs/specs/step-5-2e-chat-with-persona.md`

### [2026-10-04] — Step 5.2d: Future Self Letter & Regret/Gratitude Orchestrators Shipped
- **Details**: Implemented `generateLetter` & `generateLetters` in `src/lib/ai/generate-letter.ts`, and `generateRegretGratitude` & `generateDualRegretGratitude` in `src/lib/ai/generate-regret-gratitude.ts`. Leverages externalized prompt generators (`letter-generator.ts` and `regret-gratitude-generator.ts`) enforcing reflection disclaimers, authentic psychological tone differentiation, resilient JSON parsing with `throwOnError` retry capabilities, markdown fence stripping, and token usage metrics. 100% test coverage with 53 passing test suites (300 tests).
- **Commit**: `feat(ai): implement letter and regret-gratitude generation orchestrators with tests`
- **Key Files**: `src/lib/ai/generate-letter.ts`, `src/lib/ai/generate-regret-gratitude.ts`, `src/lib/ai/index.ts`, `src/lib/prompts/regret-gratitude-generator.ts`, `src/lib/ai/__tests__/generate-letter.test.ts`, `src/lib/ai/__tests__/generate-regret-gratitude.test.ts`, `docs/specs/step-5-2d-generate-letter-regret-gratitude.md`

### [2026-10-04] — Step 5.2c: Timeline Milestone Generation Orchestrator Shipped
- **Details**: Implemented `generateTimelines` (dual trajectory milestone generation for Years 1, 3, and 5) and `generateSingleTimeline` (targeted single trajectory milestone generation for habit levers) in `src/lib/ai/generate-timeline.ts`, with shared AI orchestration utilities in `src/lib/ai/ai-utils.ts`. Uses `timeline-generator.ts` prompt builders enforcing the mandatory reflection disclaimer, chronological milestone normalization (Years 1, 3, 5), mood normalization ('positive' | 'neutral' | 'negative'), token metrics accumulation, and exponential backoff retry. 100% test coverage with 51 passing test suites (285 tests).
- **Commit**: `feat(ai): implement timeline milestone generation orchestrator with retry and shared utilities`
- **Key Files**: `src/lib/ai/generate-timeline.ts`, `src/lib/ai/ai-utils.ts`, `src/lib/ai/index.ts`, `src/lib/prompts/timeline-generator.ts`, `src/lib/ai/__tests__/generate-timeline.test.ts`, `docs/specs/step-5-2c-generate-timeline.md`

### [2026-10-04] — Step 5.2b: Persona Generation & Enrichment Orchestrator Shipped
- **Details**: Implemented `buildPersonaSystemPrompt`, `buildPersonaUserPrompt`, and `parsePersonaResponse` in `src/lib/prompts/persona-generator.ts`, and orchestrated individual and dual persona synthesis via `generatePersona` and `generatePersonas` in `src/lib/ai/generate-personas.ts`. Integrates mandatory reflection disclaimer, psychological tone differentiation between Current and Improved trajectories, resilient code fence stripping with deep fallback defaults, token metrics accumulation, and exponential backoff retry logic. 100% test coverage with 50 passing test suites (278 tests).
- **Commit**: `feat(ai): implement persona generation and enrichment orchestrator`
- **Key Files**: `src/lib/prompts/persona-generator.ts`, `src/lib/prompts/index.ts`, `src/lib/ai/generate-personas.ts`, `src/lib/ai/index.ts`, `src/lib/prompts/__tests__/persona-generator.test.ts`, `src/lib/ai/__tests__/generate-personas.test.ts`, `docs/specs/step-5-2b-generate-personas.md`

### [2026-10-04] — Step 5.2a: Life Model Generation Orchestrator Shipped
- **Details**: Implemented `generateLifeModel` in `src/lib/ai/generate-life-model.ts` and exported it via `src/lib/ai/index.ts`. Consumes `OnboardingData`, connects to the configured OpenAI-compatible AI client using settings from `useSettingsStore`, applies system and user prompts with the mandatory reflection disclaimer, handles resilient parsing with fallbacks, supports `AbortSignal` cancellation, reports token usage metrics, and implements exponential backoff retries on transient errors while immediately halting on non-retryable 401/abort errors. 100% test coverage with 48 passing test suites (264 tests).
- **Commit**: `feat(ai): implement life model generation orchestrator with retry and validation`
- **Key Files**: `src/lib/ai/generate-life-model.ts`, `src/lib/ai/index.ts`, `src/lib/ai/__tests__/generate-life-model.test.ts`, `docs/specs/step-5-2a-generate-life-model.md`

### [2026-10-04] — Step 5.1e: Persona Fidelity Audit & Prompt Suite Verification Shipped
- **Details**: Executed comprehensive `/eval_persona` audit across all prompt templates in `src/lib/prompts/` (`life-model-generator.ts`, `system-current-path.ts`, `system-improved-path.ts`, `timeline-generator.ts`, `letter-generator.ts`, and `regret-gratitude-generator.ts`). All 5 evaluation vectors passed with 100% compliance: mandatory honesty reflection disclaimer verified across all templates, tone differentiation between Current and Improved paths maintained without fatalism or toxic positivity, strict schema conformance to TypeScript interfaces (`LifeModel`, `Persona`, `TimelineMilestone`), Year 1/3/5 horizons preserved, and LOC budget respected ($\le 300$ LOC/file). Formally concludes Section 5.1 of Phase 5.
- **Commit**: `docs(prompts): add eval_persona prompt fidelity audit report and complete step 5.1`
- **Key Files**: `docs/audits/eval-persona-report.md`, `implementation_plan.md`, `.agents/memory/flashback.md`

### [2026-10-04] — Step 5.1d: Letter & Regret/Gratitude Prompts Shipped
- **Details**: Implemented `buildLetterSystemPrompt` and `buildLetterUserPrompt` in `src/lib/prompts/letter-generator.ts`, and `buildRegretGratitudeSystemPrompt`, `buildRegretGratitudeUserPrompt`, and `parseRegretGratitudeResponse` in `src/lib/prompts/regret-gratitude-generator.ts`. Enforces the mandatory honesty reflection disclaimer ("You are a reflection tool, not a prediction engine.") across all system prompts, creates poignant and grounded psychological reflections comparing 5-year inertia with compound discipline, and provides resilient JSON extraction with typed fallbacks. 100% test coverage with 47 passing test suites (255 tests).
- **Commit**: `feat(prompts): add future self letter and regret-gratitude prompt generators`
- **Key Files**: `src/lib/prompts/letter-generator.ts`, `src/lib/prompts/regret-gratitude-generator.ts`, `src/lib/prompts/index.ts`, `src/lib/prompts/__tests__/letter-generator.test.ts`, `src/lib/prompts/__tests__/regret-gratitude-generator.test.ts`, `docs/specs/step-5-1d-letters-regrets-prompts.md`

### [2026-10-04] — Step 5.1c: Timeline Prompt Generator & Resilient Parser Shipped
- **Details**: Implemented `buildTimelineSystemPrompt`, `buildTimelineUserPrompt`, `buildSinglePathTimelineUserPrompt`, `parseTimelineResponse`, and `parseSinglePathTimelineResponse` in `src/lib/prompts/timeline-generator.ts`. Enforces the mandatory honesty reflection disclaimer ("You are a reflection tool, not a prediction engine."), chronological consistency (Years 1, 3, and 5), mood normalization ('positive' | 'neutral' | 'negative'), and resilient JSON parsing supporting both object and array markdown code fence completions with robust fallback milestones. 100% test coverage with 45 passing test suites (238 tests).
- **Commit**: `feat(prompts): add timeline prompt generator and resilient milestone parser`
- **Key Files**: `src/lib/prompts/timeline-generator.ts`, `src/lib/prompts/index.ts`, `src/lib/prompts/__tests__/timeline-generator.test.ts`, `docs/specs/step-5-1c-timeline-prompt.md`

### [2026-10-03] — Step 5.1b: Dual Persona System Prompts Shipped
- **Details**: Implemented `buildCurrentPathSystemPrompt` in `src/lib/prompts/system-current-path.ts` and `buildImprovedPathSystemPrompt` in `src/lib/prompts/system-improved-path.ts`. Injects mandatory reflection disclaimer ("You are a reflection tool, not a prediction engine."), persona age (current age + 5), and detailed dimensional anchors (career, health, finances, relationships, routine) while enforcing rigorous emotional tone differentiation (Current Path inertia without despair vs. Improved Path deliberate compounding without toxic positivity). 100% test coverage with 44 passing test suites (222 tests).
- **Commit**: `feat(prompts): implement current and improved path conversational system prompts`
- **Key Files**: `src/lib/prompts/system-current-path.ts`, `src/lib/prompts/system-improved-path.ts`, `src/lib/prompts/index.ts`, `src/lib/prompts/__tests__/system-prompts.test.ts`, `docs/specs/step-5-1b-persona-prompts.md`

### [2026-10-03] — Step 5.1a: Life Model AI Prompt Generator Shipped
- **Details**: Implemented `buildLifeModelSystemPrompt`, `buildLifeModelUserPrompt`, and `parseLifeModelResponse` in `src/lib/prompts/life-model-generator.ts`. Enforces the mandatory honesty reflection disclaimer ("You are a reflection tool, not a prediction engine."), psychological tone differentiation (Current Path inertia vs. Improved Path deliberate compounding), target 5-year age projection (current age + 5), and resilient JSON parsing with markdown code fencing stripping and fallback habit levers. 100% test coverage with 43 passing test suites (215 tests).
- **Commit**: `feat(prompts): implement life model prompt generator and resilient json response parser`
- **Key Files**: `src/lib/prompts/life-model-generator.ts`, `src/lib/prompts/index.ts`, `src/lib/prompts/__tests__/life-model-generator.test.ts`, `docs/specs/step-5-1a-life-model-prompt.md`

### [2026-10-03] — Step 4.2: Onboarding Form Validation & Completion Handshake Shipped
- **Details**: Implemented pure client-side validation engine in `src/lib/validation/onboarding-validator.ts` covering data invariants across all 6 onboarding steps (name/callsign min length, age bounds, at least 1 goal, valid habit metrics, 168-hour weekly budget constraint, required income and financial goal, required skills and career domain, core values, and anxieties). Integrated validation checks and accessible error alert notifications into `OnboardingWizard`, preventing advancement with empty or out-of-bounds fields and executing completion handshake (`setCompleted(true)`) upon final step submission. 100% test coverage with 42 passing test suites (208 tests). Completes Phase 4.
- **Commit**: `feat(onboarding): implement step validation engine, completion handshake, and error alerts`
- **Key Files**: `src/lib/validation/onboarding-validator.ts`, `src/lib/validation/index.ts`, `src/components/onboarding/onboarding-wizard.tsx`, `src/lib/validation/__tests__/onboarding-validator.test.ts`, `src/components/onboarding/__tests__/onboarding-wizard.test.tsx`, `docs/specs/step-4-2-onboarding-validation.md`

### [2026-10-03] — Step 4.1g: Fears, Values & Drivers Form Shipped
- **Details**: Implemented `FearsValuesStep` form component in `src/components/onboarding/steps/fears-values-step.tsx` integrating reusable `GoalListBuilder` for primary anxieties & potential regrets and non-negotiable core values with custom suggestions and badges, a past regrets & patterns to break reflection `Textarea`, a 3-way motivational drive selector (Internal, External, Mixed), and an appetite for risk slider (1–10) with dynamic risk tolerance mindset feedback. Integrated into `OnboardingWizard` on step 6 completing the full 6-step questionnaire. 100% test coverage with 41 passing test suites (199 tests).
- **Commit**: `feat(onboarding): implement step 6 fears and values form with motivation and risk tolerance`
- **Key Files**: `src/components/onboarding/steps/fears-values-step.tsx`, `src/components/onboarding/steps/index.ts`, `src/components/onboarding/onboarding-wizard.tsx`, `src/components/onboarding/steps/__tests__/fears-values-step.test.tsx`, `src/components/onboarding/__tests__/onboarding-wizard.test.tsx`, `docs/specs/step-4-1g-fears-step.md`

### [2026-10-03] — Step 4.1f: Skills & Learning Form Shipped
- **Details**: Implemented `SkillsStep` form component in `src/components/onboarding/steps/skills-step.tsx` integrating reusable `GoalListBuilder` for current core capabilities and target learning goals with custom suggestion chips and removable badges, a primary career domain input with common industry presets, a career satisfaction rating slider (1–10) with dynamic fulfillment notes, and a growth mindset orientation slider (1–10) with adaptive learning feedback. Integrated into `OnboardingWizard` on step 5 with real-time two-way synchronization to `useOnboardingStore`. 100% test coverage with 40 passing test suites (192 tests).
- **Commit**: `feat(onboarding): implement step 5 skills and learning form with skill builders and ratings`
- **Key Files**: `src/components/onboarding/steps/skills-step.tsx`, `src/components/onboarding/steps/index.ts`, `src/components/onboarding/onboarding-wizard.tsx`, `src/components/onboarding/steps/__tests__/skills-step.test.tsx`, `src/components/onboarding/__tests__/onboarding-wizard.test.tsx`, `docs/specs/step-4-1f-skills-step.md`

### [2026-10-03] — Step 4.1e: Finances & Resources Form Shipped
- **Details**: Implemented `MoneyStep` form component in `src/components/onboarding/steps/money-step.tsx` capturing current annual income bracket radiogroup (<$30k through $250k+), monthly savings & investment rate slider (0-100%) with dynamic wealth trajectory notes, debt burden level radiogroup (None, Low, Moderate, High), spending habits reflection selector, and primary 5-year financial milestone input with quick idea chips. Integrated into `OnboardingWizard` on step 4 with real-time two-way synchronization to `useOnboardingStore`. 100% test coverage with 39 passing test suites (184 tests).
- **Commit**: `feat(onboarding): implement step 4 finances and resources form with savings rate slider`
- **Key Files**: `src/components/onboarding/steps/money-step.tsx`, `src/components/onboarding/steps/index.ts`, `src/components/onboarding/onboarding-wizard.tsx`, `src/components/onboarding/steps/__tests__/money-step.test.tsx`, `src/components/onboarding/__tests__/onboarding-wizard.test.tsx`, `docs/specs/step-4-1e-money-step.md`

### [2026-10-03] — Step 4.1d: Weekly Time Allocation Form Shipped
- **Details**: Implemented `TimeStep` form component in `src/components/onboarding/steps/time-step.tsx` featuring an interactive 168-hour weekly budget visualizer (segmented progress bar showing sleep, career/work, study, social, creative, and downtime hours, with dynamic buffer/overbooked calculation) and 5 granular sliders with unit labels for work, study, social, creative, and wasted hours. Integrated into `OnboardingWizard` on step 3 with real-time two-way synchronization to `useOnboardingStore`. 100% test coverage with 38 passing test suites (176 tests).
- **Commit**: `feat(onboarding): implement step 3 time allocation form with 168-hour budget visualizer`
- **Key Files**: `src/components/onboarding/steps/time-step.tsx`, `src/components/onboarding/steps/index.ts`, `src/components/onboarding/onboarding-wizard.tsx`, `src/components/onboarding/steps/__tests__/time-step.test.tsx`, `src/components/onboarding/__tests__/onboarding-wizard.test.tsx`, `docs/specs/step-4-1d-time-step.md`

### [2026-10-03] — Step 4.1c: Habits & Lifestyle Form Shipped
- **Details**: Implemented `HabitsStep` form component in `src/components/onboarding/steps/habits-step.tsx` capturing nightly sleep hours slider (4-12 hrs), physical exercise frequency segmented radiogroup (Never, Rarely, Weekly, Daily), diet & nutrition quality radiogroup (Poor, Average, Good, Excellent), recreational screen time slider (0-16 hrs), and daily meditation/reflection practice toggle. Integrated into `OnboardingWizard` on step 2 with real-time two-way synchronization to `useOnboardingStore`. 100% test coverage with 37 passing test suites (167 tests).
- **Commit**: `feat(onboarding): implement step 2 habits and lifestyle form with sliders and radio groups`
- **Key Files**: `src/components/onboarding/steps/habits-step.tsx`, `src/components/onboarding/steps/index.ts`, `src/components/onboarding/onboarding-wizard.tsx`, `src/components/onboarding/step-wrapper.tsx`, `src/components/onboarding/steps/__tests__/habits-step.test.tsx`, `docs/specs/step-4-1c-habits-step.md`

### [2026-10-03] — Step 4.1b: Goals & Aspirations Form Shipped
- **Details**: Implemented `GoalsStep` form component in `src/components/onboarding/steps/goals-step.tsx` and modular `GoalListBuilder` in `src/components/onboarding/steps/goal-list-builder.tsx` capturing user callsign, current age (demographic anchor), 1-year short-term goals, 5-year long-term aspirations, quick suggestion chips, removable badges, and ideal dream life narrative text. Integrated into `OnboardingWizard` on step 1 with full two-way binding to `useOnboardingStore`. 100% test coverage with 36 passing test suites (161 tests).
- **Commit**: `feat(onboarding): implement step 1 goals and aspirations form with goal builder`
- **Key Files**: `src/components/onboarding/steps/goals-step.tsx`, `src/components/onboarding/steps/goal-list-builder.tsx`, `src/components/onboarding/steps/index.ts`, `src/components/onboarding/index.ts`, `src/components/onboarding/onboarding-wizard.tsx`, `src/components/onboarding/steps/__tests__/goals-step.test.tsx`, `src/components/onboarding/steps/__tests__/goal-list-builder.test.tsx`, `docs/specs/step-4-1b-goals-step.md`

### [2026-10-03] — Step 4.1a: Onboarding Wizard Scaffold & Navigation Shipped
- **Details**: Built the complete structural foundation of the 6-step Onboarding Wizard, including `ONBOARDING_STEPS` metadata in `src/components/onboarding/constants.ts`, responsive `WizardProgress` (desktop stepper bar with step states & mobile compact bar with percentage fill), animated `StepWrapper` using Framer Motion directional slide transitions, accessible `WizardNav` (Back / Continue controls with step counter), and `OnboardingWizard` coordinator managing state transitions synced to `useOnboardingStore`. Created `/onboarding` page view in `src/app/onboarding/page.tsx`. 100% test coverage with 34 passing test suites (150 tests).
- **Commit**: `feat(onboarding): implement wizard scaffold with step progress and slide transitions`
- **Key Files**: `src/components/onboarding/constants.ts`, `src/components/onboarding/wizard-progress.tsx`, `src/components/onboarding/step-wrapper.tsx`, `src/components/onboarding/wizard-nav.tsx`, `src/components/onboarding/onboarding-wizard.tsx`, `src/components/onboarding/index.ts`, `src/app/onboarding/page.tsx`, `docs/specs/step-4-1a-onboarding-wizard-scaffold.md`

### [2026-10-03] — Step 3.1b: Settings Data Management & Purge Shipped
- **Details**: Implemented client-side `exportLocalData`, `downloadDataAsJSON`, and `deleteAllLocalData` in `src/lib/storage/data-manager.ts`, extended `src/lib/storage/indexed-db.ts` with `clearIndexedDBDatabase`, and built `DataManagementCard` in `src/components/settings/data-management-card.tsx` with one-click JSON backup export, irreversible purge confirmation modal, zero cloud storage privacy statement, and toast notifications. Integrated into `/settings` page. 100% Phase 3 complete with 29 passing test suites (137 tests).
- **Commit**: `feat(settings): implement data backup export and local purge management`
- **Key Files**: `src/lib/storage/data-manager.ts`, `src/lib/storage/indexed-db.ts`, `src/components/settings/data-management-card.tsx`, `src/components/settings/index.ts`, `src/app/settings/page.tsx`, `src/lib/storage/__tests__/data-manager.test.ts`, `src/components/settings/__tests__/data-management-card.test.tsx`, `docs/specs/step-3-1b-data-management.md`

### [2026-10-03] — Step 3.1a: Settings API Configuration Form & Connection Tester Shipped
- **Details**: Implemented `createAIClient` and `testAIConnection` in `src/lib/ai/client.ts`, the full API configuration form in `src/components/settings/api-config-form.tsx` (provider presets for FreeLLMAPI, OpenAI, Gemini, OpenRouter, Custom; masked API key with show/hide toggle; baseURL & model name inputs; live connection tester with toast feedback; privacy warning banner), and the `/settings` page view in `src/app/settings/page.tsx`. Configured Node/jsdom Web Fetch API polyfills in `jest.setup.ts`. 100% test coverage with 27 passing test suites (130 tests).
- **Commit**: `feat(settings): implement api configuration form and connection tester`
- **Key Files**: `src/lib/ai/client.ts`, `src/components/settings/api-config-form.tsx`, `src/app/settings/page.tsx`, `src/components/layout/app-shell.tsx`, `jest.setup.ts`, `src/lib/ai/__tests__/client.test.ts`, `src/components/settings/__tests__/api-config-form.test.tsx`, `src/app/settings/__tests__/page.test.tsx`, `docs/specs/step-3-1a-api-config-form.md`

### [2026-10-03] — Step 2.2d: Chat Store & IndexedDB Storage Shipped
- **Details**: Implemented pure client-side `createIndexedDBStorage` in `src/lib/storage/indexed-db.ts` and `useChatStore` in `src/stores/chat-store.ts` managing multi-persona conversation logs (Current Path vs. Improved Path), message generation, token-by-token streaming accumulation, and selective IndexedDB persistence (`future-you-db`). 100% Phase 2 state architecture completed with unit tests.
- **Commit**: `feat(stores): implement chat store and async indexeddb storage adapter`
- **Key Files**: `src/lib/storage/indexed-db.ts`, `src/stores/chat-store.ts`, `src/stores/index.ts`, `jest.setup.ts`, `src/lib/storage/__tests__/indexed-db.test.ts`, `src/stores/__tests__/chat-store.test.ts`, `docs/specs/step-2-2d-chat-store.md`

### [2026-10-03] — Step 2.2c: Life Model Store Shipped
- **Details**: Implemented `useLifeModelStore` in `src/stores/life-model-store.ts` managing the generated AI LifeModel (Current Path & Improved Path personas, habit levers, generation lifecycle states, and errors) with immutable updates and `future-you:life-model` localStorage persistence. 100% test coverage.
- **Commit**: `feat(stores): implement life model and habit levers zustand store`
- **Key Files**: `src/stores/life-model-store.ts`, `src/stores/index.ts`, `src/stores/__tests__/life-model-store.test.ts`, `docs/specs/step-2-2c-life-model-store.md`

### [2026-10-03] — Step 2.2b: Onboarding Store Shipped
- **Details**: Implemented `useOnboardingStore` in `src/stores/onboarding-store.ts` managing the 6-step form flow, demographic basics, habits, weekly time allocation, financial goals, professional skills, and emotional drivers with bounded step navigation and `future-you:onboarding` localStorage persistence. 100% test coverage.
- **Commit**: `feat(stores): implement onboarding wizard zustand store with local persistence`
- **Key Files**: `src/stores/onboarding-store.ts`, `src/stores/index.ts`, `src/stores/__tests__/onboarding-store.test.ts`, `docs/specs/step-2-2b-onboarding-store.md`

### [2026-10-03] — Step 2.2a: Settings & UI Stores Shipped
- **Details**: Implemented universal OpenAI-compatible `useSettingsStore` (managing provider selection, apiKey, baseURL, modelName, temperature, and tokens with `future-you:settings` localStorage persistence) and `useUIStore` (managing active tabs, persona focus, and modal states under `future-you:ui`). 100% test coverage.
- **Commit**: `feat(stores): implement settings and ui zustand stores with local persistence`
- **Key Files**: `src/stores/settings-store.ts`, `src/stores/ui-store.ts`, `src/stores/index.ts`, `src/stores/__tests__/settings-store.test.ts`, `src/stores/__tests__/ui-store.test.ts`, `docs/specs/step-2-2a-settings-ui-stores.md`

### [2026-10-03] — Step 2.1: Core Domain Type Definitions Shipped
- **Details**: Established comprehensive, strictly typed domain interfaces and models for Onboarding data (goals, habits, time, money, skills, fears & values), Persona trajectories & sub-dimensions, Timeline milestones, AI LifeModel composite structures, ChatMessage & ChatConversation records, and AISettings & Provider presets. Complete with barrel export `src/types/index.ts` and 100% test validation.
- **Commit**: `feat(types): define core domain interfaces for onboarding, life-model, persona, and settings`
- **Key Files**: `src/types/onboarding.types.ts`, `src/types/timeline.types.ts`, `src/types/persona.types.ts`, `src/types/life-model.types.ts`, `src/types/chat.types.ts`, `src/types/settings.types.ts`, `src/types/index.ts`, `src/types/__tests__/types.test.ts`, `docs/specs/step-2-1-type-definitions.md`

### [2026-10-03] — Step 1.2: Layout Components & Disclaimer Modal Shipped
- **Details**: Implemented Header (sticky navbar, branding, settings shortcut), persistent Footer (honesty disclaimer & zero cloud storage privacy guarantee), DisclaimerModal (first-time visitor onboarding with localStorage persistence), and AppShell layout coordinator. 100% Phase 1 design system complete with unit tests.
- **Commit**: `feat(layout): implement header, footer, disclaimer modal, and app shell`
- **Key Files**: `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`, `src/components/layout/disclaimer-modal.tsx`, `src/components/layout/app-shell.tsx`, `src/app/layout.tsx`, `src/components/layout/__tests__/header.test.tsx`, `src/components/layout/__tests__/footer.test.tsx`, `src/components/layout/__tests__/disclaimer-modal.test.tsx`, `src/components/layout/__tests__/app-shell.test.tsx`, `docs/specs/step-1-2-layout-components.md`

### [2026-10-03] — Step 1.1d: Skeleton & Spinner Primitives Shipped
- **Details**: Implemented accessible Skeleton loading placeholder (predefined variants: default, circular, text, card; inline dimensions support; motion-safe pulse) and Spinner component (size: sm, md, lg, xl; variants: default, primary, current, improved; motion-safe spin; sr-only labels). 100% line coverage.
- **Commit**: `feat(ui): implement skeleton loader and spinner primitives`
- **Key Files**: `src/components/ui/skeleton.tsx`, `src/components/ui/spinner.tsx`, `src/components/ui/__tests__/skeleton.test.tsx`, `src/components/ui/__tests__/spinner.test.tsx`, `docs/specs/step-1-1d-skeleton-spinner.md`

### [2026-10-03] — Step 1.1c: Modal, Toast & Badge Primitives Shipped
- **Details**: Implemented accessible Modal (Framer Motion animations, Escape key dismiss, focus containment, body scroll locking), Toast notification system (ToastProvider context, useToast hook, auto-dismiss, ARIA polite live regions), and Badge component (status & persona variants). Tested with 100% line coverage.
- **Commit**: `feat(ui): implement modal, toast notification, and badge primitives`
- **Key Files**: `src/components/ui/modal.tsx`, `src/components/ui/toast.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/__tests__/modal.test.tsx`, `src/components/ui/__tests__/toast.test.tsx`, `src/components/ui/__tests__/badge.test.tsx`, `docs/specs/step-1-1c-modal-toast-badge.md`

### [2026-10-03] — Step 1.1b: Input, Textarea & Slider Primitives Shipped
- **Details**: Implemented accessible form controls (Input with labels/errors/icons, Textarea with multiline feedback, and Slider with track fill & ARIA indicators) with unit tests passing at 100% line coverage.
- **Commit**: `feat(ui): implement input, textarea, and range slider primitives`
- **Key Files**: `src/components/ui/input.tsx`, `src/components/ui/textarea.tsx`, `src/components/ui/slider.tsx`, `src/components/ui/__tests__/input.test.tsx`, `src/components/ui/__tests__/textarea.test.tsx`, `src/components/ui/__tests__/slider.test.tsx`, `docs/specs/step-1-1b-input-textarea-slider.md`

### [2026-10-03] — Step 1.1a: Button & Card Primitives Shipped
- **Details**: Implemented accessible Button and Card primitives with persona-aware border styling (amber for Current Path, emerald for Improved Path), responsive subcomponents, and unit tests with 100% line coverage.
- **Commit**: `feat(ui): implement accessible button and persona card primitives`
- **Key Files**: `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/__tests__/button.test.tsx`, `src/components/ui/__tests__/card.test.tsx`, `docs/specs/step-1-1a-button-card.md`

### [2026-10-03] — Step 0.1: Project Scaffold & Next.js 14 Tooling Shipped
- **Details**: Built physical Next.js 14 App Router foundation with Tailwind CSS design tokens, Zustand, Framer Motion, Jest unit tests (100% coverage), and root layout with persistent honesty disclaimer.
- **Commit**: `feat(scaffold): initialize next.js 14 app router with tailwind and zustand`
- **Key Files**: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/lib/constants.ts`, `src/lib/utils.ts`, `jest.config.js`, `jest.setup.ts`, `docs/specs/step-0-1-project-scaffold.md`

