import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useChatStore } from '@/stores/chat-store';
import { useLifeModelStore } from '@/stores/life-model-store';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { chatWithPersona } from '@/lib/ai/chat-with-persona';
import { PersonaId, ChatMessage, Persona } from '@/types';

export interface UsePersonaChatOptions {
  /** Initial persona to chat with */
  initialPersonaId?: PersonaId;
}

export interface UsePersonaChatReturn {
  /** Active persona trajectory identifier */
  activePersona: PersonaId;
  /** Set active persona */
  setActivePersona: (id: PersonaId) => void;
  /** Active persona data model */
  currentPersonaData: Persona | null;
  /** Transcript messages for active persona */
  messages: ChatMessage[];
  /** Whether the AI is currently streaming response tokens */
  isLoading: boolean;
  /** Conversational or network error message */
  error: string | null;
  /** Clear error message */
  clearError: () => void;
  /** Send a new prompt to the active persona */
  sendMessage: (content: string) => Promise<void>;
  /** Clear chat history for the active persona */
  clearChat: () => void;
  /** Currently speaking message identifier for TTS */
  speakingMessageId: string | null;
  /** Trigger text-to-speech reading using browser Web Speech API */
  speakMessage: (text: string, messageId?: string) => void;
  /** Stop active text-to-speech audio playback */
  stopSpeaking: () => void;
}

/**
 * Custom hook orchestrating the full streaming persona chat experience,
 * integrating useChatStore, useLifeModelStore, and browser TTS.
 *
 * @param options - Configuration options
 * @returns State and controller methods for persona conversation
 */
export function usePersonaChat({
  initialPersonaId = 'improved',
}: UsePersonaChatOptions = {}): UsePersonaChatReturn {
  const [activePersona, setActivePersonaState] = useState<PersonaId>(initialPersonaId);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const conversations = useChatStore((state) => state.conversations);
  const isLoading = useChatStore((state) => state.isStreaming);
  const error = useChatStore((state) => state.error);
  const lifeModel = useLifeModelStore((state) => state.model);
  const getOnboardingData = useOnboardingStore((state) => state.getOnboardingData);
  const onboardingData = useMemo(
    () => lifeModel?.inputs || getOnboardingData(),
    [lifeModel, getOnboardingData]
  );

  const rawMessages = conversations[activePersona];
  const messages = useMemo(() => rawMessages || [], [rawMessages]);

  const currentPersonaData =
    activePersona === 'current'
      ? lifeModel?.currentPath ?? null
      : lifeModel?.improvedPath ?? null;

  const setActivePersona = useCallback((id: PersonaId) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    useChatStore.getState().setActivePersona(id);
    setActivePersonaState(id);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
  }, []);

  const speakMessage = useCallback(
    (text: string, messageId?: string) => {
      if (
        typeof window === 'undefined' ||
        !('speechSynthesis' in window) ||
        typeof SpeechSynthesisUtterance === 'undefined'
      ) {
        return;
      }

      // If already speaking this message, toggle off
      if (speakingMessageId && (!messageId || speakingMessageId === messageId)) {
        stopSpeaking();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      setSpeakingMessageId(messageId || 'active');

      utterance.onend = () => {
        setSpeakingMessageId(null);
      };
      utterance.onerror = () => {
        setSpeakingMessageId(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    [speakingMessageId, stopSpeaking]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      const store = useChatStore.getState();
      if (!trimmed || store.isStreaming || !currentPersonaData) return;

      store.setError(null);

      const historySnapshot = store.conversations[activePersona] || [];

      // Add user message to conversation history
      store.addMessage(activePersona, {
        role: 'user',
        content: trimmed,
      });

      // Add placeholder assistant message marked as streaming
      const assistantPlaceholder = store.addMessage(activePersona, {
        role: 'assistant',
        content: '',
        isStreaming: true,
      });

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        await chatWithPersona(
          activePersona,
          trimmed,
          currentPersonaData,
          onboardingData,
          {
            signal: abortController.signal,
            chatHistory: historySnapshot,
            onToken: (token) => {
              useChatStore
                .getState()
                .appendStreamingToken(activePersona, assistantPlaceholder.id, token);
            },
          }
        );

        useChatStore.getState().finishStreaming(activePersona, assistantPlaceholder.id);
      } catch (err) {
        const currentStore = useChatStore.getState();
        currentStore.finishStreaming(activePersona, assistantPlaceholder.id);

        // Remove empty assistant placeholder if no tokens were streamed before error/abort
        const targetMsg = currentStore.conversations[activePersona]?.find(
          (m) => m.id === assistantPlaceholder.id
        );
        if (targetMsg && !targetMsg.content.trim()) {
          useChatStore.setState((state) => ({
            conversations: {
              ...state.conversations,
              [activePersona]: (state.conversations[activePersona] || []).filter(
                (m) => m.id !== assistantPlaceholder.id
              ),
            },
          }));
        }

        const isAborted =
          abortController.signal.aborted ||
          (err instanceof Error &&
            (err.name === 'AbortError' || err.message.toLowerCase().includes('cancelled')));
        if (isAborted) {
          return;
        }

        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Unable to connect with persona. Please check your AI API key.';

        currentStore.setError(errorMessage);
      } finally {
        if (abortControllerRef.current === abortController) {
          abortControllerRef.current = null;
        }
      }
    },
    [activePersona, currentPersonaData, onboardingData]
  );

  const clearChat = useCallback(() => {
    useChatStore.getState().clearChat(activePersona);
  }, [activePersona]);

  const clearError = useCallback(() => {
    useChatStore.getState().setError(null);
  }, []);

  // Cleanup abort controller and speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    activePersona,
    setActivePersona,
    currentPersonaData,
    messages,
    isLoading,
    error,
    clearError,
    sendMessage,
    clearChat,
    speakingMessageId,
    speakMessage,
    stopSpeaking,
  };
}
