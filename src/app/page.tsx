'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Settings,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useSettingsStore } from '@/stores/settings-store';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useLifeModelStore } from '@/stores/life-model-store';
import { HONESTY_DISCLAIMER } from '@/lib/constants';
import { AmbientBackground, FeatureHighlights } from '@/components/landing';

/**
 * State-aware HomePage landing view providing the entry point for the Future You reflection experience.
 * Dynamically adapts primary CTAs based on whether the user has completed a simulation, has onboarding
 * in-progress, or is visiting for the first time, while displaying API key status alerts and ambient aesthetics.
 *
 * @returns JSX Element rendering the hero section, status callouts, and feature highlights
 */
export default function HomePage(): React.JSX.Element {
  // Client hydration flag to prevent mismatch with localStorage stores
  const [mounted, setMounted] = useState<boolean>(false);

  const isConfigured = useSettingsStore((state) => state.isConfigured);
  const provider = useSettingsStore((state) => state.provider);
  const model = useLifeModelStore((state) => state.model);
  const onboardingStep = useOnboardingStore((state) => state.currentStep);
  const onboardingName = useOnboardingStore((state) => state.name);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasConfiguredKey = mounted ? isConfigured() : true;
  const hasCompletedModel = mounted ? Boolean(model) : false;
  const hasInProgressOnboarding =
    mounted && !hasCompletedModel && (onboardingStep > 1 || onboardingName.trim().length > 0);

  return (
    <div className="relative flex flex-col flex-1 items-center justify-start overflow-hidden">
      <AmbientBackground />

      <main className="w-full flex-1 flex flex-col items-center justify-start pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {/* API Key Warning / Status Pill */}
        <div className="w-full max-w-xl mx-auto mb-8">
          {!hasConfiguredKey ? (
            <div
              role="alert"
              data-testid="api-key-warning-banner"
              className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                <span>
                  No API key configured for {provider}. Add your key in Settings before generating futures.
                </span>
              </div>
              <Link
                href="/settings"
                aria-label="Configure API Key in Settings"
                className="shrink-0 font-medium underline underline-offset-2 hover:text-amber-100 flex items-center gap-1"
              >
                <span>Settings</span>
              </Link>
            </div>
          ) : (
            <div
              data-testid="api-key-ready-pill"
              className="flex items-center justify-center gap-1.5 text-xs text-text-tertiary"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-improved" aria-hidden="true" />
              <span>AI Provider Configured ({provider})</span>
            </div>
          )}
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          {/* Simulation Status Badge */}
          {hasCompletedModel && (
            <div
              data-testid="simulation-active-badge"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-accent-improved/10 text-accent-improved border border-accent-improved/30"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>5-Year Simulation Active</span>
            </div>
          )}

          {hasInProgressOnboarding && (
            <div
              data-testid="onboarding-progress-badge"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-accent-current/10 text-accent-current border border-accent-current/30"
            >
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Onboarding in Progress (Step {onboardingStep} of 6)</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Meet the person you&apos;re becoming — five years from now.
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-2xl leading-relaxed">
            Explore two simulated futures: one on your current trajectory, and one on your improved
            path. Reflect, converse, and adjust your daily habits to see the difference.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
            {hasCompletedModel ? (
              <>
                <Link
                  href="/dashboard"
                  aria-label="View Your Simulated Futures Dashboard"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-text-primary text-bg-primary font-medium hover:bg-white/90 active:scale-95 transition-all text-base shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span>View Your Futures</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                <Link
                  href="/onboarding"
                  aria-label="Start New Simulation Onboarding"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-border-primary bg-bg-secondary text-text-secondary hover:text-text-primary hover:bg-bg-hover active:scale-95 transition-all text-sm font-medium"
                >
                  <span>New Simulation</span>
                </Link>
              </>
            ) : hasInProgressOnboarding ? (
              <>
                <Link
                  href="/onboarding"
                  aria-label={`Continue Onboarding Step ${onboardingStep}`}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-text-primary text-bg-primary font-medium hover:bg-white/90 active:scale-95 transition-all text-base shadow-sm"
                >
                  <span>Continue Onboarding (Step {onboardingStep})</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                <Link
                  href="/settings"
                  aria-label="Open Settings"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-border-primary bg-bg-secondary text-text-secondary hover:text-text-primary hover:bg-bg-hover active:scale-95 transition-all text-sm font-medium"
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                  <span>Settings</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/onboarding"
                  aria-label="Begin Onboarding Flow"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-text-primary text-bg-primary font-medium hover:bg-white/90 active:scale-95 transition-all text-base shadow-sm"
                >
                  <span>Begin Journey</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                <Link
                  href="/settings"
                  aria-label="Open Settings"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-border-primary bg-bg-secondary text-text-secondary hover:text-text-primary hover:bg-bg-hover active:scale-95 transition-all text-sm font-medium"
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                  <span>Configure Settings</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <FeatureHighlights />

        {/* Honesty Disclaimer */}
        <div className="mt-8 text-center max-w-xl mx-auto px-4">
          <p className="text-xs text-text-tertiary leading-relaxed">
            {HONESTY_DISCLAIMER}. Results are illustrative and based on your self-reported inputs.
          </p>
        </div>
      </main>
    </div>
  );
}
