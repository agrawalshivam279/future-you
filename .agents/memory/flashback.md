# 🕰️ FLASHBACK — Project Memory & Decision Ledger

> **Project**: Future You
> **Status**: 📋 Phase 0 / Project Scaffold (In Planning)
> **Last Synchronized**: 2026-10-03

---

## 1. Executive Status Snapshot

Future You is a client-side web application using AI to generate two simulated future versions of the user (5 years from now). Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, and the OpenAI-compatible SDK.

| Module | Stack | Status |
| :--- | :--- | :--- |
| **UI Primitives** | React + Tailwind + Framer Motion | 🔴 Not Started |
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

---

## 3. Implementation Phase Tracker

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 0** | Project Scaffold & Tooling | 🟡 In Progress |
| **Phase 1** | Design System & UI Primitives | 🔴 Not Started |
| **Phase 2** | Type Definitions & State Management | 🔴 Not Started |
| **Phase 3** | Settings & Configuration | 🔴 Not Started |
| **Phase 4** | Onboarding Wizard | 🔴 Not Started |
| **Phase 5** | AI Integration Core | 🔴 Not Started |
| **Phase 6** | Generation Flow | 🔴 Not Started |
| **Phase 7** | Dashboard & Split View | 🔴 Not Started |
| **Phase 8** | Timeline | 🔴 Not Started |
| **Phase 9** | Chat Interface | 🔴 Not Started |
| **Phase 10** | Habit Levers | 🔴 Not Started |
| **Phase 11** | Letter from Future Self + TTS | 🔴 Not Started |
| **Phase 12** | Regret & Gratitude View | 🔴 Not Started |
| **Phase 13** | Landing Page | 🔴 Not Started |
| **Phase 14** | Polish & Integration Testing | 🔴 Not Started |

---

## 4. Chronological Activity & Change Log

### [2026-10-03] — Phase 0: Project Scaffold & Tooling Setup
- **Details**: Initial project scaffolding completed.
  - Next.js 14 project with App Router initialized
  - TypeScript strict mode configured
  - Tailwind CSS setup with custom color tokens
  - Framer Motion, Zustand, OpenAI SDK installed
  - Inter font bundled locally
  - Directory structure created per architecture.md
  - Base layout with header and footer (including honesty disclaimer)
  - globals.css with custom properties
- **Key Files Created**: layout.tsx, globals.css, package.json, tsconfig.json, tailwind.config.ts
