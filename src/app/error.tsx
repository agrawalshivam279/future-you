'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HONESTY_DISCLAIMER } from '@/lib/constants';

export interface RouteErrorProps {
  /** Error instance caught by Next.js App Router boundary */
  error: Error & { digest?: string };
  /** Callback to re-render the failing route segment */
  reset: () => void;
}

/**
 * Next.js App Router route-level error boundary fallback view.
 *
 * @param props - Error and reset handler provided by Next.js
 * @returns JSX Element rendering an accessible recovery card
 */
export default function RouteError({ error, reset }: RouteErrorProps): React.JSX.Element {
  return (
    <div
      role="alert"
      className="flex-1 flex items-center justify-center px-4 py-16 bg-bg-primary text-text-primary"
    >
      <Card className="max-w-md w-full p-8 text-center space-y-5 border-border-primary">
        <div className="w-12 h-12 rounded-full bg-accent-danger/10 text-accent-danger flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-text-primary">
            Unable to Render View
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            {error?.message || 'An unexpected error occurred while loading this page.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="primary"
            onClick={reset}
            leftIcon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
            aria-label="Retry loading page"
            className="w-full sm:w-auto"
          >
            Try Again
          </Button>
          <Link
            href="/"
            aria-label="Return to home page"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border-primary bg-bg-secondary text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors w-full sm:w-auto"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Home</span>
          </Link>
        </div>

        <p className="text-[11px] text-text-tertiary pt-2 border-t border-border-primary/50">
          {HONESTY_DISCLAIMER}
        </p>
      </Card>
    </div>
  );
}
