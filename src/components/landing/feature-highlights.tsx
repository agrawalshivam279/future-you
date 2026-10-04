'use client';

import React from 'react';
import { GitFork, Sliders, Volume2, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ElementType;
  accent: 'current' | 'improved' | 'primary';
}

const FEATURES: FeatureItem[] = [
  {
    title: 'Two Simulated Futures',
    description:
      'Contrast your Current Path against an Improved Path across 1, 3, and 5-year milestones with detailed career, financial, and emotional projections.',
    icon: GitFork,
    accent: 'current',
  },
  {
    title: 'Compounding Habit Levers',
    description:
      'Dynamically adjust sleep, screen time, exercise, and focus hours to experience how subtle daily shifts alter your long-term life trajectory.',
    icon: Sliders,
    accent: 'improved',
  },
  {
    title: 'Letters & Voice Narration',
    description:
      'Receive intimate, reflective letters from your 5-year future selves with real-time text-to-speech audio narration using your browser Web Speech API.',
    icon: Volume2,
    accent: 'primary',
  },
  {
    title: '100% Private & Local-First',
    description:
      'Zero remote databases. Your goals, habits, reflections, and API keys are stored exclusively in your browser localStorage and IndexedDB.',
    icon: ShieldCheck,
    accent: 'improved',
  },
];

/**
 * Feature highlights grid presenting the four core pillars of the Future You experience.
 */
export function FeatureHighlights(): React.JSX.Element {
  return (
    <section
      aria-label="Core Capabilities"
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12"
    >
      <div className="text-center mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          Designed for contemplation, not prediction.
        </h2>
        <p className="text-sm text-text-secondary mt-2 max-w-xl mx-auto">
          Explore realistic possibilities shaped by the compounding choices of your everyday life.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          const badgeClass =
            feature.accent === 'current'
              ? 'bg-accent-current/10 text-accent-current border-accent-current/30'
              : feature.accent === 'improved'
              ? 'bg-accent-improved/10 text-accent-improved border-accent-improved/30'
              : 'bg-primary-500/10 text-primary-400 border-primary-500/30';

          return (
            <Card
              key={feature.title}
              className="p-6 transition-all duration-200 hover:border-border-secondary hover:bg-bg-secondary/40"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2.5 rounded-lg border ${badgeClass} shrink-0`}
                  aria-hidden="true"
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
