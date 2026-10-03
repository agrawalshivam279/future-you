'use client';

/**
 * GenerationErrorCard Component.
 * Accessible error presentation card offering clear diagnostic guidance and
 * actionable recovery options (retry, return to onboarding, check settings).
 */

import React from 'react';
import { Button } from '@/components/ui/button';

export interface GenerationErrorCardProps {
  /** Error description string */
  error: string;
  /** Callback fired when user triggers retry */
  onRetry: () => void;
  /** Callback fired when user chooses to edit onboarding inputs */
  onBackToOnboarding: () => void;
  /** Optional loading flag while retry is in flight */
  isRetrying?: boolean;
  /** Optional custom container classes */
  className?: string;
}

/**
 * Renders an accessible error state with recovery actions.
 */
export function GenerationErrorCard({
  error,
  onRetry,
  onBackToOnboarding,
  isRetrying = false,
  className = '',
}: GenerationErrorCardProps): React.JSX.Element {
  const isApiKeyIssue =
    error.toLowerCase().includes('api key') ||
    error.toLowerCase().includes('unauthorized') ||
    error.toLowerCase().includes('not configured');

  return (
    <div
      role="alert"
      aria-live="assertive"
      data-testid="generation-error-card"
      className={`w-full max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-neutral-900/90 border border-red-500/30 backdrop-blur-md space-y-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="flex-1 space-y-1">
          <h2 className="text-lg font-semibold text-white">Generation Paused</h2>
          <p className="text-sm text-neutral-300 leading-relaxed" data-testid="error-message">
            {error || 'An unexpected error occurred while projecting your future models.'}
          </p>
        </div>
      </div>

      {isApiKeyIssue && (
        <div className="p-3.5 rounded-xl bg-neutral-800/80 border border-neutral-700/60 text-xs text-neutral-300 space-y-1">
          <p className="font-semibold text-neutral-200">API Configuration Tip:</p>
          <p>
            Future You runs entirely client-side. Make sure your API key and provider settings in
            the Settings page are valid and have active quota.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onBackToOnboarding}
          disabled={isRetrying}
          aria-label="Return to onboarding wizard"
          className="w-full sm:w-auto"
        >
          Edit Onboarding
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onRetry}
          isLoading={isRetrying}
          disabled={isRetrying}
          aria-label="Retry generation"
          className="w-full sm:w-auto"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
