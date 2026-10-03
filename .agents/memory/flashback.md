# 🕰️ FLASHBACK — Project Memory & Decision Ledger

> **Project**: Future You
> **Status**: 📋 Phase 2 / Type Definitions & State Management
> **Last Synchronized**: 2026-10-03

---

## 1. Executive Status Snapshot

Future You is a client-side web application using AI to generate two simulated future versions of the user (5 years from now). Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, and the OpenAI-compatible SDK.

| Module | Stack | Status |
| :--- | :--- | :--- |
| **UI Primitives & Layout** | React + Tailwind + Framer Motion | 🟢 Phase 1 Complete (100% Shipped) |
| **Type System** | TypeScript strict | 🔴 Not Started |
| **State Management** | Zustand + localStorage + IndexedDB | 🔴 Not Started |
| **AI Integration** | OpenAI SDK (configurable) | 🔴 Not Started |
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
| **Phase 2** | Type Definitions & State Management | 🔴 Not Started |
| **Phase 3** | Settings & Configuration | 🔴 Not Started |
| **Phase 4** | Onboarding Wizard | 🔴 Not Started |
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

