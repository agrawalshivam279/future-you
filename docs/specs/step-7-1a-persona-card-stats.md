# 📄 Technical Specification: Step 7.1a — Persona Card & Comparison Stat Components

> **Step ID**: `7.1a`  
> **Target Module**: `src/components/dashboard/`  
> **Git Feature Branch**: `feat/step-7-1a-persona-card-stats`  
> **Status**: 📋 Ready for Implementation  
> **Created**: 2026-10-04  

---

## 1. Executive Summary

This specification initiates **Phase 7 (Dashboard & Split View)** of Future You by delivering the foundational presentation components for the split-view dashboard: the **`PersonaCard`** and **`ComparisonStatRow`** (along with **`ComparisonStatsGrid`**). 

The `PersonaCard` renders an executive summary of a simulated 5-year future self (`current` or `improved`), highlighting psychological mood, core domain metrics (career, sleep, finances), key achievements/struggles, and primary navigation action triggers (Talk to Persona, Read Letter, Review Regrets & Gratitude). The `ComparisonStatRow` and `ComparisonStatsGrid` deliver high-contrast, side-by-side trajectory comparisons across career satisfaction, sleep hours, savings rates, and mastered proficiencies, providing instant clarity on the divergence between the baseline trajectory and intentional habit transformation.

---

## 2. Dependencies & Prerequisites

- **Depends on**: 
  - `src/types/persona.types.ts` (`Persona`, `PersonaId`, `PersonaCareer`, `PersonaHealth`, `PersonaFinances`)
  - `src/components/ui/card.tsx` (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`)
  - `src/components/ui/badge.tsx` (`Badge`)
  - `src/components/ui/button.tsx` (`Button`)
  - `lucide-react` icons (`MessageSquare`, `Mail`, `BookOpen`, `TrendingUp`, `Sparkles`, `Clock`, `Briefcase`, `Heart`, `DollarSign`)
- **Blocked by**: None.
- **New Packages / Libraries**: None (Tech stack is strictly locked).

---

## 3. 🔒 Privacy, Storage & Accessibility Impact

- [x] **Zero Cloud Storage**: All persona data is sourced from client-side Zustand store / memory without server requests.
- [x] **Honesty Disclaimer Alignment**: Maintains non-deterministic, reflective framing (*"Simulated 5-Year Trajectory"*).
- [x] **WCAG AA Accessibility**:
  - All interactive action buttons include descriptive `aria-label` attributes (e.g. `aria-label="Chat with You in 2031 (Current Path)"`).
  - Text contrast ratios exceed 4.5:1 on dark backgrounds (`#0A0A0B` / `#141416`).
  - Screen-reader friendly semantic headings (`h3`, `h4`) and list semantics.
- [x] **Code & Architecture Constraints**:
  - `function` component declarations exclusively (no arrow functions).
  - Explicit TypeScript `interface` typing for all props.
  - Maximum $\le 300$ LOC per file.
  - Dark-mode first styling with Tailwind CSS and Framer Motion transitions ($\le 300$ms).

---

## 4. 🧠 Sequential Thinking MCP Evaluation

- **Heuristic Evaluation**:
  - Persona Prompt Consistency: Evaluated and stabilized in Phase 5 prompt templates.
  - Habit Levers Delta Math: Covered in Phase 5.2f (`regenerateFutures`) and Phase 10.
  - Pure React UI Rendering: Pure presentation components receiving typed props.
- **Verdict**: Sequential Thinking MCP is **Skipped** for Step 7.1a as this step consists of deterministic React/Tailwind visual presentation without non-trivial algorithmic branching or LLM prompt generation.

---

## 5. Component Contracts & Interfaces

### 5.1 PersonaCard (`src/components/dashboard/persona-card.tsx`)

```typescript
import { Persona } from '@/types/persona.types';

export interface PersonaCardProps {
  /** Persona entity model containing 5-year trajectory data */
  persona: Persona;
  /** Callback invoked when clicking the 'Talk to Persona' button */
  onChatClick?: () => void;
  /** Callback invoked when clicking the 'Read Letter' button */
  onLetterClick?: () => void;
  /** Callback invoked when clicking the 'Regrets & Gratitude' button */
  onReflectionsClick?: () => void;
  /** Optional custom CSS classes */
  className?: string;
}
```

### 5.2 ComparisonStatRow (`src/components/dashboard/comparison-stat-row.tsx`)

```typescript
export interface ComparisonStatRowProps {
  /** Metric label (e.g. 'Career Satisfaction', 'Sleep Duration') */
  label: string;
  /** Value on Current Path */
  currentValue: string | number;
  /** Value on Improved Path */
  improvedValue: string | number;
  /** Unit of measurement (e.g. '/10', 'hrs', '%') */
  unit?: string;
  /** Contextual category or subtext */
  category?: string;
  /** Icon representation */
  icon?: React.ReactNode;
  /** Optional CSS class */
  className?: string;
}

export interface ComparisonStatsGridProps {
  /** Current Path persona */
  currentPersona: Persona;
  /** Improved Path persona */
  improvedPersona: Persona;
  /** Optional CSS class */
  className?: string;
}
```

---

## 6. Visual & Styling Specifications

| Component / Section | Current Path Variant | Improved Path Variant |
| :--- | :--- | :--- |
| **Persona Header Badge** | Amber tint (`variant="current"`) | Emerald tint (`variant="improved"`) |
| **Card Left Border** | 4px Amber accent border | 4px Emerald accent border |
| **Card Background** | `bg-current-bg/20 border-current-border` | `bg-improved-bg/20 border-improved-border` |
| **Action Buttons** | `Button variant="current"` | `Button variant="improved"` |
| **Stat Accents** | Text `text-accent-current` | Text `text-accent-improved` |

---

## 7. Step-by-Step Implementation Sequence

1. **Phase A: Directory Setup & Barrel Export**
   - Create `src/components/dashboard/` directory.
   - Author `src/components/dashboard/index.ts`.

2. **Phase B: PersonaCard Component (`src/components/dashboard/persona-card.tsx`)**
   - Import `Card`, `Badge`, `Button` and `lucide-react` icons.
   - Render header: persona badge (`Current Path` vs `Improved Path`), name, age, and mood badge.
   - Render narrative summary quote block with subtle italic styling.
   - Render key domain stats grid (Career title & rating, sleep average & energy, savings rate & freedom).
   - Render key highlight / challenge badge pills.
   - Render action button footer: Chat, Letter, Reflections with callbacks and fallback links.
   - Ensure strict compliance with $\le 300$ LOC limit and WCAG AA accessibility.

3. **Phase C: ComparisonStatRow & ComparisonStatsGrid (`src/components/dashboard/comparison-stat-row.tsx`)**
   - Build `ComparisonStatRow` rendering metric label, category, current vs improved values, and computed delta pill.
   - Build `ComparisonStatsGrid` aggregating standard comparison rows:
     - Career Satisfaction (`career.satisfaction`, `/10`)
     - Sleep Average (`health.sleepAverageHours`, `hrs/night`)
     - Monthly Savings Rate (`finances.savingsRate`, `%`)
     - Skills Mastered (`skills.length`, `skills`)
     - Relational Satisfaction (`relationships.satisfaction`, `/10`)
   - Ensure responsive layout (grid adapting from 1 column on mobile to 2 columns on desktop).

4. **Phase D: Spec-Driven Unit & Integration Tests**
   - Create `src/components/dashboard/__tests__/persona-card.test.tsx` verifying all variants, stat values, and click callbacks.
   - Create `src/components/dashboard/__tests__/comparison-stat-row.test.tsx` verifying delta calculations, numeric formatting, and grid rendering.

---

## 8. Verification & Acceptance Criteria

### Automated Tests
```bash
npm test -- src/components/dashboard
npx tsc --noEmit
npm run lint
```

### Acceptance Checklist
- [x] All components declared using `function` syntax with typed props and JSDoc documentation.
- [x] Files strictly $\le 300$ LOC.
- [x] Current and Improved styling strictly mapped to design tokens (`#F59E0B` amber / `#10B981` emerald).
- [x] Keyboard navigable with explicit `aria-label` tags on all action buttons.
- [x] 100% test pass rate with zero TypeScript compiler or ESLint warnings.
