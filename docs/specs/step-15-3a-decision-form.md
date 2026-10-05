# Technical Specification: Step 15.3a — Decision Form Component (`decision-form.tsx`)

## 1. Overview
Step 15.3a delivers the interactive user input form for the **Decision Simulator ("What If?" Fork Engine)**. The component empowers users to author custom life choices (specifying scenario title, primary domain, time horizon, and contextual description) or select from curated pre-configured presets. It validates inputs client-side, integrates with `useDecisionStore`, and supports seamless triggering of AI simulations.

---

## 2. File Layout & LOC Budget
- **Component**: `src/components/simulator/decision-form.tsx` ($\le 250$ LOC)
- **Barrel Export**: `src/components/simulator/index.ts` ($\le 20$ LOC)
- **Component Tests**: `src/components/simulator/__tests__/decision-form.test.tsx` ($\le 200$ LOC)

---

## 3. Component Specification & Props Interface

```typescript
export interface DecisionFormProps {
  /** Optional callback triggered when a scenario is submitted */
  onSubmit?: (scenario: Omit<DecisionScenario, 'id' | 'createdAt'>) => void;
  /** Transient flag indicating AI simulation is currently running */
  isLoading?: boolean;
  /** Optional custom CSS classes for the container card */
  className?: string;
}
```

### Form Fields:
1. **Scenario Title**: Text input with placeholder (e.g. "Leaving corporate job to build an indie studio"). Min 3 chars.
2. **Primary Domain**: Chip/pill selector supporting `'career' | 'finances' | 'health' | 'relationships' | 'lifestyle'`.
3. **Time Horizon**: Segmented radio/button group supporting `'immediate' | '6months' | '1year'`.
4. **Context & Motivation Description**: Textarea with placeholder guiding the user to explain the friction, risks, and motivation. Min 10 chars.
5. **Quick Preset Templates**: Interactive cards/chips populated from `DECISION_PRESETS` to pre-fill the form with 1 click.
6. **Actions**: Primary CTA "Simulate Decision" (with loading spinner state) and secondary "Clear Form" button.

---

## 4. Accessibility & Styling Invariants
1. **WCAG AA Compliance**: All domain and horizon toggles use proper `aria-pressed`, `aria-label`, and keyboard focus indicators.
2. **Reduced Motion Safe**: Smooth transition states respecting reduced-motion preferences.
3. **Validation Errors**: Clear, accessible validation messages preventing submission of invalid fields.
4. **LOC Limit**: Maximum 300 lines per file.
5. **Component Declaration**: `function` declaration syntax (no arrow component declarations).

---

## 5. Testing Strategy
- Renders all form fields (title, domain buttons, horizon buttons, description).
- Populates form fields upon clicking a preset card.
- Enforces character length validation (disabling submission when invalid).
- Triggers `onSubmit` or store action with well-formed payload.
- Disables buttons and shows spinner when `isLoading` is true.
