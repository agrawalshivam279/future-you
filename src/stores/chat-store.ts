import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ChatMessage, PersonaId } from '@/types';
import { STORAGE_PREFIX } from '@/lib/constants';
import { createIndexedDBStorage } from '@/lib/storage/indexed-db';

export interface ChatState {
  /** Map of conversation logs indexed by persona trajectory */
  conversations: Record<PersonaId, ChatMessage[]>;
  /** Transient flag indicating AI response token streaming is in progress */
  isStreaming: boolean;
  /** Currently focused persona for the chat view */
  activePersona: PersonaId;
  /** Error message from streaming or storage failures */
  error: string | null;

  /** Append a message to the specified persona's transcript */
  addMessage: (
    personaId: PersonaId,
    message: Omit<ChatMessage, 'id' | 'timestamp' | 'personaId'> & {
      id?: string;
      timestamp?: string;
    }
  ) => ChatMessage;

  /** Accumulate an incoming token onto an active streaming assistant message */
  appendStreamingToken: (
    personaId: PersonaId,
    messageId: string,
    token: string
  ) => void;

  /** Mark streaming as complete for a message */
  finishStreaming: (personaId: PersonaId, messageId: string) => void;

  /** Clear conversation history for a specific persona */
  clearChat: (personaId: PersonaId) => void;

  /** Wipe conversation histories across all personas */
  clearAllChats: () => void;

  /** Retrieve messages for a persona */
  getMessages: (personaId: PersonaId) => ChatMessage[];

  /** Change active persona focus */
  setActivePersona: (personaId: PersonaId) => void;

  /** Set or clear error state */
  setError: (error: string | null) => void;

  /** Reset all store state */
  resetChat: () => void;
}

const INITIAL_CONVERSATIONS: Record<PersonaId, ChatMessage[]> = {
  current: [],
  improved: [],
};

const INITIAL_STATE = {
  conversations: INITIAL_CONVERSATIONS,
  isStreaming: false,
  activePersona: 'improved' as PersonaId,
  error: null,
};

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Zustand store managing multi-persona chat exchanges.
 * Persists messages asynchronously to IndexedDB under future-you:chat.
 * Filters out transient streaming flags during persistence.
 */
export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      addMessage: (personaId, messageInput) => {
        const id = messageInput.id || generateId();
        const timestamp = messageInput.timestamp || new Date().toISOString();
        const newMessage: ChatMessage = {
          ...messageInput,
          id,
          personaId,
          timestamp,
        };

        set((state) => {
          const list = state.conversations[personaId] || [];
          return {
            conversations: {
              ...state.conversations,
              [personaId]: [...list, newMessage],
            },
          };
        });

        return newMessage;
      },

      appendStreamingToken: (personaId, messageId, token) => {
        set((state) => {
          const list = state.conversations[personaId] || [];
          const updated = list.map((msg) =>
            msg.id === messageId
              ? { ...msg, content: msg.content + token, isStreaming: true }
              : msg
          );

          return {
            isStreaming: true,
            conversations: {
              ...state.conversations,
              [personaId]: updated,
            },
          };
        });
      },

      finishStreaming: (personaId, messageId) => {
        set((state) => {
          const list = state.conversations[personaId] || [];
          const updated = list.map((msg) =>
            msg.id === messageId ? { ...msg, isStreaming: false } : msg
          );

          return {
            isStreaming: false,
            conversations: {
              ...state.conversations,
              [personaId]: updated,
            },
          };
        });
      },

      clearChat: (personaId) => {
        set((state) => ({
          conversations: {
            ...state.conversations,
            [personaId]: [],
          },
        }));
      },

      clearAllChats: () => {
        set({
          conversations: {
            current: [],
            improved: [],
          },
        });
      },

      getMessages: (personaId) => {
        return get().conversations[personaId] || [];
      },

      setActivePersona: (activePersona) => set({ activePersona }),

      setError: (error) => set({ error }),

      resetChat: () => set(INITIAL_STATE),
    }),
    {
      name: `${STORAGE_PREFIX}chat`,
      storage: createJSONStorage(() =>
        createIndexedDBStorage('future-you-db', 'chat')
      ),
      partialize: (state) => ({
        conversations: state.conversations,
      }),
    }
  )
);
