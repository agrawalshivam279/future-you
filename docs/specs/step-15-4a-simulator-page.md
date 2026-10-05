# Technical Specification: Step 15.4a — Dedicated `/simulator` Page Route (`page.tsx`)

## 1. Overview
Step 15.4a delivers the full user-facing **Decision Simulator** page at route `/simulator`. It integrates the decision form, impact matrix, persona verdicts, and trade-offs cards into an cohesive, responsive experience. Users can simulate new life forks, switch between previously evaluated scenarios, and inspect multi-horizon projections.

---

## 2. File Layout & LOC Budget
- **Page Component**: `src/app/simulator/page.tsx` ($\le 300$ LOC)
- **Unit & Integration Tests**: `src/app/simulator/__tests__/page.test.tsx` ($\le 250$ LOC)

---

## 3. Component Specification & State Flow

### State Dependencies:
- `useLifeModelStore`: Checks if the user has an active simulation (`model`). Redirects/guards if empty.
- `useDecisionStore`: Manages `scenarios`, `evaluations`, `activeScenarioId`, `isLoading`, and `error`.
- `simulateDecisionScenario`: AI invocation orchestrator with timeout and error handling.

### Visual Sub-sections:
1. **Header & Navigation**:
   - Back to dashboard button (`ArrowLeft` icon, navigates to `/dashboard`).
   - Title: "Decision Simulator" with "What If? Fork Engine" subtitle.
   - Honesty disclaimer pill: "Reflection Tool • Not Prediction".
2. **Scenario History Bar**:
   - Horizontal scrollable chips of past evaluated scenarios.
   - "+ New Scenario" CTA button to start a fresh fork.
   - Delete scenario button with confirmation / trash icon.
3. **Primary Content View**:
   - **Mode A (Authoring/New)**: Renders `<DecisionForm>` with preset selector.
   - **Mode B (Loading)**: Renders loading card with spinner and status text.
   - **Mode C (Error)**: Renders error banner with retry CTA.
   - **Mode D (Results View)**:
     - Scenario banner showing title, domain tag, horizon tag, and motivation.
     - `<ImpactMatrix projections={...} domainDeltas={...} />`
     - `<PersonaVerdicts reactions={...} />`
     - `<TradeOffsCard tradeOffs={...} unforeseenRisks={...} />`
     - Reset / Simulate Another action button.

---

## 4. Accessibility & Styling Invariants
1. **Empty Guard**: Clear CTA to `/onboarding` if no future models exist.
2. **Responsive Stacking**: Seamless layout across mobile ($<768$px) and desktop.
3. **WCAG AA Compliance**: High-contrast text, clear focus rings, semantic landmark tags (`<main>`, `<header>`, `<section>`).
4. **Code Quality**: `function` declaration syntax, typed props, strictly $\le 300$ LOC.

---

## 5. Testing Strategy
- Guards when no LifeModel exists, showing empty state and link to onboarding.
- Renders the `DecisionForm` when no active scenario or when "+ New" is clicked.
- Submits scenario, triggers `simulateDecisionScenario`, and displays the complete evaluation matrix.
- Displays scenario switcher tabs when multiple scenarios are saved in store.
- Allows deleting active scenario.
