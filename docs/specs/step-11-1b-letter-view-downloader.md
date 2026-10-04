# 📄 Technical Specification: Letter View Component & Text Downloader

> **Step ID**: `Step 11.1b`  
> **Target Module**: `src/lib/export-letter.ts`, `src/components/letter/letter-view.tsx`, `src/components/letter/index.ts`  
> **Git Feature Branch**: `feat/step-11-1b-letter-view-downloader`  
> **Status**: 📋 Ready for Implementation  
> **Created**: 2026-10-04  

---

## 1. Executive Summary

Step 11.1b implements the personal, evocative `LetterView` component and text export utility for Future You. Styled as personal stationery from the user's 5-year future self, the component renders the generated letter with a 5-year postdate header, authentic salutation, and real-time sentence highlighting synchronized with audio playback from the TTS engine. It also provides a client-side text download action enabling users to save their future-self letter as a `.txt` file, completely hermetic and local without external storage.

---

## 2. Dependencies & Prerequisites

- **Depends on**:
  - `src/lib/tts.ts` (sentence segmentation utility)
  - `src/components/letter/tts-player.tsx` (audio narration component)
  - `src/components/ui/button.tsx` (primitive Button)
  - `src/components/ui/card.tsx` (primitive Card)
  - `src/types/persona.types.ts` (`Persona`, `PersonaId`)
- **Blocked by**: None (Step 11.1a shipped)
- **New Packages / Libraries**: None

---

## 3. 🔒 Privacy, Storage & Disclaimer Impact

- [x] **Zero Cloud Storage**: The `.txt` letter export is generated purely in-memory via `Blob` and `URL.createObjectURL`. No network transmission.
- [x] **Honesty Disclaimer**: Every exported text file and the `LetterView` container footer embed the mandatory reflection disclaimer: *"You are a reflection tool, not a prediction engine."*
- [x] **Accessibility**: Meets WCAG AA contrast ($\ge 4.5:1$). Interactive controls have explicit `aria-label` attributes. Highlighted sentences maintain accessible contrast ratios.

---

## 4. Component / Utility Contracts

### 4.1 Export Utility (`src/lib/export-letter.ts`)

```typescript
export interface ExportLetterOptions {
  personaName: string;
  personaId: 'current' | 'improved';
  targetAge?: number;
  currentAge?: number;
  userName?: string;
}

export function formatLetterText(letter: string, options: ExportLetterOptions): string;
export function downloadLetterAsText(letter: string, options: ExportLetterOptions): void;
```

### 4.2 Component Props (`src/components/letter/letter-view.tsx`)

```typescript
export interface LetterViewProps {
  /** Raw letter content string */
  letter: string;
  /** Active persona trajectory identifier */
  personaId: 'current' | 'improved';
  /** Persona display name */
  personaName: string;
  /** User name / callsign */
  userName?: string;
  /** User target age 5 years from now */
  targetAge?: number;
  /** Optional custom styling classes */
  className?: string;
  /** Optional initial active sentence index for narration highlight */
  initialSentenceIndex?: number;
}
```

---

## 5. Step-by-Step Implementation Sequence

1. **Phase A: Letter Export Utility (`src/lib/export-letter.ts`)**
   - Implement `formatLetterText` appending date, salutation, persona context, honesty disclaimer, and signature.
   - Implement `downloadLetterAsText` triggering a `.txt` browser download.
2. **Phase B: Letter View Component (`src/components/letter/letter-view.tsx`)**
   - Implement `LetterView` using `function` declaration ($\le 300$ LOC).
   - Integrate `TTSPlayer` with active sentence synchronization (`activeSentenceIndex`).
   - Render sentences with highlight styling (`bg-accent-improved/15 text-text-primary` or `bg-accent-current/15`).
   - Add "Download Letter (.txt)" button with Download icon.
   - Update `src/components/letter/index.ts` barrel export.
3. **Phase C: Tests & Verification**
   - Write tests for export utility in `src/lib/__tests__/export-letter.test.ts`.
   - Write component tests for `LetterView` in `src/components/letter/__tests__/letter-view.test.tsx`.

---

## 6. Verification & Acceptance Criteria

### Automated Tests
```bash
npm test -- src/lib/__tests__/export-letter.test.ts src/components/letter/__tests__/letter-view.test.tsx
```

### Acceptance Checklist
- [ ] Letter renders with personal stationery layout, salutation, and 5-year date stamp.
- [ ] Synchronized audio narration highlights the active sentence cleanly.
- [ ] Clicking Download triggers client-side file save with disclaimer included.
- [ ] All interactive elements accessible via Tab with `aria-label`.
- [ ] Max file length $\le 300$ lines.
