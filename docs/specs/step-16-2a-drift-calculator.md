# Technical Specification: Step 16.2a — Pure Client-Side Drift Calculator (`drift-calculator.ts`)

## 1. Overview
Step 16.2a implements the deterministic, client-side trajectory drift scoring engine for Check-in Mode. It compares recorded habit logs against the user's onboarding baseline and target compounding values, producing individual `HabitDriftVector`s and a composite 0-100% alignment score without requiring network requests or LLM tokens.

---

## 2. File Layout & LOC Budget
- **Scoring Engine**: `src/lib/scoring/drift-calculator.ts` ($\le 180$ LOC)
- **Unit Tests**: `src/lib/scoring/__tests__/drift-calculator.test.ts` ($\le 160$ LOC)

---

## 3. Mathematical Formula & Invariants

### 1. Exercise Frequency Mapping:
- `'never'` $\to 0$ days/week
- `'rarely'` $\to 1$ day/week
- `'weekly'` $\to 3$ days/week
- `'daily'` $\to 6$ days/week

### 2. Tracked Habit Dimensions:
1. **Sleep**: Unit `hrs`, higher is better ($T > B$).
2. **Exercise**: Unit `days/wk`, higher is better ($T > B$).
3. **Screen Time**: Unit `hrs/day`, lower is better ($T < B$).
4. **Deep Work**: Unit `hrs/wk`, higher is better ($T > B$).
5. **Savings Rate**: Unit `%`, higher is better ($T > B$).

### 3. Directional Progress & Drift Formula:
- If $T > B$: $\text{progress} = \frac{\text{actual} - B}{T - B}$
- If $T < B$: $\text{progress} = \frac{B - \text{actual}}{B - T}$
- If $T = B$: $\text{progress} = (\text{actual} \ge T) ? 1.0 : 0.0$
- $\text{driftPercentage} = \text{progress} \times 100$

### 4. Status Thresholds:
- $\text{driftPercentage} > 110\% \to \text{'surpassing'}$
- $75\% \le \text{driftPercentage} \le 110\% \to \text{'aligned'}$
- $\text{driftPercentage} < 75\% \to \text{'drifting\_current'}$

### 5. Composite Overall Alignment Score:
- Clamped score per habit: $\text{clamped} = \max(0, \min(100, \text{driftPercentage}))$
- $\text{overallAlignmentScore} = \text{round}\left(\frac{\sum \text{clamped}}{N}\right) \in [0, 100]$

---

## 4. Edge Cases & Resilience
1. **Zero / Identical Baseline & Target**: Guard against division by zero ($T = B$).
2. **Missing Levers / Onboarding**: Sensible fallback baselines (7h sleep, 3h screen, 20% savings).
3. **Over-performance / Extreme Outliers**: Clamped safely for composite score calculations while preserving raw percentage in drift vectors for accurate UI rendering.

---

## 5. Testing Strategy
- Tests normal progression (at target, midway, at baseline).
- Tests surpassing target ($> 110\%$).
- Tests drifting towards current path ($< 75\%$).
- Tests inverted directionality for screen time (fewer hours = higher alignment).
- Tests edge cases (zero baseline, identical target and baseline, missing data).
