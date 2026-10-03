import Link from 'next/link';
import React from 'react';
import { ArrowRight, Settings } from 'lucide-react';

/**
 * HomePage landing view providing the entry point for the Future You reflection experience.
 *
 * @returns JSX Element rendering the initial hero section and navigation
 */
export default function HomePage(): React.JSX.Element {
  return (
    <div className="flex flex-col flex-1">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border-primary/50 max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-tight text-text-primary text-lg">Future You</span>
        </div>
        <Link
          href="/settings"
          aria-label="Application Settings"
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
        >
          <Settings className="w-5 h-5" aria-hidden="true" />
        </Link>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary mb-6">
          Meet the person you&apos;re becoming — five years from now.
        </h1>

        <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-xl leading-relaxed">
          Explore two simulated futures: one on your current trajectory, and one on your improved path.
          Reflect, converse, and adjust your daily habits to see the difference.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/onboarding"
            aria-label="Begin Onboarding Flow"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-text-primary text-bg-primary font-medium hover:bg-white/90 active:scale-95 transition-all text-base shadow-sm"
          >
            <span>Begin</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
