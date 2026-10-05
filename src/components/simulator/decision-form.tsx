'use client';

import React, { useState } from 'react';
import { Sparkles, RotateCcw, Compass, ArrowRight } from 'lucide-react';
import { Button, Input, Textarea, Card, Badge } from '@/components/ui';
import {
  DecisionScenario,
  DecisionDomain,
  TimeHorizon,
  DecisionPreset,
} from '@/types';
import { DECISION_PRESETS } from '@/stores/decision-store';
import { cn } from '@/lib/utils';

export interface DecisionFormProps {
  /** Callback triggered when a decision scenario is submitted for simulation */
  onSubmit?: (scenario: Omit<DecisionScenario, 'id' | 'createdAt'>) => void;
  /** Transient flag indicating AI projection is currently running */
  isLoading?: boolean;
  /** Optional custom CSS classes for the container card */
  className?: string;
}

interface DomainOption {
  value: DecisionDomain;
  label: string;
}

const DOMAIN_OPTIONS: DomainOption[] = [
  { value: 'career', label: 'Career' },
  { value: 'finances', label: 'Finances' },
  { value: 'health', label: 'Health' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'lifestyle', label: 'Lifestyle' },
];

interface HorizonOption {
  value: TimeHorizon;
  label: string;
  hint: string;
}

const HORIZON_OPTIONS: HorizonOption[] = [
  { value: 'immediate', label: 'Immediate', hint: '< 1 month' },
  { value: '6months', label: 'Medium', hint: '3–6 months' },
  { value: '1year', label: 'Long-term', hint: '1 year+' },
];

/**
 * Interactive authoring form for projecting custom life decisions or selecting curated presets.
 */
export function DecisionForm({
  onSubmit,
  isLoading = false,
  className,
}: DecisionFormProps): React.JSX.Element {
  const [title, setTitle] = useState('');
  const [primaryDomain, setPrimaryDomain] = useState<DecisionDomain>('career');
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('immediate');
  const [description, setDescription] = useState('');
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const isValid = title.trim().length >= 3 && description.trim().length >= 10;

  const handleApplyPreset = (preset: DecisionPreset) => {
    setTitle(preset.title);
    setPrimaryDomain(preset.primaryDomain);
    setTimeHorizon(preset.timeHorizon);
    setDescription(preset.description);
    setActivePresetId(preset.id);
  };

  const handleClear = () => {
    setTitle('');
    setPrimaryDomain('career');
    setTimeHorizon('immediate');
    setDescription('');
    setActivePresetId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;

    onSubmit?.({
      title: title.trim(),
      primaryDomain,
      timeHorizon,
      description: description.trim(),
    });
  };

  return (
    <Card className={cn('p-6 md:p-8 space-y-8 bg-bg-secondary border-border-primary', className)}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="neutral" className="gap-1.5 py-1 px-2.5">
            <Compass className="w-3.5 h-3.5 text-accent-improved" />
            Decision Simulator
          </Badge>
          <span className="text-xs text-text-tertiary">Version 3 Fork Engine</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
          Simulate a Life Decision
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Explore how a major fork (career pivot, relocation, or commitment) compounds over 1, 3, and 5 years.
        </p>
      </div>

      {/* Preset Templates */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Quick Exploration Templates
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {DECISION_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                aria-pressed={isSelected}
                aria-label={`Apply preset: ${preset.title}`}
                className={cn(
                  'text-left p-3 rounded-lg border text-xs transition-all',
                  isSelected
                    ? 'border-accent-improved bg-accent-improved/10 text-text-primary'
                    : 'border-border-primary bg-bg-tertiary/50 hover:bg-bg-tertiary text-text-secondary hover:text-text-primary'
                )}
              >
                <div className="font-medium text-text-primary mb-1 line-clamp-1">{preset.title}</div>
                <div className="text-[11px] text-text-tertiary line-clamp-2 leading-relaxed">
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <Input
          label="Decision Title"
          id="decision-title"
          placeholder="e.g. Leaving corporate job to start an independent studio"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setActivePresetId(null);
          }}
          disabled={isLoading}
          helperText="Give your fork a clear, concise name (min 3 characters)."
          required
        />

        {/* Primary Domain Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            Primary Impact Domain
          </label>
          <div
            role="group"
            aria-label="Primary Impact Domain"
            className="flex flex-wrap gap-2"
          >
            {DOMAIN_OPTIONS.map((domain) => {
              const isSelected = primaryDomain === domain.value;
              return (
                <button
                  key={domain.value}
                  type="button"
                  onClick={() => {
                    setPrimaryDomain(domain.value);
                    setActivePresetId(null);
                  }}
                  aria-pressed={isSelected}
                  aria-label={`Select domain ${domain.label}`}
                  disabled={isLoading}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all',
                    isSelected
                      ? 'bg-text-primary text-bg-primary border-text-primary'
                      : 'bg-bg-tertiary text-text-secondary border-border-primary hover:border-border-focus hover:text-text-primary'
                  )}
                >
                  {domain.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Horizon Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            Implementation Horizon
          </label>
          <div
            role="group"
            aria-label="Implementation Horizon"
            className="grid grid-cols-3 gap-2"
          >
            {HORIZON_OPTIONS.map((horizon) => {
              const isSelected = timeHorizon === horizon.value;
              return (
                <button
                  key={horizon.value}
                  type="button"
                  onClick={() => {
                    setTimeHorizon(horizon.value);
                    setActivePresetId(null);
                  }}
                  aria-pressed={isSelected}
                  aria-label={`Select horizon ${horizon.label}`}
                  disabled={isLoading}
                  className={cn(
                    'py-2 px-3 rounded-lg border text-center transition-all',
                    isSelected
                      ? 'border-accent-improved/50 bg-accent-improved/10 text-accent-improved font-medium'
                      : 'border-border-primary bg-bg-tertiary text-text-secondary hover:text-text-primary'
                  )}
                >
                  <div className="text-xs">{horizon.label}</div>
                  <div className="text-[10px] text-text-tertiary mt-0.5">{horizon.hint}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description Textarea */}
        <Textarea
          label="Context, Risks & Motivation"
          id="decision-description"
          placeholder="What is prompting this decision? What are the biggest risks you fear, and what is the potential upside that excites you?"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setActivePresetId(null);
          }}
          disabled={isLoading}
          rows={4}
          helperText="Explain the context so both future selves can evaluate the psychological and financial realities (min 10 characters)."
          required
        />

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={isLoading || (!title && !description)}
            aria-label="Clear decision form fields"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Clear
          </Button>

          <Button
            type="submit"
            variant="improved"
            size="md"
            disabled={!isValid || isLoading}
            isLoading={isLoading}
            aria-label="Simulate Decision"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Simulate Decision
          </Button>
        </div>
      </form>
    </Card>
  );
}
