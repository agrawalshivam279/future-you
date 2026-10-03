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
| **AI Integration** | OpenAI SDK (configurable) | 🟡 In Progress (Client & Ping Ready) |
| **Settings & Data Management** | React + Zustand + IndexedDB | 🟢 Phase 3 Complete (100% Shipped) |
| **Onboarding** | 6-step wizard | 🔴 Not Started |
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
| **Phase 4** | Onboarding Wizard | 🟡 In Progress (Steps 4.1a-e Shipped) |
| **Phase 5** | AI Integration Core | 🔴 Not Started *(⚠️ Run /eval_persona on prompt templates)* |
| **Phase 6** | Generation Flow | 🔴 Not Started |
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

