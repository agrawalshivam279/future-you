import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

/**
 * ChatInput renders an accessible message entry textarea supporting
 * Enter-to-send (Shift+Enter for newline) and auto-resizing height.
 *
 * @param props - Component properties
 * @returns JSX Element rendering the chat input box
 */
export function ChatInput({
  onSendMessage,
  isLoading = false,
  placeholder = 'Ask your future self anything...',
  className,
}: ChatInputProps): React.JSX.Element {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height to fit content (up to 160px)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [text]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    onSendMessage(trimmed);
    setText('');

    // Reset height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isSendDisabled = !text.trim() || isLoading;

  return (
    <div
      className={cn(
        'relative bg-bg-secondary border border-border-primary rounded-xl p-2.5 flex items-end gap-2 shadow-md transition-colors',
        'focus-within:border-border-focus focus-within:ring-1 focus-within:ring-border-focus',
        className
      )}
      data-testid="chat-input-container"
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        rows={1}
        aria-label="Your message to your future self"
        data-testid="chat-textarea"
        className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none resize-none py-1.5 px-2 max-h-40 min-h-[38px] leading-relaxed disabled:opacity-50"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSendDisabled}
        aria-label="Send message"
        data-testid="chat-send-btn"
        className={cn(
          'p-2 rounded-lg transition-all flex-shrink-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          isSendDisabled
            ? 'opacity-40 cursor-not-allowed text-text-muted'
            : 'bg-text-primary text-bg-primary hover:bg-white active:scale-95 shadow-sm'
        )}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="w-4 h-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
