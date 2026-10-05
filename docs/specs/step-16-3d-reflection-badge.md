# Technical Specification: Step 16.3d — Future Self Reflection Badge & TTS Component

> **Feature**: Version 3 — Check-in Mode (`ReflectionBadge` Component)  
> **Target Branch**: `feat/step-16-3d-reflection-badge`  
> **Status**: In Progress  

---

## 1. Context & Objective

In Check-in Mode, after habit drift vectors and composite scores are calculated, the AI generates a personalized, grounded reflection note from the Improved Path Future Self (5 years out).

Step 16.3d delivers `ReflectionBadge` (`src/components/check-in/reflection-badge.tsx`), an accessible card displaying the Future Self's feedback note:
1. **Header & Persona Voice**: Indicates 5-Year Future Self reflection (Improved Path).
2. **Text Body**: Renders the reflection note, micro-adjustment advice, and grounding words.
3. **Audio Playback (Web Speech API)**: Play/Pause/Stop speech synthesis controls with state management via `createTTSController`.
4. **Copy Action**: One-click copy reflection to clipboard with toast notification.
5. **Ethical Honesty Disclaimer**: Persistent reminder: *"A reflection tool, not a prediction engine"*.

---

## 2. Invariants & Guardrails

- **Zero External Audio APIs**: Exclusively uses native Web Speech API through `src/lib/tts.ts`.
- **Honesty Disclaimer**: Clearly displayed on card.
- **Accessibility**: ARIA labels on audio buttons, screen-reader status indicators, keyboard navigable.
- **File Length Limit**: Strictly $\le 300$ LOC per file.
- **Component Style**: Named React `function` component, strict TypeScript interfaces.

---

## 3. Component Contract

```tsx
export interface ReflectionBadgeProps {
  reflection: string;
  authorTitle?: string;
  className?: string;
}
```

---

## 4. Verification Plan

1. **Unit & Interaction Tests** (`src/components/check-in/__tests__/reflection-badge.test.tsx`):
   - Renders reflection text content and author header.
   - Verifies honesty disclaimer presence.
   - Toggles audio playback (Play/Pause/Stop) using mocked Web Speech synthesis.
   - Copies reflection text to clipboard.
   - Gracefully disables audio button if speech synthesis is unsupported.
