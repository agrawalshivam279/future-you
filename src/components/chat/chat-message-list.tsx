import React, { useRef, useEffect } from 'react';
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '@/types/chat.types';
import { PersonaId } from '@/types/persona.types';
import { ChatMessageBubble } from './chat-message-bubble';
import { SuggestedQuestions } from './suggested-questions';
import { cn } from '@/lib/utils';

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

/**
 * ChatMessageList displays the conversation transcript with automatic smooth
 * scroll-to-bottom, empty-state starter question suggestions, and typing indicator.
 *
 * @param props - Component properties
 * @returns JSX Element rendering the message scroll area
 */
export function ChatMessageList({
  messages,
  personaName,
  personaId,
  isLoading = false,
  onSelectStarter,
  onSpeakMessage,
  speakingMessageId,
  className,
}: ChatMessageListProps): React.JSX.Element {
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  const isCurrent = personaId === 'current';

  // Smooth scroll to bottom on message list updates or generation state changes
  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Determine if the latest message is an assistant message currently streaming text
  const isLastMessageStreaming =
    messages.length > 0 &&
    messages[messages.length - 1].role === 'assistant' &&
    Boolean(messages[messages.length - 1].isStreaming);

  const showLoadingIndicator = isLoading && !isLastMessageStreaming;

  const accentColorClass = isCurrent ? 'text-accent-current' : 'text-accent-improved';
  const accentDotClass = isCurrent ? 'bg-accent-current' : 'bg-accent-improved';
  const defaultDisplayName = isCurrent
    ? 'Future Self (Current Path)'
    : 'Future Self (Improved Path)';
  const activeName = personaName || defaultDisplayName;

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Conversation with future self"
      data-testid="chat-message-list"
      className={cn('flex-1 overflow-y-auto px-4 py-6 space-y-6', className)}
    >
      {messages.length === 0 ? (
        <div
          data-testid="chat-empty-state"
          className="max-w-xl mx-auto flex flex-col items-center text-center space-y-6 py-8"
        >
          {/* Avatar Icon */}
          <div
            className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg transition-transform',
              isCurrent
                ? 'bg-current-bg/50 border-current-border text-accent-current'
                : 'bg-improved-bg/50 border-improved-border text-accent-improved'
            )}
          >
            <Bot className="w-7 h-7" aria-hidden="true" />
          </div>

          {/* Intro Description */}
          <div className="space-y-2">
            <h2 className="text-xl font-medium text-text-primary">
              Reflect with {activeName}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed max-w-md">
              Ask your future self about daily habits, career decisions, mindsets, or regrets.
              Remember: this is a reflection tool, not a prediction engine.
            </p>
          </div>

          {/* Suggested Starter Questions */}
          {onSelectStarter && (
            <div className="w-full pt-4 border-t border-border-primary/60 text-left">
              <SuggestedQuestions
                personaId={personaId}
                onSelectQuestion={onSelectStarter}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatMessageBubble
              key={message.id}
              message={message}
              personaName={personaName}
              onSpeak={onSpeakMessage}
              isSpeaking={speakingMessageId === message.id}
            />
          ))}

          {/* Thinking / Generating Indicator */}
          {showLoadingIndicator && (
            <div
              data-testid="chat-loading-indicator"
              role="status"
              aria-label="Future self is reflecting"
              className="flex justify-start w-full"
            >
              <div className="flex items-center gap-2 px-4 py-3 bg-bg-secondary border border-border-primary rounded-2xl rounded-bl-sm text-text-secondary text-sm">
                <span className={cn('w-2 h-2 rounded-full animate-ping', accentDotClass)} />
                <span className="text-xs font-medium text-text-tertiary">
                  Reflecting on your question...
                </span>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-text-muted ml-1" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Invisible anchor for auto-scroll */}
      <div ref={bottomAnchorRef} data-testid="chat-bottom-anchor" aria-hidden="true" />
    </div>
  );
}
