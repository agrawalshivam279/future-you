# 📄 Technical Specification: Step 9.1b — Chat Input, Message List & Header Components

> **Step ID**: `9.1b`  
> **Target Module**: `src/components/chat/`  
> **Git Feature Branch**: `feat/step-9-1b-chat-input-list`  
> **Status**: 📋 Ready for Implementation  
> **Created**: 2026-10-04  

---

## 1. Executive Summary

This specification continues **Phase 9 (Chat Interface)** of Future You by introducing the core structural and interaction components of the persona conversation: **`ChatInput`**, **`ChatMessageList`**, and **`ChatHeader`**.

The `ChatInput` provides an accessible, auto-resizing text entry area with Enter-to-send (Shift+Enter for multi-line) keyboard ergonomics and send button controls. The `ChatMessageList` handles conversational rendering with automatic smooth scroll-to-bottom upon message arrival, loading indicator states, and empty-state starter question integration. The `ChatHeader` features a persona switcher tab toggle (Current Path amber vs Improved Path emerald), back-to-dashboard navigation, and clear-chat triggers.

---

## 2. Dependencies & Prerequisites

- **Depends on**:
  - Step 9.1a components (`ChatMessageBubble`, `SuggestedQuestions` in `src/components/chat/`)
  - `src/types/chat.types.ts` (`ChatMessage`, `ChatMessageRole`)
  - `src/types/persona.types.ts` (`PersonaId`)
  - `src/components/ui/button.tsx` (`Button`)
  - `src/components/ui/badge.tsx` (`Badge`)
  - `lucide-react` icons (`Send`, `ArrowLeft`, `Trash2`, `Sparkles`, `Loader2`)
- **Blocked by**: None.
- **New Packages / Libraries**: None (Tech stack is strictly locked).

---

## 3. 🔒 Privacy, Storage & Accessibility Impact

- [x] **Zero Cloud Storage**: All input and history remain strictly client-side.
- [x] **WCAG AA Accessibility**:
  - `ChatInput` textarea includes `aria-label="Your message to your future self"`.
  - Enter sends message; Shift+Enter creates a new line.
  - Persona switcher tabs feature `role="tab"` and `aria-selected` attributes.
  - `ChatMessageList` uses `role="log"` with `aria-live="polite"`.
- [x] **Code & Architecture Constraints**:
  - `function` component declarations exclusively.
  - TypeScript `interface` typing for all props.
  - Strictly $\le 300$ LOC per file.

---

## 4. 🧠 Sequential Thinking MCP Evaluation

- **Heuristic Evaluation**:
  - Pure React/Tailwind/DOM UI orchestration (scrolling, text input, tab switching) without dynamic LLM prompting.
- **Verdict**: Sequential Thinking MCP is **Skipped** for Step 9.1b.

---

## 5. Component Contracts & Interfaces

### 5.1 ChatInput (`src/components/chat/chat-input.tsx`)

```typescript
export interface ChatInputProps {
  /** Callback fired when a message is submitted */
  onSendMessage: (content: string) => void;
  /** Whether the AI is currently generating a response */
  isLoading?: boolean;
  /** Input placeholder string */
  placeholder?: string;
  /** Optional custom CSS classes */
  className?: string;
}
```

### 5.2 ChatMessageList (`src/components/chat/chat-message-list.tsx`)

```typescript
import { ChatMessage } from '@/types/chat.types';
import { PersonaId } from '@/types/persona.types';

export interface ChatMessageListProps {
  /** Ordered message history */
  messages: ChatMessage[];
  /** Display name of active persona */
  personaName?: string;
  /** Active persona path */
  personaId: PersonaId;
  /** Whether an AI response is actively streaming/generating */
  isLoading?: boolean;
  /** Callback when user clicks a suggested starter question */
  onSelectStarter?: (question: string) => void;
  /** Callback for TTS voice playback */
  onSpeakMessage?: (text: string) => void;
  /** Currently speaking message identifier */
  speakingMessageId?: string | null;
  /** Optional custom CSS classes */
  className?: string;
}
```

### 5.3 ChatHeader (`src/components/chat/chat-header.tsx`)

```typescript
import { PersonaId } from '@/types/persona.types';

export interface ChatHeaderProps {
  /** Active persona trajectory identifier */
  activePersona: PersonaId;
  /** Callback invoked when switching between personas */
  onSelectPersona: (personaId: PersonaId) => void;
  /** Persona display name */
  personaName: string;
  /** Callback to clear conversation history */
  onClearChat?: () => void;
  /** Callback to navigate back to dashboard */
  onBackClick?: () => void;
  /** Optional custom CSS classes */
  className?: string;
}
```

---

## 6. Step-by-Step Implementation Sequence

1. **Phase A: ChatInput Component (`src/components/chat/chat-input.tsx`)**
   - Author textarea with auto-resize and Enter-to-submit behavior.
   - Prevent empty whitespace submissions.
   - Render accessible Send button with loading spinner state.

2. **Phase B: ChatMessageList Component (`src/components/chat/chat-message-list.tsx`)**
   - Author message list with automatic smooth scroll using `useRef` and `scrollIntoView`.
   - Render empty state with reflection guidance and `SuggestedQuestions`.
   - Render thinking/loading indicator during prompt execution.

3. **Phase C: ChatHeader Component (`src/components/chat/chat-header.tsx`)**
   - Author header with back navigation, persona tabs (Current vs Improved), and Clear Chat action.

4. **Phase D: Barrel Export (`src/components/chat/index.ts`)**
   - Export all chat components and interfaces.

5. **Phase E: Spec-Driven Tests**
   - Author `src/components/chat/__tests__/chat-input.test.tsx`.
   - Author `src/components/chat/__tests__/chat-message-list.test.tsx`.
   - Author `src/components/chat/__tests__/chat-header.test.tsx`.

---

## 7. Verification & Acceptance Criteria

### Automated Tests
```bash
npm test -- src/components/chat
npx tsc --noEmit
npm run lint
```

### Acceptance Checklist
- [x] All components declared using `function` syntax with typed props.
- [x] Files strictly $\le 300$ LOC.
- [x] Enter submits message, Shift+Enter creates newline.
- [x] Auto-scroll triggers smoothly on message arrival.
- [x] Persona switcher tabs toggle between Current Path and Improved Path.
- [x] 100% test pass rate with zero TypeScript compiler or ESLint warnings.
