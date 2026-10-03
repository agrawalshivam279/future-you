'use client';

import React from 'react';
import { GraduationCap, Sparkles, Briefcase, Smile, TrendingUp } from 'lucide-react';
import { useOnboardingStore } from '@/stores';
import { GoalListBuilder } from './goal-list-builder';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export interface SkillsStepProps {
  className?: string;
}

const CURRENT_SKILL_SUGGESTIONS = [
  'Software Architecture',
  'Product Design & UI',
  'Data & Analytics',
  'Team Leadership',
  'Writing & Storytelling',
  'Financial Analysis',
  'Critical Thinking',
];

const LEARNING_GOAL_SUGGESTIONS = [
  'Artificial Intelligence / ML',
  'System Design & Scaling',
  'Executive Presence & Speaking',
  'Venture Building & Sales',
  'Spanish / Language Fluency',
  'Deep Focus & Flow Discipline',
];

const CAREER_FIELD_SUGGESTIONS = [
  'Software & Engineering',
  'Design & Creative Arts',
  'Business & Finance',
  'Healthcare & Medicine',
  'Education & Research',
  'Entrepreneurship',
];

/**
 * Step 5 form component capturing current skills, target learning goals,
 * primary career domain, satisfaction score, and growth mindset self-rating.
 *
 * @param props - SkillsStep component properties
 * @returns JSX Element rendering the skills and learning step
 */
export function SkillsStep({ className }: SkillsStepProps): React.JSX.Element {
  const { skills, updateSkills } = useOnboardingStore();

  const handleAddCurrentSkill = (skill: string) => {
    if (!skills.currentSkills.includes(skill)) {
      updateSkills({ currentSkills: [...skills.currentSkills, skill] });
    }
  };

  const handleRemoveCurrentSkill = (index: number) => {
    updateSkills({
      currentSkills: skills.currentSkills.filter((_, i) => i !== index),
    });
  };

  const handleAddLearningGoal = (goal: string) => {
    if (!skills.learningGoals.includes(goal)) {
      updateSkills({ learningGoals: [...skills.learningGoals, goal] });
    }
  };

  const handleRemoveLearningGoal = (index: number) => {
    updateSkills({
      learningGoals: skills.learningGoals.filter((_, i) => i !== index),
    });
  };

  const getSatisfactionNote = (rating: number) => {
    if (rating >= 9) return 'Peak flow, mastery, and purpose-driven engagement';
    if (rating >= 7) return 'High fulfillment and strong professional momentum';
    if (rating >= 4) return 'Moderate stability, seeking greater meaning or autonomy';
    return 'Significant burnout or career misalignment';
  };

  const getMindsetNote = (rating: number) => {
    if (rating >= 9) return 'Relentless experimental resilience and mastery orientation';
    if (rating >= 7) return 'Strong belief in neuroplasticity and rapid failure learning';
    if (rating >= 4) return 'Cautiously open to challenge with gradual adaptability';
    return 'Tendency toward fixed ability beliefs and risk aversion';
  };

  return (
    <div className={cn('space-y-8 text-left', className)}>
      {/* 1. Current Strengths & Skills */}
      <GoalListBuilder
        id="current-skills-input"
        label="Key Current Strengths & Capabilities"
        description="The tools, proficiencies, and domain strengths you currently rely on."
        placeholder="e.g. Fullstack React, Product Strategy, Public Speaking"
        goals={skills.currentSkills}
        suggestions={CURRENT_SKILL_SUGGESTIONS}
        badgeVariant="improved"
        onAddGoal={handleAddCurrentSkill}
        onRemoveGoal={handleRemoveCurrentSkill}
        inputAriaLabel="Add a current skill or core strength"
        buttonAriaLabel="Add current strength"
        removeAriaLabelPrefix="Remove strength"
      />

      <div className="border-t border-border-primary/50" />

      {/* 2. Target Learning Goals */}
      <GoalListBuilder
        id="learning-goals-input"
        label="Target Capabilities & Learning Goals"
        description="What skills or crafts do you want your 5-year future self to have mastered?"
        placeholder="e.g. Deep Learning Systems, Venture Financing, Conversational Spanish"
        goals={skills.learningGoals}
        suggestions={LEARNING_GOAL_SUGGESTIONS}
        badgeVariant="neutral"
        onAddGoal={handleAddLearningGoal}
        onRemoveGoal={handleRemoveLearningGoal}
        inputAriaLabel="Add a learning goal or target skill"
        buttonAriaLabel="Add learning goal"
        removeAriaLabelPrefix="Remove learning goal"
      />

      <div className="border-t border-border-primary/50" />

      {/* 3. Primary Career Field */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-accent-info" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-text-primary">Primary Professional Field</h4>
        </div>
        <p className="text-xs text-text-secondary">
          Your overarching career domain, industry, or discipline.
        </p>

        <Input
          id="career-field-input"
          label="Career Domain or Industry"
          placeholder="e.g. Applied AI Engineering & SaaS"
          value={skills.careerField}
          onChange={(e) => updateSkills({ careerField: e.target.value })}
          aria-label="Primary professional field or discipline"
        />

        {/* Suggestion Chips */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-medium text-text-muted">Common fields:</span>
          <div className="flex flex-wrap gap-1.5">
            {CAREER_FIELD_SUGGESTIONS.map((field) => (
              <button
                key={field}
                type="button"
                onClick={() => updateSkills({ careerField: field })}
                className="text-xs px-2.5 py-1 rounded-lg border border-border-primary/60 bg-bg-tertiary/60 text-text-secondary hover:text-text-primary hover:border-accent-improved/50 transition-colors duration-150"
              >
                + {field}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border-primary/50" />

      {/* 4. Career Satisfaction Slider */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Smile className="w-4 h-4 text-accent-improved" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-text-primary">Current Career Satisfaction (1–10)</h4>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <p className="text-xs text-text-secondary">
            How fulfilled and engaged do you feel with your work day-to-day?
          </p>
          <span className="text-[11px] font-mono text-accent-improved font-medium">
            {getSatisfactionNote(skills.careerSatisfaction)}
          </span>
        </div>
        <Slider
          id="career-satisfaction-slider"
          min={1}
          max={10}
          step={1}
          unit="/ 10"
          value={skills.careerSatisfaction}
          onChange={(val) => updateSkills({ careerSatisfaction: val })}
          aria-label="Current career satisfaction rating from 1 to 10"
          variant="improved"
          className="pt-2"
        />
      </div>

      <div className="border-t border-border-primary/50" />

      {/* 5. Growth Mindset Self-Rating Slider */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent-improved" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-text-primary">Growth Mindset Orientation (1–10)</h4>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <p className="text-xs text-text-secondary">
            To what degree do you believe skills are acquired through deliberate effort vs. innate talent?
          </p>
          <span className="text-[11px] font-mono text-accent-improved font-medium">
            {getMindsetNote(skills.growthMindset)}
          </span>
        </div>
        <Slider
          id="growth-mindset-slider"
          min={1}
          max={10}
          step={1}
          unit="/ 10"
          value={skills.growthMindset}
          onChange={(val) => updateSkills({ growthMindset: val })}
          aria-label="Growth mindset orientation rating from 1 to 10"
          variant="improved"
          className="pt-2"
        />
      </div>
    </div>
  );
}
