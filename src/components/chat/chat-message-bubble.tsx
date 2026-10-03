import React from 'react';
import { Volume2, VolumeX, User } from 'lucide-react';
import { ChatMessage } from '@/types/chat.types';
import { cn } from '@/lib/utils';

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

/**
 * Formats ISO timestamp to human-friendly time string (e.g. 10:45 AM).
 */
function formatMessageTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

/**
 * ChatMessageBubble renders an individual message within a persona chat exchange,
 * applying role-specific alignment, persona theming (amber for Current Path,
 * emerald for Improved Path), streaming status indicators, and TTS voice controls.
 *
 * @param props - Component properties
 * @returns JSX Element rendering the message bubble
 */
export function ChatMessageBubble({
  message,
  personaName,
  onSpeak,
  isSpeaking = false,
  className,
}: ChatMessageBubbleProps): React.JSX.Element {
  const isUser = message.role === 'user';
  const isCurrent = message.personaId === 'current';
  const formattedTime = formatMessageTime(message.timestamp);

  if (isUser) {
    return (
      <div
        className={cn('flex justify-end w-full', className)}
        data-testid={`chat-bubble-user-${message.id}`}
      >
        <div className="max-w-[85%] sm:max-w-[75%] flex flex-col items-end">
          <div className="bg-bg-tertiary text-text-primary border border-border-primary rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>

          {formattedTime && (
            <span className="text-[11px] text-text-tertiary mt-1 pr-1">
              {formattedTime}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Assistant Persona Message
  const accentColorClass = isCurrent ? 'text-accent-current' : 'text-accent-improved';
  const accentDotClass = isCurrent ? 'bg-accent-current' : 'bg-accent-improved';
  const bubbleBgClass = isCurrent
    ? 'bg-current-bg/40 border-current-border'
    : 'bg-improved-bg/40 border-improved-border';

  const defaultSpeakerName = isCurrent
    ? 'Future Self (Current Path)'
    : 'Future Self (Improved Path)';
  const displayName = personaName || defaultSpeakerName;

  return (
    <div
      className={cn('flex justify-start w-full', className)}
      data-testid={`chat-bubble-assistant-${message.id}`}
      aria-live={message.isStreaming ? 'polite' : 'off'}
    >
      <div className="max-w-[85%] sm:max-w-[75%] flex flex-col items-start space-y-1">
        {/* Persona Header Pill */}
        <div className="flex items-center gap-1.5 px-1">
          <span className={cn('w-2 h-2 rounded-full', accentDotClass)} aria-hidden="true" />
          <span className={cn('text-xs font-semibold', accentColorClass)}>
            {displayName}
          </span>
        </div>

        {/* Bubble Body */}
        <div
          className={cn(
            'relative border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm text-text-primary',
            bubbleBgClass
          )}
        >
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
            {message.isStreaming && (
              <span
                data-testid="streaming-indicator"
                className={cn(
                  'inline-block w-1.5 h-4 ml-1 align-middle rounded-sm animate-pulse',
                  accentDotClass
                )}
                aria-label="Thinking and writing..."
              />
            )}
          </div>

          {/* Action Row: Timestamp + Read Aloud (TTS) */}
          <div className="flex items-center justify-between gap-3 pt-2 mt-1 border-t border-border-primary/40 text-[11px] text-text-tertiary">
            <span>{formattedTime}</span>

            {onSpeak && message.content && !message.isStreaming && (
              <button
                type="button"
                onClick={() => onSpeak(message.content)}
                aria-label={isSpeaking ? 'Stop reading' : 'Read message aloud'}
                className="inline-flex items-center gap-1 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-border-focus rounded"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-accent-danger" aria-hidden="true" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Listen</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
