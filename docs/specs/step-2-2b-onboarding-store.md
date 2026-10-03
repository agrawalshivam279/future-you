# Step 2.2b Technical Specification: Onboarding Zustand Store

## 1. Overview
Step 2.2b implements `src/stores/onboarding-store.ts`, managing the multi-step onboarding wizard state, user self-reported input data, draft persistence to `localStorage` under `future-you:onboarding`, and progression logic across all 6 onboarding sections.

---

## 2. Invariants & Rules Checklist
- [x] Zero cloud storage: Persists exclusively to client `localStorage` with prefix `future-you:`.
- [x] State management stack: Zustand with `persist` middleware.
- [x] Strict TypeScript: Typed using the `OnboardingData`, `GoalsData`, `HabitsData`, etc. defined in `@/types`.
- [x] Max 300 LOC per file: Modular and lean.
- [x] JSDoc on store hook and actions.

---

## 3. Store Architecture & Interfaces

### 3.1 State Shape
```typescript
export interface OnboardingState {
  // Wizard navigation
  currentStep: number; // 1 to 6
  isCompleted: boolean;

  // Domain data
  name: string;
  age: number;
  goals: GoalsData;
  habits: HabitsData;
  time: TimeData;
  money: MoneyData;
  skills: SkillsData;
  fearsAndValues: FearsAndValuesData;

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateBasics: (name: string, age: number) => void;
  updateGoals: (goals: Partial<GoalsData>) => void;
  updateHabits: (habits: Partial<HabitsData>) => void;
  updateTime: (time: Partial<TimeData>) => void;
  updateMoney: (money: Partial<MoneyData>) => void;
  updateSkills: (skills: Partial<SkillsData>) => void;
  updateFearsAndValues: (data: Partial<FearsAndValuesData>) => void;
  setCompleted: (completed: boolean) => void;
  resetOnboarding: () => void;
  getOnboardingData: () => OnboardingData;
}
```

### 3.2 Storage Contract
- **Key**: `future-you:onboarding`
- **Default State**:
  - `currentStep`: 1
  - `isCompleted`: false
  - Sensible neutral defaults for habits (e.g. 7h sleep, weekly exercise) to streamline onboarding interaction.

---

## 4. Verification Plan
- **TypeScript & Lint**: `npx tsc --noEmit && npm run lint`
- **Unit Tests**: `src/stores/__tests__/onboarding-store.test.ts`
  - Step increment / decrement bounding (1 to 6)
  - Section partial update immutability
  - `getOnboardingData` integrity
  - Full reset functionality
  - LocalStorage persistence under `future-you:onboarding`
