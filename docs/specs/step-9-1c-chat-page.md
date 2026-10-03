# 📄 Technical Specification: Step 9.1c — Chat Page Route & Persona Chat Integration

> **Step ID**: `9.1c`  
> **Target Module**: `src/app/chat/` & `src/hooks/`  
> **Git Feature Branch**: `feat/step-9-1c-chat-page`  
> **Status**: 📋 Ready for Implementation  
> **Created**: 2026-10-04  

---

## 1. Executive Summary

This specification completes **Phase 9 (Chat Interface)** of Future You by connecting all UI components (`ChatHeader`, `ChatMessageList`, `ChatInput`, `ChatMessageBubble`, `SuggestedQuestions`) with the streaming AI engine (`chatWithPersona`) and persistent state (`useChatStore`, `useLifeModelStore`, `useOnboardingStore`).

We implement:
1. **`usePersonaChat`** (`src/hooks/use-persona-chat.ts`): Orchestration hook managing active persona trajectory, message submission, real-time token streaming accumulation into `useChatStore`, cancellation via `AbortController`, error recovery, and Web Speech API speech synthesis integration.
2. **`ChatPage`** (`src/app/chat/page.tsx`): Responsive full-height Next.js 14 App Router chat page supporting persona query parameter routing (`/chat?persona=current` or `/chat?persona=improved`), dynamic switcher toggles, clear conversation confirmation, empty-model guards, and honesty disclaimers.

---

## 2. Dependencies & Prerequisites

- **Depends on**:
  - Step 9.1a & 9.1b components (`ChatHeader`, `ChatMessageList`, `ChatInput` in `src/components/chat/`)
  - `src/lib/ai/chat-with-persona.ts` (`chatWithPersona`)
  - `src/stores/chat-store.ts` (`useChatStore`)
  - `src/stores/life-model-store.ts` (`useLifeModelStore`)
  - `src/stores/onboarding-store.ts` (`useOnboardingStore`)
  - `src/components/ui/modal.tsx` (`Modal`)
  - `src/components/ui/button.tsx` (`Button`)
  - `src/components/ui/card.tsx` (`Card`)
  - Next.js 14 App Router navigation (`useRouter`, `useSearchParams`)
- **Blocked by**: None.
- **New Packages / Libraries**: None (Tech stack strictly locked).

---

## 3. 🔒 Privacy, Storage & Accessibility Impact

- [x] **Zero Cloud Storage**: Chat messages persist only in IndexedDB under `future-you:chat` via `useChatStore`.
- [x] **Client-Side TTS**: Speech synthesis runs strictly through browser `window.speechSynthesis`.
- [x] **WCAG AA Accessibility**:
  - Full keyboard accessibility (Tab navigation, Enter submission).
  - Clear Chat modal with focus trap and Escape dismiss.
  - ARIA attributes (`role="log"`, `role="tab"`, `aria-selected`, `aria-live="polite"`).
- [x] **Honesty Disclaimer**: Visible disclaimer banner in page footer and empty states.
- [x] **Code Quality**:
  - `function` component declarations exclusively.
  - TypeScript `interface` typing for all props.
  - Strictly $\le 300$ LOC per file.

---

## 4. 🧠 Sequential Thinking MCP Evaluation

- **Heuristic Evaluation**:
  - High complexity streaming hook and multi-store coordination.
- **Evaluation**: The streaming logic is well encapsulated in `chatWithPersona` (already tested in Phase 5), and `useChatStore` handles atomic token updates. Sequential Thinking MCP is recommended for evaluating state transitions, unmount cleanup, and URL search param sync.

---

## 5. Component Contracts & Interfaces

### 5.1 `usePersonaChat` Hook (`src/hooks/use-persona-chat.ts`)

```typescript
export interface UsePersonaChatOptions {
  initialPersonaId?: PersonaId;
}

export interface UsePersonaChatReturn {
  activePersona: PersonaId;
  setActivePersona: (id: PersonaId) => void;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  speakingMessageId: string | null;
  speakMessage: (text: string) => void;
  stopSpeaking: () => void;
}
```

### 5.2 `ChatPage` Route (`src/app/chat/page.tsx`)

- Uses Suspense wrapper for `useSearchParams` (Next.js 14 requirement).
- Synchronizes URL query parameter (`?persona=...`) with `usePersonaChat`.
- Displays modal confirmation before clearing transcript history.

---

## 6. Step-by-Step Implementation Sequence

1. **Phase A: Hook Implementation (`src/hooks/use-persona-chat.ts`)**
   - Wire `chatWithPersona`, `useChatStore`, `useLifeModelStore`, `useOnboardingStore`.
   - Implement `sendMessage` with streaming token accumulation.
   - Implement TTS using browser `window.speechSynthesis`.

2. **Phase B: Route Implementation (`src/app/chat/page.tsx`)**
   - Author page layout with `ChatHeader`, `ChatMessageList`, `ChatInput`.
   - Wrap client component in `Suspense` boundary for `useSearchParams`.
   - Add empty-state guard if no life model exists.

3. **Phase C: Spec-Driven Tests**
   - Author `src/hooks/__tests__/use-persona-chat.test.ts`.
   - Author `src/app/chat/__tests__/page.test.tsx`.

4. **Phase D: Quality Verification**
   - Run compiler (`tsc --noEmit`), linter (`npm run lint`), and Jest test suites.

---

## 7. Verification & Acceptance Criteria

- All tests pass with 100% success rate.
- Token streaming updates assistant message in real-time.
- Both persona tabs (current/improved) maintain distinct message histories.
- Zero TypeScript compiler errors, zero ESLint warnings, all files $\le 300$ LOC.
