'use client';

import * as React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HONESTY_DISCLAIMER } from '@/lib/constants';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Callback triggered when user clicks View Full Disclaimer button */
  onOpenDisclaimer?: () => void;
}

/**
 * Persistent application footer for Future You.
 * Enforces the mandatory honesty disclaimer across every view and highlights client-side privacy.
 */
export function Footer({
  className,
  onOpenDisclaimer,
  ...props
}: FooterProps) {
  return (
    <footer
      role="contentinfo"
      className={cn(
        'w-full border-t border-border-primary bg-bg-secondary/40 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-text-tertiary select-none transition-colors',
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row sm:text-left">
        {/* Persistent Honesty Disclaimer */}
        <div className="max-w-xl space-y-1">
          <p className="text-text-secondary leading-relaxed font-normal">
            {HONESTY_DISCLAIMER}
          </p>
          <p className="text-[11px] text-text-muted flex items-center justify-center sm:justify-start gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-accent-success" aria-hidden="true" />
            <span>Zero cloud storage. All inputs and personas remain strictly inside your browser.</span>
          </p>
        </div>

        {/* Footer Actions / Links */}
        <div className="flex items-center space-x-4 shrink-0">
          {onOpenDisclaimer && (
            <button
              type="button"
              onClick={onOpenDisclaimer}
              className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-info rounded"
              aria-label="Read full reflection disclaimer"
            >
              <Info className="h-3 w-3" aria-hidden="true" />
              <span>Full Disclaimer</span>
            </button>
          )}
          <span className="text-[11px] text-text-muted">
            &copy; {new Date().getFullYear()} Future You
          </span>
        </div>
      </div>
    </footer>
  );
}
