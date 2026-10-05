'use client';

import * as React from 'react';
import Link from 'next/link';
import { Settings, ShieldAlert, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Optional title override */
  title?: string;
  /** Whether to show navigation shortcuts */
  showNav?: boolean;
  /** Callback triggered when user clicks Disclaimer button */
  onOpenDisclaimer?: () => void;
}

/**
 * Top navigation header for Future You.
 * Features brand logo, disclaimer trigger, and settings shortcut.
 */
export function Header({
  className,
  title,
  showNav = true,
  onOpenDisclaimer,
  ...props
}: HeaderProps) {
  return (
    <header
      role="banner"
      className={cn(
        'sticky top-0 z-30 w-full border-b border-border-primary bg-bg-primary/80 backdrop-blur-md transition-colors',
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="flex items-center space-x-2 text-text-primary hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-info rounded-md"
            aria-label={`${APP_NAME} Home`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-secondary border border-border-primary font-mono text-sm font-bold text-accent-info">
              FY
            </span>
            <span className="font-semibold tracking-tight text-lg">
              {title || APP_NAME}
            </span>
          </Link>
        </div>

        {/* Navigation shortcuts */}
        {showNav && (
          <nav aria-label="Main Navigation" className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/check-in"
              className="text-xs text-text-secondary hover:text-text-primary px-2.5 py-1.5 rounded-md hover:bg-bg-hover transition-colors flex items-center space-x-1.5"
              aria-label="Trajectory Check-in"
            >
              <Activity className="h-3.5 w-3.5 text-accent-improved" aria-hidden="true" />
              <span className="hidden sm:inline">Check-in</span>
            </Link>

            {onOpenDisclaimer && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenDisclaimer}
                className="text-xs text-text-secondary hover:text-text-primary flex items-center space-x-1.5"
                aria-label="View reflection disclaimer"
              >
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Disclaimer</span>
              </Button>
            )}

            <Link
              href="/settings"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-info"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
