# Technical Specification: Step 17.1c — Privacy Toggles & Customization Controls

## 1. Overview
Step 17.1c implements `PrivacyToggles` in `src/components/share/privacy-toggles.tsx`.
This component provides accessible controls for toggling privacy redaction (masking financial amounts, masking private anxieties), selecting content inclusions (future self quote, alignment score, habit levers), and picking presentation themes (`midnight`, `emerald`, `amber`, `monochrome`), aspect ratios (`square`, `portrait`, `landscape`), and persona views (`split`, `improved`, `current`).

---

## 2. File Layout & LOC Budget
- **Component**: `src/components/share/privacy-toggles.tsx` ($\le 260$ LOC)
- **Barrel Export**: `src/components/share/index.ts`
- **Unit Tests**: `src/components/share/__tests__/privacy-toggles.test.tsx` ($\le 180$ LOC)

---

## 3. Component Specification & Props Interface

```typescript
export interface PrivacyTogglesProps {
  /** Active share card configuration */
  config: ShareCardConfig;
  /** Callback fired whenever any privacy or appearance setting changes */
  onChange: (updatedConfig: ShareCardConfig) => void;
  /** Optional container style override */
  className?: string;
}
```

---

## 4. Control Groups
1. **Privacy Redaction Group**:
   - `maskFinances`: Mask exact salary and financial figures (`••••••`)
   - `maskAnxieties`: Redact fears and private anxiety reflections
2. **Content Inclusions Group**:
   - `includeLetterQuote`: Include 5-year Future Self quote excerpt
   - `includeAlignmentScore`: Include composite alignment score badge
   - `includeHabits`: Include habit lever breakdown
3. **Appearance Group**:
   - Theme Selector: Buttons/Pills for `midnight`, `emerald`, `amber`, `monochrome`
   - Aspect Ratio Selector: Buttons/Pills for `square` (1:1), `portrait` (4:5), `landscape` (16:9)
   - Persona Mode Selector: Buttons/Pills for `split`, `improved`, `current`

---

## 5. Architectural & Privacy Invariants
- **Named Function Declaration**: `export function PrivacyToggles(...)`.
- **Zero Cloud Storage**: All adjustments update client-side state without external transmission.
- **Accessibility**:
  - Semantic inputs with `<input type="checkbox">` or accessible toggle switches.
  - Descriptive labels, `id`, and `aria-describedby` helper texts.
  - Radio/Button groups with `aria-pressed` or `role="radiogroup"`.
  - Contrast ratio $\ge 4.5:1$ in dark mode.
- **LOC Limit**: Maximum 300 LOC per file.
