'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Ambient background layer providing subtle, warm and contemplative glow effects.
 * Automatically disables continuous motion animations if prefers-reduced-motion is enabled.
 */
export function AmbientBackground(): React.JSX.Element {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      data-testid="ambient-background"
      className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
    >
      {/* Current trajectory soft warm glow (amber/rose) */}
      <motion.div
        animate={
          shouldReduceMotion
            ? { opacity: 0.25 }
            : {
                opacity: [0.2, 0.35, 0.2],
                scale: [1, 1.08, 1],
                x: ['-5%', '3%', '-5%'],
                y: ['-5%', '5%', '-5%'],
              }
        }
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 -left-20 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-accent-current/15 via-rose-500/10 to-transparent blur-3xl"
      />

      {/* Improved trajectory soft cool glow (emerald/cyan) */}
      <motion.div
        animate={
          shouldReduceMotion
            ? { opacity: 0.3 }
            : {
                opacity: [0.25, 0.4, 0.25],
                scale: [1, 1.1, 1],
                x: ['5%', '-4%', '5%'],
                y: ['5%', '-3%', '5%'],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-1/3 -right-20 w-[460px] h-[460px] rounded-full bg-gradient-to-bl from-accent-improved/20 via-emerald-600/10 to-transparent blur-3xl"
      />

      {/* Subtle central depth highlight */}
      <div className="absolute inset-0 bg-radial-gradient from-bg-primary/0 via-bg-primary/40 to-bg-primary" />
    </div>
  );
}
