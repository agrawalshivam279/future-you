/**
 * Client-side Text-to-Speech (TTS) engine for Future You.
 * Provides Web Speech API encapsulation, deterministic sentence segmentation,
 * voice discovery, and sequential audio playback management.
 */

export type TTSPlaybackState = 'idle' | 'playing' | 'paused' | 'stopped';

export interface TTSVoiceOption {
  voice: SpeechSynthesisVoice;
  label: string;
  lang: string;
  isDefault: boolean;
}

export interface TTSControllerOptions {
  /** Preferred speech synthesis voice */
  voice?: SpeechSynthesisVoice | null;
  /** Playback speed multiplier (0.5 to 2.0, default 1.0) */
  rate?: number;
  /** Playback pitch (0.5 to 1.5, default 1.0) */
  pitch?: number;
  /** Playback volume (0.0 to 1.0, default 1.0) */
  volume?: number;
  /** Callback triggered when a new sentence begins playback */
  onSentenceChange?: (sentenceIndex: number, sentence: string) => void;
  /** Callback triggered when playback state transitions */
  onStateChange?: (state: TTSPlaybackState) => void;
  /** Callback triggered when the entire text completes playback */
  onEnd?: () => void;
  /** Callback triggered on speech synthesis error */
  onError?: (error: Error) => void;
}

export interface TTSController {
  /** Begin or restart playback from text or sentence array */
  play: (textOrSentences: string | string[], startIndex?: number) => void;
  /** Pause current speech synthesis */
  pause: () => void;
  /** Resume paused speech synthesis */
  resume: () => void;
  /** Stop active playback and reset index */
  stop: () => void;
  /** Dynamically adjust playback rate */
  setRate: (rate: number) => void;
  /** Dynamically adjust voice */
  setVoice: (voice: SpeechSynthesisVoice | null) => void;
  /** Query current playback lifecycle state */
  getState: () => TTSPlaybackState;
  /** Query current sentence index */
  getCurrentSentenceIndex: () => number;
  /** Total sentences in current playback buffer */
  getTotalSentences: () => number;
  /** Teardown and cancel speech synthesis */
  destroy: () => void;
}

/**
 * Checks if the browser environment supports the native Web Speech API.
 *
 * @returns boolean indicating client support
 */
export function isSpeechSynthesisSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.speechSynthesis !== 'undefined' &&
    window.speechSynthesis !== null &&
    typeof SpeechSynthesisUtterance !== 'undefined'
  );
}

/**
 * Splits raw letter markdown or plain text into clean, discrete sentences
 * while preserving sentence termination punctuation.
 *
 * @param text - Raw input text
 * @returns Array of trimmed sentences
 */
export function splitIntoSentences(text: string): string[] {
  if (!text || typeof text !== 'string') return [];

  // Remove markdown headings (# ...), horizontal rules, and blockquotes
  const cleaned = text
    .replace(/^#+\s+/gm, '')
    .replace(/^[-*_]{3,}\s*$/gm, '')
    .replace(/^>\s+/gm, '')
    .trim();

  if (!cleaned) return [];

  // Match sentences ending with punctuation (. ! ?) followed by whitespace, quotes, or EOF
  const matches = cleaned.match(/[^.!?\n]+(?:[.!?]+["']?|$)/g);

  if (!matches) {
    return [cleaned];
  }

  return matches
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !/^[-*_]+$/.test(s));
}

/**
 * Retrieves available speech synthesis voices with fallback asynchronous loading.
 *
 * @returns Promise resolving to an array of SpeechSynthesisVoice
 */
export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!isSpeechSynthesisSupported()) {
    return Promise.resolve([]);
  }

  const existingVoices = window.speechSynthesis.getVoices();
  if (existingVoices.length > 0) {
    return Promise.resolve(existingVoices);
  }

  return new Promise((resolve) => {
    let resolved = false;

    const onVoicesChanged = () => {
      if (!resolved) {
        resolved = true;
        const voices = window.speechSynthesis.getVoices();
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        resolve(voices);
      }
    };

    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

    // Timeout safety fallback
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        resolve(window.speechSynthesis.getVoices());
      }
    }, 800);
  });
}

/**
 * Creates an instance of the TTSController to manage sequential sentence-by-sentence
 * speech synthesis with lifecycle events.
 *
 * @param options - Controller configuration options
 * @returns Initialized TTSController
 */
export function createTTSController(options: TTSControllerOptions = {}): TTSController {
  let state: TTSPlaybackState = 'idle';
  let sentences: string[] = [];
  let currentIndex = 0;
  let currentRate = options.rate ?? 1.0;
  let currentPitch = options.pitch ?? 1.0;
  let currentVolume = options.volume ?? 1.0;
  let currentVoice = options.voice ?? null;
  let isManualCancel = false;

  const setState = (newState: TTSPlaybackState) => {
    state = newState;
    options.onStateChange?.(newState);
  };

  const cancelSpeech = () => {
    if (isSpeechSynthesisSupported()) {
      isManualCancel = true;
      window.speechSynthesis.cancel();
      isManualCancel = false;
    }
  };

  const speakSentence = (index: number) => {
    if (!isSpeechSynthesisSupported()) return;
    if (index >= sentences.length) {
      setState('idle');
      options.onEnd?.();
      return;
    }

    currentIndex = index;
    const sentenceText = sentences[index];
    const utterance = new SpeechSynthesisUtterance(sentenceText);

    if (currentVoice) utterance.voice = currentVoice;
    utterance.rate = currentRate;
    utterance.pitch = currentPitch;
    utterance.volume = currentVolume;

    utterance.onstart = () => {
      if (state !== 'playing') {
        setState('playing');
      }
      options.onSentenceChange?.(currentIndex, sentenceText);
    };

    utterance.onend = () => {
      if (state === 'playing') {
        speakSentence(index + 1);
      }
    };

    utterance.onerror = (event) => {
      if (isManualCancel || event.error === 'canceled' || event.error === 'interrupted') {
        return;
      }
      setState('idle');
      options.onError?.(new Error(`Speech synthesis error: ${event.error}`));
    };

    window.speechSynthesis.speak(utterance);
  };

  return {
    play: (textOrSentences, startIndex = 0) => {
      cancelSpeech();
      sentences = Array.isArray(textOrSentences)
        ? textOrSentences
        : splitIntoSentences(textOrSentences);

      if (sentences.length === 0) {
        setState('idle');
        options.onEnd?.();
        return;
      }

      setState('playing');
      speakSentence(Math.max(0, Math.min(startIndex, sentences.length - 1)));
    },

    pause: () => {
      if (state !== 'playing' || !isSpeechSynthesisSupported()) return;
      setState('paused');
      cancelSpeech();
    },

    resume: () => {
      if (state !== 'paused' || !isSpeechSynthesisSupported()) return;
      setState('playing');
      speakSentence(currentIndex);
    },

    stop: () => {
      cancelSpeech();
      currentIndex = 0;
      setState('stopped');
    },

    setRate: (rate: number) => {
      currentRate = Math.max(0.5, Math.min(rate, 2.0));
      if (state === 'playing') {
        cancelSpeech();
        speakSentence(currentIndex);
      }
    },

    setVoice: (voice: SpeechSynthesisVoice | null) => {
      currentVoice = voice;
      if (state === 'playing') {
        cancelSpeech();
        speakSentence(currentIndex);
      }
    },

    getState: () => state,
    getCurrentSentenceIndex: () => currentIndex,
    getTotalSentences: () => sentences.length,

    destroy: () => {
      cancelSpeech();
      sentences = [];
      currentIndex = 0;
      state = 'idle';
    },
  };
}
