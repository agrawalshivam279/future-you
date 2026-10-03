# 🛡️ FUTURE YOU — AI Agent Workflow & Lifecycle Invariants

> **Scope**: Project-wide (`Future You`)  
> **Precedence**: MANDATORY & UNCONDITIONAL across all agent turns, subagents, and tools.

---

## 1. 🔒 Absolute Phase Separation Rule (Anti-Auto-Advance Invariant)

**NEVER chain or auto-advance through multiple lifecycle stages in a single turn unless the user EXPLICITLY triggered `/auto_cycle`.**

| Command / Phase | Permitted Actions | STRICT HARD STOP (DO NOT CROSS) |
| :--- | :--- | :--- |
| **`/plan_step`** | Inspects roadmap (`implementation_plan.md`), checks clean git tree (`git status -s`), creates feature branch (`feat/<slug>`), writes technical spec in `docs/specs/`. | **HALT IMMEDIATELY**. Output summary & wait for user approval to code. Never start implementation in the same turn. |
| **Code Implementation** *(After user approves plan)* | Writes Next.js components, hooks, Zustand stores, AI prompts, types, and spec-defined tests ($\le 300$ LOC/file). | **HALT IMMEDIATELY**. Output implementation summary. **DO NOT run `/verify_step`, DO NOT commit, DO NOT push, DO NOT open PR, DO NOT run `/ship_step`**. |
| **`/verify_step`** | Runs compiler & lint (`tsc --noEmit`, `npm run lint`), contract validation (Stage 0.5), `test_writer` (Stage 1A), `test_runner` (Stage 1B), and `code_reviewer` (Stage 2). | **HALT IMMEDIATELY**. Output Quality Gate Report & Verdict. **DO NOT commit, DO NOT push, DO NOT merge, DO NOT call `/ship_step`**. |
| **`/ship_step`** | Updates `.agents/memory/flashback.md` & `implementation_plan.md`, commits (`<100` chars), pushes to GitHub, opens PR, checks CI, squash-merges to `main`, and deletes local branch. | **HALT IMMEDIATELY**. Output shipping summary and preview the next task in queue. Wait for user instruction. |
| **`/auto_cycle`** *(Exclusive)* | The **ONLY** command permitted to autonomously chain Plan ➔ Code ➔ Verify ➔ Ship in a continuous loop. | Pauses only if token budget hits limit ($\sim 75\text{k}$ tokens), tests fail, or git tree is dirty. |

---

## 2. 🚦 Explicit User Transition Gates

1. **Plan ➔ Implementation Gate**:
   - After `/plan_step`, the agent must ask: *"Would you like me to begin implementing this feature now?"*
   - Wait for user response.

2. **Implementation ➔ Verification Gate**:
   - After implementing files and tests, the agent must output what was created and ask: *"Implementation complete. Would you like to run `/verify_step` now?"*
   - **DO NOT** execute `/verify_step` or commit changes until the user approves.

3. **Verification ➔ Shipping Gate**:
   - After `/verify_step` outputs its quality gate report, the agent must ask: *"Quality gate passed. Ready to run `/ship_step` to merge this feature to main?"*
   - **DO NOT** push, create a PR, or merge to `main` until the user approves or triggers `/ship_step`.

---

## 3. 🌿 Git & Repository Safety Invariants

- **Conventional Commit Length**: Commit messages MUST be strictly under 100 characters (`type(scope): description`).
- **Branch Naming**: Feature branches follow `feat/<feature-slug>` or `feat/step-<step-id>-<slug>`.
- **Merge Strategy**: Always **Squash & Merge** into `main`.
- **Branch Retention**: Local branch is deleted after merge (`git branch -D ...`), but remote branch on GitHub (`origin/feat/...`) is **always preserved**.
- **No Uncommitted Work on Main**: `main` must always be clean, buildable, and passing 100% of test suites.

---

## 4. 🧠 Sequential Thinking MCP Protocol

When a task involves:
- **Persona Prompt Grounding & System Prompt Consistency** (Years 1, 3, 5 projections without character drift),
- **Life Model & Habit Levers Delta Math** (recalculating outcomes from slider movements),
- **Streaming Token Pipeline & IndexedDB Cache Sync**, or
- **Complex Multi-Step Onboarding State Transitions**,

the agent must evaluate hypotheses, edge cases, and invariants using Sequential Thinking MCP (`sequential-thinking` server) before writing code.

---

## 5. 🔒 Future You Core Architectural & Privacy Invariants

- **Zero Cloud Storage**: All user data resides locally in `localStorage` + `IndexedDB`. No remote database, no server persistence.
- **Prefix Requirement**: All `localStorage` keys MUST use the prefix `future-you:`.
- **Honesty Disclaimer**: Every AI system prompt and page footer MUST include the honesty disclaimer: *"You are a reflection tool, not a prediction engine"*.
- **Next.js 14 App Router**: Use App Router exclusively. Use `function` declarations for components (never arrow functions).
- **File Length Limit**: Max **300 lines** per file. Split if longer.
- **Accessibility**: All interactive elements must have `aria-label` and meet WCAG AA contrast ($\ge 4.5:1$).
- **API Keys**: Never hardcoded. Read dynamically from the client-side Zustand settings store.
