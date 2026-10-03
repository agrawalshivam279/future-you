'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge, BadgeVariant } from '@/components/ui/badge';

export interface GoalListBuilderProps {
  id: string;
  label: string;
  description: string;
  placeholder: string;
  goals: string[];
  suggestions: string[];
  badgeVariant?: BadgeVariant;
  onAddGoal: (goal: string) => void;
  onRemoveGoal: (index: number) => void;
  inputAriaLabel: string;
  buttonAriaLabel: string;
  removeAriaLabelPrefix: string;
}

/**
 * Reusable goal and aspiration list builder supporting quick addition,
 * suggestion chips, and removable badges.
 *
 * @param props - GoalListBuilder component properties
 * @returns JSX Element rendering interactive goal manager
 */
export function GoalListBuilder({
  id,
  label,
  description,
  placeholder,
  goals,
  suggestions,
  badgeVariant = 'neutral',
  onAddGoal,
  onRemoveGoal,
  inputAriaLabel,
  buttonAriaLabel,
  removeAriaLabelPrefix,
}: GoalListBuilderProps): React.JSX.Element {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (text?: string) => {
    const goalText = (text || inputValue).trim();
    if (!goalText) return;
    onAddGoal(goalText);
    setInputValue('');
  };

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={id} className="block text-sm font-semibold text-text-primary">
          {label}
        </label>
        <p className="text-xs text-text-secondary mt-0.5">{description}</p>
      </div>

      <div className="flex gap-2">
        <Input
          id={id}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          aria-label={inputAriaLabel}
          className="flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleAdd()}
          aria-label={buttonAriaLabel}
          leftIcon={<Plus className="w-4 h-4" aria-hidden="true" />}
        >
          Add
        </Button>
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] text-text-muted mr-1">Suggestions:</span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleAdd(suggestion)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-bg-tertiary border border-border-primary/60 text-text-secondary hover:text-text-primary hover:border-border-primary transition-colors"
            aria-label={`Add suggested ${label.toLowerCase()}: ${suggestion}`}
          >
            + {suggestion}
          </button>
        ))}
      </div>

      {/* Selected Goals */}
      {goals.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {goals.map((goal, index) => (
            <Badge
              key={`${goal}-${index}`}
              variant={badgeVariant}
              size="md"
              className="flex items-center gap-1.5 py-1 px-3"
            >
              <span>{goal}</span>
              <button
                type="button"
                onClick={() => onRemoveGoal(index)}
                aria-label={`${removeAriaLabelPrefix}: ${goal}`}
                className="p-0.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
