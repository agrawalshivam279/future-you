# Technical Specification: Step 3.1b — Settings Data Management (Delete All Data & Export JSON)

## 1. Overview
Step 3.1b completes the Settings & Configuration phase (Phase 3) by delivering client-side data management capabilities. This empowers users to export all their local reflection data as a timestamped JSON backup, or permanently erase all stored keys (`future-you:*`), chat history in IndexedDB, and reset all Zustand stores with a protective confirmation modal.

## 2. Invariants & Rules Compliance
- **Zero Cloud Storage**: All operations operate strictly on client-side `localStorage` and `IndexedDB`.
- **Key Prefixing**: Targets and purges all `future-you:*` keys in `localStorage` without altering non-project keys.
- **Component Style**: React components use `function` declarations, destructured props typed with `interface`, and mandatory JSDoc.
- **File Length Limit**: Max 300 LOC per file.
- **Accessibility**: Full keyboard accessibility, modal focus trapping, ARIA dialog roles, and aria-labels on action buttons.
- **Testing**: Hermetic unit and integration tests using mocked `localStorage`, `URL.createObjectURL`, `document.createElement`, and `fake-indexeddb`.

## 3. Architecture & File Structure
```
src/
├── lib/
│   └── storage/
│       ├── data-manager.ts             # Export and Wipe utilities
│       ├── indexed-db.ts               # Extended with clearIndexedDB helper
│       └── __tests__/
│           └── data-manager.test.ts    # Comprehensive export & purge tests
├── components/
│   └── settings/
│       ├── data-management-card.tsx    # Card with Export and Delete buttons + Modal
│       └── __tests__/
│           └── data-management-card.test.tsx
└── app/
    └── settings/
        └── page.tsx                    # Updated to include DataManagementCard
```

## 4. Detailed Component & Module Specifications

### 4.1 `src/lib/storage/data-manager.ts`
- `exportLocalData(): BackupData`: Gathers all `future-you:*` keys from `localStorage` plus `useChatStore` state.
- `downloadDataAsJSON(backupData: BackupData): void`: Serializes data to formatted JSON and triggers a client-side download via anchor blob.
- `deleteAllLocalData(): Promise<void>`:
  - Iterates and removes all `future-you:*` keys from `localStorage`.
  - Clears IndexedDB `future-you-db`.
  - Resets all Zustand stores: `useSettingsStore`, `useUIStore`, `useOnboardingStore`, `useLifeModelStore`, `useChatStore`.

### 4.2 `src/components/settings/data-management-card.tsx`
- Renders inside a `Card` component.
- Contains "Export Data" button (secondary variant) with icon/label.
- Contains "Delete All Data" button (danger variant).
- Manages `isConfirmModalOpen` state.
- Renders `Modal` with clear warning of permanent data loss.
- Integrates with `useToast` to provide instant user feedback.

### 4.3 Integration in `src/app/settings/page.tsx`
- Stacked below `APIConfigForm` in a responsive 2-column or stacked vertical layout with appropriate spacing.

## 5. Verification Plan
- `npx tsc --noEmit` & `npm run lint`: 0 errors.
- Unit tests for `data-manager.ts` (export JSON structure, delete all keys, reset stores).
- Integration tests for `data-management-card.tsx` (button clicks, modal open/close, delete confirmation, toast dispatch).
- Full regression test run (`npm test`).
