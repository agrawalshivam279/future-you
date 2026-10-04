# 📄 Technical Specification: TTS Engine & Audio Player Component

> **Step ID**: `Step 11.1a`  
> **Target Module**: `src/lib/tts.ts`, `src/components/letter/tts-player.tsx`, `src/components/letter/index.ts`  
> **Git Feature Branch**: `feat/step-11-1a-tts-engine-player`  
> **Status**: 📋 Ready for Implementation  
> **Created**: 2026-10-04  

---

## 1. Executive Summary

Step 11.1a implements the client-side Text-to-Speech (TTS) engine and audio player control component for Future You. Powered exclusively by the browser's native Web Speech API (`SpeechSynthesis` and `SpeechSynthesisUtterance`), this engine reads introspective future-self letters aloud without any external cloud TTS services, preserving the zero-cloud-storage privacy invariant. The module provides deterministic sentence segmentation, robust state handling across playback lifecycles (play, pause, resume, stop), rate controls (0.75x, 1.0x, 1.25x, 1.5x), voice selection, and real-time sentence boundary synchronization to power sentence highlighting in Step 11.1b.

---

## 2. Dependencies & Prerequisites

- **Depends on**:
  - `src/components/ui/button.tsx` (primitive Button with icon support)
  - `src/components/ui/card.tsx` (primitive Card for player container)
  - `src/types/persona.types.ts` (Persona trajectory definitions)
- **Blocked by**: None
- **New Packages / Libraries**: None — strict tech stack lock adhering to `GEMINI.md` (Web Speech API only).

---

## 3. 🔒 Privacy, Storage & Disclaimer Impact

- [x] **Zero Cloud Storage**: 100% in-browser Web Speech API audio synthesis. No audio or text transmitted to third-party TTS APIs.
- [x] **LocalStorage Prefix**: Any persisted voice/rate preferences will use `future-you:` prefix if added.
- [x] **Honesty Disclaimer**: Integrates with the letter reflection context ("You are a reflection tool, not a prediction engine").
- [x] **Accessibility**: Meets WCAG AA contrast ($\ge 4.5:1$). All interactive buttons (`Play`, `Pause`, `Resume`, `Stop`, speed toggles, voice select) have clear `aria-label` attributes and keyboard focus styling.

---

## 4. 🧠 Sequential Thinking Strategy

1. **Browser Inconsistencies & Sentence-by-Sentence Chaining**:
   - Native `onboundary` event implementation varies widely across browsers (word vs sentence tokens, inconsistent `charIndex`).
   - Slicing letter text into an array of clean sentences with `splitIntoSentences` and sequencing them enables 100% deterministic sentence index tracking, seamless pause/resume, and zero-drift UI highlighting.
2. **Asynchronous Voice Loading Lifecycle**:
   - `window.speechSynthesis.getVoices()` is asynchronous in Chromium-based browsers, returning empty arrays until `voiceschanged` fires.
   - `getAvailableVoices()` will synchronously check `getVoices()` and attach an event listener to capture voices when populated.
3. **Graceful Fallbacks for Unsupported Environments**:
   - Guard checks for Server-Side Rendering (`typeof window === 'undefined'`) and non-supporting browsers/test runners (`'speechSynthesis' in window`).
   - If TTS is not supported, `TTSPlayer` renders a clean, accessible fallback badge indicating speech synthesis is unavailable on the client device without crashing.

---

## 5. Component / Store / Data Contracts

### 5.1 Engine Types (`src/lib/tts.ts`)

```typescript
export type TTSPlaybackState = 'idle' | 'playing' | 'paused' | 'stopped';

export interface TTSVoiceOption {
  voice: SpeechSynthesisVoice;
  label: string;
  lang: string;
  isDefault: boolean;
}

export interface TTSControllerOptions {
  voice?: SpeechSynthesisVoice | null;
  rate?: number;
  pitch?: number;
  volume?: number;
  onSentenceChange?: (sentenceIndex: number, sentence: string) => void;
  onStateChange?: (state: TTSPlaybackState) => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

export interface TTSController {
  play: (textOrSentences: string | string[], startIndex?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setRate: (rate: number) => void;
  setVoice: (voice: SpeechSynthesisVoice | null) => void;
  getState: () => TTSPlaybackState;
  getCurrentSentenceIndex: () => number;
  destroy: () => void;
}
```

### 5.2 Component Props (`src/components/letter/tts-player.tsx`)

```typescript
export interface TTSPlayerProps {
  /** Full text or pre-split sentences of the future-self letter */
  text: string;
  /** Active persona trajectory identifier for theme accents */
  personaId?: 'current' | 'improved';
  /** Optional callback fired when the active sentence changes */
  onSentenceChange?: (sentenceIndex: number) => void;
  /** Optional callback fired when playback state changes */
  onPlaybackStateChange?: (state: TTSPlaybackState) => void;
  /** Custom wrapper styling */
  className?: string;
}
```

---

## 6. Step-by-Step Implementation Sequence

1. **Phase A: Core TTS Engine (`src/lib/tts.ts`)**
   - Implement `isSpeechSynthesisSupported()` helper.
   - Implement `splitIntoSentences(text: string): string[]` with punctuation preservation.
   - Implement `getAvailableVoices(): Promise<SpeechSynthesisVoice[]>` and synchronous `getCachedVoices()`.
   - Implement `createTTSController(options?: TTSControllerOptions): TTSController` managing sequential utterance dispatch, pause, resume, cancel, and state events.
2. **Phase B: TTS Player Component (`src/components/letter/tts-player.tsx`)**
   - Build `TTSPlayer` component using `function` declaration ($\le 300$ LOC).
   - Render Play, Pause, Resume, Stop controls with Lucide icons (`Play`, `Pause`, `Square`, `RotateCcw`, `Volume2`, `VolumeX`).
   - Implement playback speed pills (`0.75x`, `1.0x`, `1.25x`, `1.5x`).
   - Implement voice selection dropdown if voices exist.
   - Display active progress indicator (`Sentence X of Y`).
   - Create barrel export in `src/components/letter/index.ts`.
3. **Phase C: Hermetic Testing & Verification**
   - Write comprehensive unit tests for `src/lib/tts.ts` in `src/lib/__tests__/tts.test.ts` (sentence splitting, voice detection, controller state transitions).
   - Write component tests for `TTSPlayer` in `src/components/letter/__tests__/tts-player.test.tsx` (render, play/pause controls, speed changing, unsupported fallback).

---

## 7. Verification & Acceptance Criteria

### Automated Tests
```bash
npm test -- src/lib/__tests__/tts.test.ts src/components/letter/__tests__/tts-player.test.tsx
```

### Acceptance Checklist
- [ ] `src/lib/tts.ts` splits sentences cleanly without truncation or orphan punctuation.
- [ ] Controller supports `play`, `pause`, `resume`, `stop`, `setRate`, and `setVoice`.
- [ ] `TTSPlayer` renders cleanly with accessible dark mode styling.
- [ ] All interactive buttons have explicit `aria-label` attributes.
- [ ] Max file length $\le 300$ lines per file.
- [ ] `tsc --noEmit` and `npm run lint` return 0 errors.
