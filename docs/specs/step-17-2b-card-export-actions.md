# Technical Specification: Step 17.2b — Card Download & Clipboard Actions

## 1. Overview
Step 17.2b implements client-side download and clipboard actions for the shareable simulation card.
It provides:
- Core export functions in `src/lib/export/card-export-actions.ts` (`downloadCard`, `copyCardToClipboard`).
- An accessible UI action button bar in `src/components/share/share-actions.tsx` triggering PNG download, SVG download, and direct clipboard image copy with loading states and user-friendly toast notifications.

---

## 2. File Layout & LOC Budget
- **Export Actions Module**: `src/lib/export/card-export-actions.ts` ($\le 150$ LOC)
- **UI Actions Component**: `src/components/share/share-actions.tsx` ($\le 180$ LOC)
- **Barrel Exports**: `src/lib/export/index.ts` & `src/components/share/index.ts`
- **Unit Tests**: `src/components/share/__tests__/share-actions.test.tsx` ($\le 180$ LOC)

---

## 3. Component Specification & Props Interface

```typescript
export interface ShareActionsProps {
  /** Simulation snapshot to export */
  data: ShareCardData;
  /** Active card styling and privacy configuration */
  config: ShareCardConfig;
  /** Optional container style override */
  className?: string;
  /** Optional callback fired after successful export */
  onExportSuccess?: (format: 'png' | 'svg' | 'clipboard') => void;
}
```

---

## 4. Privacy & Client-Side Invariants
- **Zero Cloud Storage**: Downloads occur via native client-side `URL.createObjectURL(blob)` and `URL.revokeObjectURL(url)`.
- **Async Clipboard API**: Uses standard `navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])` with graceful fallback notifications if permissions are denied.
- **Accessibility**: Buttons feature loading spinners, disabled states during generation, and ARIA labels.
- **LOC Limit**: Maximum 300 LOC per file.
