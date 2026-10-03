'use client';

/**
 * Generation Flow Page for Future You.
 * Orchestrates multi-step AI synthesis after onboarding, rendering real-time progress,
 * reflective contemplative quotes, resilient error recovery, and automatic redirect to the dashboard.
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useGenerationPipeline } from '@/hooks/use-generation-pipeline';
import {
  GenerationStepper,
  GenerationErrorCard,
  ReflectiveQuoteTicker,
} from '@/components/generation';
import { HONESTY_DISCLAIMER } from '@/lib/constants';

/**
 * Generation route page hosting the live AI synthesis flow.
 *
 * @returns JSX Element rendering the generation flow
 */
export default function GenerationPage(): React.JSX.Element {
  const router = useRouter();
  const getOnboardingData = useOnboardingStore((state) => state.getOnboardingData);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  // Guard: Ensure user has valid onboarding responses before synthesizing
  useEffect(() => {
    const data = getOnboardingData();
    if (!data || !data.name?.trim()) {
      router.replace('/onboarding');
    } else {
      setIsVerifying(false);
    }
  }, [getOnboardingData, router]);

  const { status, progress, error, retry } = useGenerationPipeline({
    autoStart: !isVerifying,
    onComplete: () => {
      router.push('/dashboard');
    },
  });

  const handleBackToOnboarding = () => {
    router.push('/onboarding');
  };

  if (isVerifying) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[60vh] px-4">
        <p className="text-sm font-mono text-neutral-500 animate-pulse">
          Verifying onboarding parameters...
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 flex flex-col justify-center">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-neutral-800 text-neutral-300 border border-neutral-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          AI Trajectory Simulation
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Synthesizing Your Future Trajectories
        </h1>
        <p className="text-sm text-neutral-400">
          Modeling dual 5-year realities based on compounding daily habits and inertia.
        </p>
      </div>

      {/* Primary Generation Flow Container */}
      <div className="space-y-6">
        {status === 'error' && error ? (
          <GenerationErrorCard
            error={error}
            onRetry={retry}
            onBackToOnboarding={handleBackToOnboarding}
          />
        ) : null}

        <GenerationStepper progress={progress} />

        {status !== 'error' && <ReflectiveQuoteTicker />}
      </div>

      {/* Mandatory Honesty Reflection Disclaimer */}
      <footer className="text-center pt-4">
        <p className="text-xs text-neutral-500 max-w-lg mx-auto leading-relaxed">
          {HONESTY_DISCLAIMER}
        </p>
      </footer>
    </main>
  );
}
