import React from 'react';
import { Sparkles } from 'lucide-react';
import { PersonaId } from '@/types/persona.types';
import { cn } from '@/lib/utils';

export interface SuggestedQuestionsProps {
  /** Persona path identifier */
  personaId: PersonaId;
  /** Callback triggered when a question pill is clicked */
  onSelectQuestion: (question: string) => void;
  /** Optional custom CSS classes */
  className?: string;
}

const CURRENT_PATH_QUESTIONS = [
  'What is your biggest daily struggle right now?',
  'Do you ever wish you committed to different habits sooner?',
  'What was the hardest trade-off that wasn’t worth it?',
  'How do you feel about your career trajectory at this point?',
];

const IMPROVED_PATH_QUESTIONS = [
  'Which daily habit created the biggest compound breakthrough?',
  'How did you maintain discipline without experiencing burnout?',
  'What does a typical fulfilling day look like for you?',
  'What advice would you give me for the struggles I face today?',
];

/**
 * SuggestedQuestions renders introspective conversation starter prompts
 * tailored specifically to the psychological worldview of the selected persona.
 *
 * @param props - Component properties
 * @returns JSX Element rendering suggested question chips
 */
export function SuggestedQuestions({
  personaId,
  onSelectQuestion,
  className,
}: SuggestedQuestionsProps): React.JSX.Element {
  const isCurrent = personaId === 'current';
  const questions = isCurrent ? CURRENT_PATH_QUESTIONS : IMPROVED_PATH_QUESTIONS;
  const accentBorder = isCurrent
    ? 'hover:border-accent-current/40 hover:bg-current-bg/20'
    : 'hover:border-accent-improved/40 hover:bg-improved-bg/20';

  return (
    <div
      className={cn('space-y-2.5', className)}
      data-testid="suggested-questions"
      aria-label="Suggested conversation questions"
    >
      <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Conversation Starters</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {questions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onSelectQuestion(question)}
            aria-label={`Ask: "${question}"`}
            className={cn(
              'text-xs text-left px-3 py-1.5 rounded-lg border border-border-primary bg-bg-secondary text-text-secondary',
              'transition-colors duration-150 active:scale-[0.98] cursor-pointer outline-none',
              'focus-visible:ring-2 focus-visible:ring-border-focus',
              accentBorder
            )}
          >
            &ldquo;{question}&rdquo;
          </button>
        ))}
      </div>
    </div>
  );
}
