# 📄 Technical Specification: Step 9.1a — Chat Message Bubble & Suggested Questions Components

> **Step ID**: `9.1a`  
> **Target Module**: `src/components/chat/`  
> **Git Feature Branch**: `feat/step-9-1a-chat-bubbles-starters`  
> **Status**: 📋 Ready for Implementation  
> **Created**: 2026-10-04  

---

## 1. Executive Summary

This specification initiates **Phase 9 (Chat Interface)** of Future You by introducing the core presentation elements of the persona conversation view: the **`ChatMessageBubble`** and the **`SuggestedQuestions`** (conversation starters) components.

The `ChatMessageBubble` renders human user queries (right-aligned, neutral tertiary surface) and simulated persona responses (left-aligned, themed with amber accents for Current Path and emerald accents for Improved Path). It supports streaming state animation, optional TTS speech playback triggers, and timestamp metadata. The `SuggestedQuestions` component presents an curated list of philosophical, introspective conversation starter prompts tailored specifically to the selected future self persona.

---

## 2. Dependencies & Prerequisites

- **Depends on**:
  - `src/types/chat.types.ts` (`ChatMessage`, `ChatMessageRole`)
  - `src/types/persona.types.ts` (`PersonaId`)
  - `src/components/ui/button.tsx` (`Button`)
  - `src/lib/utils.ts` (`cn`)
  - `lucide-react` icons (`Volume2`, `VolumeX`, `Sparkles`, `Clock`, `User`)
- **Blocked by**: None.
- **New Packages / Libraries**: None (Tech stack is strictly locked).

---

## 3. 🔒 Privacy, Storage & Accessibility Impact

- [x] **Zero Cloud Storage**: Chat messages are client-side only (stored in IndexedDB / Zustand).
- [x] **Honesty Disclaimer Alignment**: Maintains non-predictive reflection framing (*"Simulated persona conversation"*).
- [x] **WCAG AA Accessibility**:
  - `aria-label` on all interactive starter buttons and audio playback controls.
  - Streaming message bubbles announce updates politely via `aria-live="polite"`.
  - Contrast ratios exceed 4.5:1 on dark canvas (`#0A0A0B` / `#141416`).
- [x] **Code & Architecture Constraints**:
  - `function` component declarations exclusively.
  - TypeScript `interface` typing for all props.
  - Strictly $\le 300$ LOC per file.

---

## 4. 🧠 Sequential Thinking MCP Evaluation

- **Heuristic Evaluation**:
  - Persona chat prompt templates and grounding were validated in Phase 5 (`eval_persona`).
  - Step 9.1a focuses on pure React/Tailwind visual presentation components.
- **Verdict**: Sequential Thinking MCP is **Skipped** for Step 9.1a. (Will be activated if needed for multi-turn streaming context in 9.2).

---

## 5. Component Contracts & Interfaces

### 5.1 ChatMessageBubble (`src/components/chat/chat-message-bubble.tsx`)

```typescript
import { ChatMessage } from '@/types/chat.types';

export interface ChatMessageBubbleProps {
  /** Chat message entity */
  message: ChatMessage;
  /** Display name of the speaking persona (for assistant messages) */
  personaName?: string;
  /** Optional callback to trigger text-to-speech reading */
  onSpeak?: (text: string) => void;
  /** Whether this message is currently being read aloud */
  isSpeaking?: boolean;
  /** Optional custom CSS classes */
  className?: string;
}
```

### 5.2 SuggestedQuestions (`src/components/chat/suggested-questions.tsx`)

```typescript
import { PersonaId } from '@/types/persona.types';

export interface SuggestedQuestionsProps {
  /** Persona path identifier */
  personaId: PersonaId;
  /** Callback triggered when a starter question is clicked */
  onSelectQuestion: (question: string) => void;
  /** Optional custom CSS classes */
  className?: string;
}
```

---

## 6. Visual & Styling Specifications

| Component / Section | User Role | Current Path Persona | Improved Path Persona |
| :--- | :--- | :--- | :--- |
| **Bubble Alignment** | Right (`justify-end`) | Left (`justify-start`) | Left (`justify-start`) |
| **Bubble Background** | `bg-bg-tertiary` | `bg-current-bg/40 border border-current-border` | `bg-improved-bg/40 border border-improved-border` |
| **Accent Marker** | None | 6px Amber dot (`bg-accent-current`) | 6px Emerald dot (`bg-accent-improved`) |
| **Border Radius** | `rounded-2xl rounded-br-sm` | `rounded-2xl rounded-bl-sm` | `rounded-2xl rounded-bl-sm` |

---

## 7. Step-by-Step Implementation Sequence

1. **Phase A: Directory Setup & SuggestedQuestions (`src/components/chat/suggested-questions.tsx`)**
   - Create `src/components/chat/` directory.
   - Author `SuggestedQuestions` with distinct prompt collections for Current vs Improved personas.

2. **Phase B: ChatMessageBubble (`src/components/chat/chat-message-bubble.tsx`)**
   - Build `ChatMessageBubble` handling `user` and `assistant` layouts.
   - Implement streaming cursor pulse effect when `isStreaming` is true.
   - Add optional TTS speak trigger button.
   - Format timestamps cleanly.

3. **Phase C: Barrel Export (`src/components/chat/index.ts`)**
   - Export components and interfaces.

4. **Phase D: Spec-Driven Tests**
   - Author `src/components/chat/__tests__/chat-message-bubble.test.tsx`.
   - Author `src/components/chat/__tests__/suggested-questions.test.tsx`.

---

## 8. Verification & Acceptance Criteria

### Automated Tests
```bash
npm test -- src/components/chat
npx tsc --noEmit
npm run lint
```

### Acceptance Checklist
- [x] All components declared using `function` syntax with typed props.
- [x] Files strictly $\le 300$ LOC.
- [x] Clear visual separation between user and persona messages.
- [x] Streaming indicator animated when `isStreaming` is active.
- [x] 100% test pass rate with zero TypeScript compiler or ESLint warnings.
