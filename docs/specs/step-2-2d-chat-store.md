# Step 2.2d Technical Specification: Chat Zustand Store with IndexedDB Storage

## 1. Overview
Step 2.2d implements `src/stores/chat-store.ts` and `src/lib/storage/indexed-db.ts`:
- **`src/lib/storage/indexed-db.ts`**: Pure client-side IndexedDB storage adapter implementing Zustand's `StateStorage` interface with automatic schema creation, transaction management, and fallback.
- **`src/stores/chat-store.ts`**: Multi-persona chat history manager (Current Path vs. Improved Path) supporting message appending, token-by-token streaming accumulation, and selective persistence (omitting transient streaming flags).

---

## 2. Invariants & Rules Checklist
- [x] Zero cloud storage: Chat transcripts stored exclusively in browser IndexedDB.
- [x] Storage separation: Heavy message logs reside in IndexedDB (`future-you-db`), avoiding localStorage 5MB quota exhaustion.
- [x] Transient flag filtering: `partialize` ensures `isStreaming` is never written to disk, preventing permanent frozen-streaming states upon page refresh.
- [x] Strict TypeScript: Typed using `ChatMessage`, `PersonaId`, and `ChatMessageRole` from `@/types`.
- [x] Max 300 LOC per file: Modular storage adapter and store files.
- [x] JSDoc on all exported functions and types.

---

## 3. Architecture & Data Contracts

### 3.1 IndexedDB Storage Adapter (`src/lib/storage/indexed-db.ts`)
```typescript
export interface IndexedDBStorageConfig {
  dbName?: string;
  storeName?: string;
  version?: number;
}
```
- Implements `StateStorage`:
  - `getItem: (key: string) => Promise<string | null>`
  - `setItem: (key: string, value: string) => Promise<void>`
  - `removeItem: (key: string) => Promise<void>`

### 3.2 Chat Store (`src/stores/chat-store.ts`)
```typescript
export interface ChatState {
  conversations: Record<PersonaId, ChatMessage[]>;
  isStreaming: boolean;
  activePersona: PersonaId;
  error: string | null;

  addMessage: (
    personaId: PersonaId,
    message: Omit<ChatMessage, 'id' | 'timestamp' | 'personaId'> & {
      id?: string;
      timestamp?: string;
    }
  ) => ChatMessage;
  appendStreamingToken: (personaId: PersonaId, messageId: string, token: string) => void;
  finishStreaming: (personaId: PersonaId, messageId: string) => void;
  clearChat: (personaId: PersonaId) => void;
  clearAllChats: () => void;
  getMessages: (personaId: PersonaId) => ChatMessage[];
  setActivePersona: (personaId: PersonaId) => void;
  setError: (error: string | null) => void;
}
```

---

## 4. Verification Plan
- **TypeScript & Lint**: `npx tsc --noEmit && npm run lint`
- **Unit Tests**:
  - `src/lib/storage/__tests__/indexed-db.test.ts`
  - `src/stores/__tests__/chat-store.test.ts`
- **Coverage**: 100% action and persistence coverage.
