import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { PersonaId } from '@/types/persona.types';
import { cn } from '@/lib/utils';

export interface ChatHeaderProps {
  /** Active persona trajectory identifier */
  activePersona: PersonaId;
  /** Callback invoked when switching between personas */
  onSelectPersona: (personaId: PersonaId) => void;
  /** Persona display name */
  personaName: string;
  /** Callback to clear conversation history */
  onClearChat?: () => void;
  /** Callback to navigate back to dashboard */
  onBackClick?: () => void;
  /** Optional custom CSS classes */
  className?: string;
}

/**
 * ChatHeader renders the navigation and active persona switching controls
 * for the chat interface, including back buttons, tab toggles, and clear actions.
 *
 * @param props - Component properties
 * @returns JSX Element rendering the chat header
 */
export function ChatHeader({
  activePersona,
  onSelectPersona,
  personaName,
  onClearChat,
  onBackClick,
  className,
}: ChatHeaderProps): React.JSX.Element {
  const isCurrent = activePersona === 'current';

  return (
    <header
      className={cn(
        'bg-bg-secondary/80 backdrop-blur-md border-b border-border-primary px-4 py-3 sticky top-0 z-10',
        'flex items-center justify-between gap-3 shadow-xs',
        className
      )}
      data-testid="chat-header"
    >
      {/* Left Column: Navigation & Title */}
      <div className="flex items-center gap-3 min-w-0">
        {onBackClick && (
          <button
            type="button"
            onClick={onBackClick}
            aria-label="Back to dashboard"
            data-testid="chat-back-btn"
            className="p-1.5 -ml-1 text-text-muted hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-border-focus flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs font-medium hidden sm:inline">Dashboard</span>
          </button>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-semibold text-text-primary truncate">
              {personaName}
            </h1>
            <span
              data-testid="persona-badge"
              className={cn(
                'text-[10px] font-medium px-2 py-0.5 rounded-full border',
                isCurrent
                  ? 'bg-current-bg/50 border-current-border text-accent-current'
                  : 'bg-improved-bg/50 border-improved-border text-accent-improved'
              )}
            >
              {isCurrent ? 'Current Path' : 'Improved Path'}
            </span>
          </div>
        </div>
      </div>

      {/* Center/Right Controls: Persona Switcher Tabs & Clear Action */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Persona Switcher Tabs */}
        <div
          role="tablist"
          aria-label="Persona switcher"
          className="flex items-center bg-bg-tertiary p-1 rounded-xl border border-border-primary"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activePersona === 'current'}
            onClick={() => onSelectPersona('current')}
            data-testid="persona-tab-current"
            aria-label="Switch to Current Path persona"
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              activePersona === 'current'
                ? 'bg-accent-current/15 text-accent-current border border-accent-current/30 shadow-xs'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            Current Path
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activePersona === 'improved'}
            onClick={() => onSelectPersona('improved')}
            data-testid="persona-tab-improved"
            aria-label="Switch to Improved Path persona"
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              activePersona === 'improved'
                ? 'bg-accent-improved/15 text-accent-improved border border-accent-improved/30 shadow-xs'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            Improved Path
          </button>
        </div>

        {/* Clear Chat Button */}
        {onClearChat && (
          <button
            type="button"
            onClick={onClearChat}
            aria-label="Clear chat history"
            data-testid="chat-clear-btn"
            className="p-1.5 text-text-muted hover:text-accent-danger hover:bg-bg-tertiary rounded-lg transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-border-focus flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs hidden md:inline">Clear</span>
          </button>
        )}
      </div>
    </header>
  );
}
