'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, AlertCircle, ChevronDown, Sparkles } from 'lucide-react';

export interface ReflectionItemCardProps {
  /** Reflection statement text */
  text: string;
  /** Reflection classification: 'regret' vs 'gratitude' */
  type: 'regret' | 'gratitude';
  /** Animation stagger index */
  index?: number;
  /** Optional container className */
  className?: string;
}

/**
 * Interactive card displaying an individual future-self regret or gratitude,
 * featuring expandable details, accessible keyboard controls, and motion reveal.
 */
export function ReflectionItemCard({
  text,
  type,
  index = 0,
  className = '',
}: ReflectionItemCardProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  const isRegret = type === 'regret';

  const typeConfig = isRegret
    ? {
        label: 'Regret',
        accentBg: 'bg-accent-danger/5 hover:bg-accent-danger/10',
        accentBorder: 'border-accent-danger/20 hover:border-accent-danger/40',
        badgeBg: 'bg-accent-danger/10 text-accent-danger border-accent-danger/30',
        icon: <AlertCircle className="w-4 h-4 text-accent-danger shrink-0" aria-hidden="true" />,
        hint: 'Friction or missed opportunity along this trajectory',
      }
    : {
        label: 'Gratitude',
        accentBg: 'bg-accent-improved/5 hover:bg-accent-improved/10',
        accentBorder: 'border-accent-improved/20 hover:border-accent-improved/40',
        badgeBg: 'bg-accent-improved/10 text-accent-improved border-accent-improved/30',
        icon: <Heart className="w-4 h-4 text-accent-improved shrink-0" aria-hidden="true" />,
        hint: 'Compounded habit or decision this future self is thankful for',
      };

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.4) }}
      className={`rounded-xl border transition-all duration-200 ${typeConfig.accentBorder} ${typeConfig.accentBg} ${className}`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-label={`${typeConfig.label}: ${text}`}
        className="w-full text-left p-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded-xl select-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5">{typeConfig.icon}</span>
            <div className="space-y-1">
              <span
                className={`inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${typeConfig.badgeBg}`}
              >
                {typeConfig.label}
              </span>
              <p className="text-sm font-medium text-text-primary leading-snug">
                {text}
              </p>
            </div>
          </div>

          <div
            className={`p-1 rounded-md text-text-tertiary transition-transform duration-200 shrink-0 ${
              isExpanded ? 'rotate-180 text-text-primary' : ''
            }`}
            aria-hidden="true"
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Expandable Context & Reflection Detail */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-3 mt-3 border-t border-border-primary/40 text-xs text-text-secondary space-y-1.5"
            >
              <div className="flex items-center gap-1.5 font-medium text-text-primary">
                <Sparkles className="w-3.5 h-3.5 text-accent-info" aria-hidden="true" />
                <span>Psychological Insight</span>
              </div>
              <p className="leading-relaxed">
                {typeConfig.hint}. Small pivots made today reshape whether this reflection manifests in 5 years.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
