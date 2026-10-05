# Technical Specification: Step 17.2c — Share Modal & Dashboard Integration

## 1. Overview
Step 17.2c implements `ShareModal` in `src/components/share/share-modal.tsx` and integrates it into the primary dashboard (`src/app/dashboard/page.tsx`).
The modal unites the visual preview (`ShareableCard`), the interactive privacy controls (`PrivacyToggles`), and the export action bar (`ShareActions`) into a responsive dialog, allowing users to export PNGs, SVGs, or copy images directly from their simulation dashboard.

---

## 2. File Layout & LOC Budget
- **Modal Component**: `src/components/share/share-modal.tsx` ($\le 240$ LOC)
- **Modal Barrel Export**: `src/components/share/index.ts`
- **Dashboard Modal Refactor**: `src/components/dashboard/regenerate-modal.tsx` ($\le 60$ LOC)
- **Dashboard Barrel Export**: `src/components/dashboard/index.ts`
- **Dashboard Integration**: `src/app/dashboard/page.tsx` ($\le 280$ LOC)
- **Unit Tests**: `src/components/share/__tests__/share-modal.test.tsx` ($\le 180$ LOC)

---

## 3. Component Specification & Props Interface

```typescript
export interface ShareModalProps {
  /** Modal open visibility state */
  isOpen: boolean;
  /** Callback to close modal */
  onClose: () => void;
}
```

---

## 4. Architectural & Privacy Invariants
- **Named Function Declaration**: Export `function ShareModal(...)`.
- **Zero Cloud Storage**: Reads directly from client-side Zustand stores (`useLifeModelStore`, `useOnboardingStore`, `useCheckInStore`).
- **LOC Limit**: Maximum 300 LOC per file (`src/app/dashboard/page.tsx` kept under 285 LOC by extracting `RegenerateModal`).
- **Accessible Dialog**: Full keyboard navigation, backdrop dismiss, and ARIA labels.
- **Mandatory Reflection Disclaimer**: Included on the card preview and modal footer.
