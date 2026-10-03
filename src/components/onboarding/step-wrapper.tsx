'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface StepWrapperProps {
  stepNumber: number;
  title: string;
  subtitle?: string;
  description: string;
  direction: number;
  children: React.ReactNode;
  className?: string;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1], // snappy ease-out
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

/**
 * Animated step container for the onboarding wizard.
 * Encapsulates the step header, step badge, description, and directional slide transition.
 *
 * @param props - StepWrapper component properties
 * @returns JSX Element rendering the animated step card
 */
export function StepWrapper({
  stepNumber,
  title,
  subtitle,
  description,
  direction,
  children,
  className,
}: StepWrapperProps): React.JSX.Element {
  return (
    <div className={cn('w-full relative overflow-hidden', className)}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={stepNumber}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full"
        >
          <Card className="border-border-primary/80 shadow-md">
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="improved" size="sm">
                  Step {stepNumber} of 6
                </Badge>
                {subtitle && (
                  <span className="text-xs text-text-muted font-mono tracking-wide uppercase">
                    {subtitle}
                  </span>
                )}
              </div>

              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                  {title}
                </CardTitle>
                <CardDescription className="text-sm text-text-secondary mt-1.5 leading-relaxed">
                  {description}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pt-2">{children}</CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
