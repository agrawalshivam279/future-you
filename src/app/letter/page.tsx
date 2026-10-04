'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, MessageSquare, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { useLifeModelStore } from '@/stores/life-model-store';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { LetterView } from '@/components/letter';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PersonaId } from '@/types';

/**
 * Inner letter view component handling URL query search parameters
 * and multi-persona letter navigation.
 */
function LetterPageInner(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPersona = searchParams.get('persona') as PersonaId | null;

  const validInitialPersona: PersonaId =
    requestedPersona === 'current' ? 'current' : 'improved';

  const [activePersona, setActivePersona] = useState<PersonaId>(validInitialPersona);

  const model = useLifeModelStore((state) => state.model);
  const getOnboardingData = useOnboardingStore((state) => state.getOnboardingData);

  const onboardingData = useMemo(() => {
    return model?.inputs || getOnboardingData();
  }, [model, getOnboardingData]);

  // Sync state if URL query param changes externally
  useEffect(() => {
    if (requestedPersona && (requestedPersona === 'current' || requestedPersona === 'improved')) {
      if (requestedPersona !== activePersona) {
        setActivePersona(requestedPersona);
      }
    }
  }, [requestedPersona, activePersona]);

  // Handle switching personas and syncing URL without page reload
  const handleSelectPersona = (id: PersonaId) => {
    setActivePersona(id);
    router.replace(`/letter?persona=${id}`, { scroll: false });
  };

  // Empty state guard if no simulation exists
  if (!model) {
    return (
      <main className="min-h-screen bg-bg-primary text-text-primary px-4 py-16 flex items-center justify-center">
        <Card className="max-w-md w-full text-center space-y-5 p-8" data-testid="empty-letter-card">
          <div className="w-12 h-12 rounded-full bg-accent-info/10 text-accent-info flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" aria-hidden="true" />
          </div>

          <CardHeader className="p-0">
            <CardTitle as="h2" className="text-xl font-bold">
              No Letters Yet
            </CardTitle>
            <CardDescription className="text-text-secondary mt-2">
              You haven&apos;t generated your future trajectories yet. Complete the onboarding wizard to simulate your two 5-year futures and read their personal letters.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 pt-2">
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => router.push('/onboarding')}
              rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
              aria-label="Begin Onboarding"
            >
              Begin Onboarding
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const activePersonaData =
    activePersona === 'current' ? model.currentPath : model.improvedPath;

  const letterText =
    activePersonaData?.letter ||
    'Take a moment to reflect on your current trajectory. Every choice compounds over time.';

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Persona Switcher Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border-primary/60">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              aria-label="Return to Dashboard"
              leftIcon={<ArrowLeft className="w-4 h-4" aria-hidden="true" />}
            >
              Dashboard
            </Button>
            <h1 className="text-lg font-bold text-text-primary">
              Letter From Future Self
            </h1>
          </div>

          {/* Persona Switcher Tabs & Chat Action */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div
              role="tablist"
              aria-label="Choose future path letter"
              className="flex items-center p-1 rounded-xl bg-bg-secondary border border-border-primary text-xs"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activePersona === 'current'}
                onClick={() => handleSelectPersona('current')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  activePersona === 'current'
                    ? 'bg-accent-current text-bg-primary font-bold shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                aria-label="View Current Path letter"
              >
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                Current Path
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activePersona === 'improved'}
                onClick={() => handleSelectPersona('improved')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  activePersona === 'improved'
                    ? 'bg-accent-improved text-bg-primary font-bold shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                aria-label="View Improved Path letter"
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Improved Path
              </button>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => router.push(`/chat?persona=${activePersona}`)}
              aria-label={`Chat with ${activePersonaData.name}`}
              leftIcon={<MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />}
            >
              Talk
            </Button>
          </div>
        </header>

        {/* Stationery Letter Container with Narration & Download */}
        <LetterView
          letter={letterText}
          personaId={activePersona}
          personaName={activePersonaData.name}
          userName={onboardingData.name || 'You'}
          targetAge={activePersonaData.age}
        />
      </div>
    </main>
  );
}

/**
 * Fallback loading spinner for Next.js Suspense boundary
 */
function LetterLoadingFallback(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="animate-spin w-8 h-8 rounded-full border-2 border-accent-improved border-t-transparent" />
    </div>
  );
}

/**
 * Dedicated Letter page route wrapping the view with Next.js App Router Suspense.
 */
export default function LetterPage(): React.JSX.Element {
  return (
    <Suspense fallback={<LetterLoadingFallback />}>
      <LetterPageInner />
    </Suspense>
  );
}
