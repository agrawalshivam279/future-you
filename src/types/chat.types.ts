/**
 * Chat and streaming conversation types for Future You.
 */

import { PersonaId } from './persona.types';

export type ChatMessageRole = 'user' | 'assistant';

/**
 * An individual message within a persona chat exchange.
 */
export interface ChatMessage {
  /** Unique message identifier (UUID) */
  id: string;
  /** Identifies which future self is conversing */
  personaId: PersonaId;
  /** Speaker role: human user or AI persona assistant */
  role: ChatMessageRole;
  /** Message content markdown or plain text */
  content: string;
  /** ISO-8601 formatted message creation timestamp */
  timestamp: string;
  /** Transient flag indicating active LLM token streaming */
  isStreaming?: boolean;
}

/**
 * Persisted conversation history for a specific persona.
 */
export interface ChatConversation {
  /** Associated persona identifier */
  personaId: PersonaId;
  /** Ordered list of chat messages */
  messages: ChatMessage[];
  /** ISO-8601 timestamp of most recent activity */
  lastUpdated: string;
}
