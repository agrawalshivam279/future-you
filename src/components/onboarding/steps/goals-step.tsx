'use client';

import React from 'react';
import { Sparkles, User, Calendar } from 'lucide-react';
import { useOnboardingStore } from '@/stores';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GoalListBuilder } from './goal-list-builder';
import { cn } from '@/lib/utils';

export interface GoalsStepProps {
  className?: string;
}

const SHORT_TERM_SUGGESTIONS = [
  'Launch side project',
  'Build emergency fund',
  'Read 12 books',
  'Exercise 4x/week',
  'Learn a new framework',
];

const LONG_TERM_SUGGESTIONS = [
  'Lead engineering team',
  'Financial independence',
  'Found a startup',
  'Move to a new city',
  'Master creative craft',
];

/**
 * Step 1 form component capturing foundational user context:
 * name, age, 1-year goals, 5-year aspirations, and dream life narrative.
 *
 * @param props - GoalsStep component properties
 * @returns JSX Element rendering the goals and identity onboarding section
 */
export function GoalsStep({ className }: GoalsStepProps): React.JSX.Element {
  const { name, age, goals, updateBasics, updateGoals } = useOnboardingStore();

  const handleAddShortTerm = (text: string) => {
    if (!goals.shortTerm.includes(text)) {
      updateGoals({ shortTerm: [...goals.shortTerm, text] });
    }
  };

  const handleRemoveShortTerm = (indexToRemove: number) => {
    updateGoals({
      shortTerm: goals.shortTerm.filter((_, idx) => idx !== indexToRemove),
    });
  };

  const handleAddLongTerm = (text: string) => {
    if (!goals.longTerm.includes(text)) {
      updateGoals({ longTerm: [...goals.longTerm, text] });
    }
  };

  const handleRemoveLongTerm = (indexToRemove: number) => {
    updateGoals({
      longTerm: goals.longTerm.filter((_, idx) => idx !== indexToRemove),
    });
  };

  return (
    <div className={cn('space-y-8 text-left', className)}>
      {/* Identity & Demographics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            id="onboarding-name"
            label="What should your future selves call you?"
            placeholder="e.g. Alex, Maya"
            value={name}
            onChange={(e) => updateBasics(e.target.value, age)}
            leftIcon={<User className="w-4 h-4 text-text-muted" aria-hidden="true" />}
            helperText="Used by your future selves to address you in conversation."
            aria-label="Your preferred name or callsign"
          />
        </div>

        <div>
          <Input
            id="onboarding-age"
            type="number"
            min={16}
            max={100}
            label="Current Age"
            value={age || ''}
            onChange={(e) =>
              updateBasics(name, Math.max(16, Math.min(100, Number(e.target.value) || 18)))
            }
            leftIcon={<Calendar className="w-4 h-4 text-text-muted" aria-hidden="true" />}
            helperText="Anchors the 5-year simulation."
            aria-label="Your current age"
          />
        </div>
      </div>

      <div className="border-t border-border-primary/50" />

      {/* Short-Term Goals (1-Year Horizon) */}
      <GoalListBuilder
        id="short-term-input"
        label="Short-term Goals (Next 12 Months)"
        description="What concrete milestones or achievements are you targeting in the coming year?"
        placeholder="e.g. Build $10,000 emergency fund"
        goals={goals.shortTerm}
        suggestions={SHORT_TERM_SUGGESTIONS}
        badgeVariant="neutral"
        onAddGoal={handleAddShortTerm}
        onRemoveGoal={handleRemoveShortTerm}
        inputAriaLabel="Add short-term goal"
        buttonAriaLabel="Add short term goal to list"
        removeAriaLabelPrefix="Remove short-term goal"
      />

      <div className="border-t border-border-primary/50" />

      {/* Long-Term Aspirations (5-Year Horizon) */}
      <GoalListBuilder
        id="long-term-input"
        label="Long-term Aspirations (5 Years Out)"
        description="Where do you hope to see your career, relationships, and craft half a decade from now?"
        placeholder="e.g. Lead a product design team"
        goals={goals.longTerm}
        suggestions={LONG_TERM_SUGGESTIONS}
        badgeVariant="improved"
        onAddGoal={handleAddLongTerm}
        onRemoveGoal={handleRemoveLongTerm}
        inputAriaLabel="Add long-term goal"
        buttonAriaLabel="Add long term goal to list"
        removeAriaLabelPrefix="Remove long-term goal"
      />

      <div className="border-t border-border-primary/50" />

      {/* Dream Life Narrative */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-improved" aria-hidden="true" />
          <label
            htmlFor="onboarding-dream-life"
            className="block text-sm font-semibold text-text-primary"
          >
            Your Dream Life Vision
          </label>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          Describe an ideal day 5 years from now in vivid sensory detail: what do you wake up
          looking forward to? What kind of work do you do? How does your space and state of mind
          feel?
        </p>

        <Textarea
          id="onboarding-dream-life"
          rows={4}
          placeholder="I wake up early without an alarm in a sunlit apartment. My morning starts with a quiet espresso and writing. By 10 AM, I am working with creative autonomy on high-impact projects..."
          value={goals.dreamLife}
          onChange={(e) => updateGoals({ dreamLife: e.target.value })}
          aria-label="Description of your ideal dream life 5 years from now"
        />
      </div>
    </div>
  );
}
