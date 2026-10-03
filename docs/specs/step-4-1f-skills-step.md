# Technical Specification: Step 4.1f — Step 5: Skills & Capabilities Form (`SkillsStep`)

## 1. Context & Objectives
- **Module**: `src/components/onboarding/steps/skills-step.tsx`
- **Parent**: `src/components/onboarding/onboarding-wizard.tsx` (Step 5 of 6)
- **Store**: `useOnboardingStore` (`skills` state, `updateSkills` action)
- **Type**: `SkillsData` from `src/types/onboarding.types.ts`
- **Objective**: Capture user capabilities, growth objectives, professional domain, career satisfaction, and growth mindset self-rating to feed the 5-year simulation models.

## 2. Requirements & UX Architecture
1. **Current Strengths & Skills (`currentSkills: string[]`)**:
   - Built using reusable `GoalListBuilder`.
   - Suggestions: *Software Architecture*, *Data Analysis*, *Product Design*, *Public Speaking*, *Team Leadership*, *Writing & Storytelling*, *Financial Modeling*, *Critical Thinking*.
   - Badges rendered with remove buttons.
2. **Target Learning Goals (`learningGoals: string[]`)**:
   - Built using reusable `GoalListBuilder`.
   - Suggestions: *Machine Learning / AI*, *System Architecture*, *Executive Presence*, *Venture Building*, *Public Communication*, *Spanish / Foreign Language*, *Deep Focus Discipline*.
   - Badges rendered with remove buttons.
3. **Primary Career Field / Discipline (`careerField: string`)**:
   - `Input` field with accessible label.
   - Quick selectable industry suggestions: *Software & Engineering*, *Design & Creative*, *Business & Finance*, *Healthcare & Sciences*, *Education & Research*, *Entrepreneurship*.
4. **Career Satisfaction Slider (`careerSatisfaction: number`)**:
   - Range: 1 to 10 (default 5).
   - Step: 1.
   - Descriptive feedback notes:
     - 1-3: *Significant burnout / feeling misaligned or drained*
     - 4-6: *Moderate stability, seeking greater meaning or autonomy*
     - 7-8: *High fulfillment and positive momentum*
     - 9-10: *Peak flow, mastery, and purpose-driven engagement*
5. **Growth Mindset Slider (`growthMindset: number`)**:
   - Range: 1 to 10 (default 7).
   - Step: 1.
   - Descriptive feedback notes:
     - 1-3: *Tendency toward fixed ability beliefs / risk aversion*
     - 4-6: *Cautiously open to challenge, gradual adaptability*
     - 7-8: *Strong belief in neuroplasticity, rapid failure learning*
     - 9-10: *Relentless experimental resilience and mastery orientation*
6. **Invariants Enforced**:
   - Under 300 LOC limit.
   - Component exported using `function SkillsStep`.
   - Props typed with `interface SkillsStepProps`.
   - Strictly client-side state synchronized to `useOnboardingStore.updateSkills`.
   - WCAG AA contrast and full ARIA accessibility.

## 3. Testing Plan
- Test rendering of all 5 form sections.
- Test adding and removing current skills.
- Test adding and removing learning goals.
- Test typing career field and clicking industry suggestion pills.
- Test career satisfaction slider updates and dynamic notes.
- Test growth mindset slider updates and dynamic notes.
- Test integration into `OnboardingWizard` when on step 5.
