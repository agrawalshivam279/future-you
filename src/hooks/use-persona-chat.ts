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

  const chatStore = useChatStore();
  const lifeModel = useLifeModelStore((state) => state.model);
  const getOnboardingData = useOnboardingStore((state) => state.getOnboardingData);
  const onboardingData = lifeModel?.inputs || getOnboardingData();

  const rawMessages = chatStore.conversations[activePersona];
  const messages = useMemo(() => rawMessages || [], [rawMessages]);
  const isLoading = chatStore.isStreaming;
  const error = chatStore.error;

  const currentPersonaData =
    activePersona === 'current'
      ? lifeModel?.currentPath ?? null
      : lifeModel?.improvedPath ?? null;

  const setActivePersona = useCallback(
    (id: PersonaId) => {
      // Abort any ongoing streaming before switching persona
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      chatStore.setActivePersona(id);
      setActivePersonaState(id);
    },
    [chatStore]
  );

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
      if (messageId) {
        setSpeakingMessageId(messageId);
      } else {
        setSpeakingMessageId('active');
      }

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
      if (!trimmed || isLoading || !currentPersonaData) return;

      chatStore.setError(null);

      // Add user message to conversation history
      chatStore.addMessage(activePersona, {
        role: 'user',
        content: trimmed,
      });

      // Add placeholder assistant message marked as streaming
      const assistantPlaceholder = chatStore.addMessage(activePersona, {
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
            chatHistory: messages,
            onToken: (token) => {
              chatStore.appendStreamingToken(
                activePersona,
                assistantPlaceholder.id,
                token
              );
            },
          }
        );

        chatStore.finishStreaming(activePersona, assistantPlaceholder.id);
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') {
          chatStore.finishStreaming(activePersona, assistantPlaceholder.id);
          return;
        }

        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Unable to connect with persona. Please check your AI API key.';

        chatStore.finishStreaming(activePersona, assistantPlaceholder.id);
        chatStore.setError(errorMessage);
      } finally {
        abortControllerRef.current = null;
      }
    },
    [activePersona, currentPersonaData, onboardingData, messages, isLoading, chatStore]
  );

  const clearChat = useCallback(() => {
    chatStore.clearChat(activePersona);
  }, [chatStore, activePersona]);

  const clearError = useCallback(() => {
    chatStore.setError(null);
  }, [chatStore]);

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
