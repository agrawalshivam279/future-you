'use client';

/**
 * ReflectiveQuoteTicker Component.
 * Cycles contemplative prompts and philosophical reflections while the AI simulation runs,
 * reinforcing that Future You is an introspective mirror rather than a predictive certainty.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface ReflectiveQuoteTickerProps {
  /** Rotation duration per quote in milliseconds (default: 6500) */
  intervalMs?: number;
  /** Optional custom styling classes */
  className?: string;
}

const REFLECTIVE_QUOTES: string[] = [
  '“Your future self is not a stranger; they are the compounded echo of today’s choices.”',
  '“We do not forecast an immutable destiny; we illuminate where present inertia leads.”',
  '“Small daily habits do not dramatically alter tomorrow; they transform five years from now.”',
  '“Inertia is the invisible sculptor of decades. Reflection is the chisel.”',
  '“Look at both paths not with judgment, but as an honest reckoning of compound momentum.”',
];

/**
 * Animated contemplative quote rotator for the loading experience.
 */
export function ReflectiveQuoteTicker({
  intervalMs = 6500,
  className = '',
}: ReflectiveQuoteTickerProps): React.JSX.Element {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % REFLECTIVE_QUOTES.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      data-testid="reflective-quote-ticker"
      className={`w-full max-w-lg mx-auto text-center px-4 py-3 min-h-[4rem] flex items-center justify-center ${className}`}
    >
      <motion.p
        key={index}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-xs sm:text-sm italic text-neutral-400 font-serif leading-relaxed"
      >
        {REFLECTIVE_QUOTES[index]}
      </motion.p>
    </div>
  );
}
