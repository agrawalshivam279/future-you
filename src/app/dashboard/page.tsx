'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, RotateCcw, Sparkles, ArrowRight } from 'lucide-react';
import { useLifeModelStore } from '@/stores/life-model-store';
import { SplitViewContainer, HabitLeversPanel } from '@/components/dashboard';
import { DualTimeline } from '@/components/timeline';
import { ReflectionsGrid } from '@/components/reflections';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PersonaId, HabitLever } from '@/types';
import { regenerateFutures } from '@/lib/ai/regenerate-futures';

/**
 * DashboardPage displays the split-view comparison between Current Path
 * and Improved Path personas, interactive Habit Levers for dynamic futures recalculation,
 * and navigation to Chat, Letter, and Reflections.
 *
 * @returns JSX Element rendering the primary dashboard view
 */
export default function DashboardPage(): React.JSX.Element {
  const router = useRouter();
  const model = useLifeModelStore((state) => state.model);
  const setLifeModel = useLifeModelStore((state) => state.setLifeModel);

  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [recalculationError, setRecalculationError] = useState<string | null>(null);
  const [reflectionsPersona, setReflectionsPersona] = useState<PersonaId>('improved');

  const handleChat = (personaId: PersonaId) => {
    router.push(`/chat?persona=${personaId}`);
  };

  const handleLetter = (personaId: PersonaId) => {
    router.push(`/letter?persona=${personaId}`);
  };

  const handleReflections = (personaId: PersonaId) => {
    router.push(`/reflections?persona=${personaId}`);
  };

  const handleConfirmRegenerate = () => {
    setIsRegenerateModalOpen(false);
    router.push('/generate');
  };

  const handleApplyHabitLevers = async (updatedLevers: HabitLever[]) => {
    if (!model) return;
    setIsRegenerating(true);
    setRecalculationError(null);

    try {
      const updatedModel = await regenerateFutures(model, updatedLevers);
      setLifeModel(updatedModel);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to recalculate futures.';
      setRecalculationError(message);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!model) {
    return (
      <main className="min-h-screen bg-bg-primary text-text-primary px-4 py-16 flex items-center justify-center">
        <Card className="max-w-md w-full text-center space-y-5 p-8" data-testid="empty-dashboard-card">
          <div className="w-12 h-12 rounded-full bg-accent-info/10 text-accent-info flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" aria-hidden="true" />
          </div>

          <CardHeader className="p-0">
            <CardTitle as="h2" className="text-xl font-bold">
              No Simulation Yet
            </CardTitle>
            <CardDescription className="text-text-secondary mt-2">
              You haven&apos;t generated your future trajectories yet. Complete the onboarding wizard to simulate your two 5-year futures.
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

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-primary/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-improved bg-accent-improved/10 px-2.5 py-0.5 rounded-full border border-accent-improved/30">
                5-Year Simulation
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              Your Two Futures
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Observe how small habit levers compound into completely different trajectories.
            </p>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsRegenerateModalOpen(true)}
              aria-label="Regenerate Futures"
              leftIcon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
            >
              Regenerate
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push('/settings')}
              aria-label="Settings"
              leftIcon={<Settings className="w-4 h-4" aria-hidden="true" />}
            >
              Settings
            </Button>
          </div>
        </header>

        {/* Live Recalculation Notification Banner */}
        {isRegenerating && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-3 p-4 rounded-xl bg-accent-improved/10 border border-accent-improved/30 text-accent-improved text-sm font-medium"
            data-testid="recalculating-indicator"
          >
            <Sparkles className="w-5 h-5 animate-spin shrink-0" aria-hidden="true" />
            <span>Recalculating your Improved Path simulation based on updated habit levers...</span>
          </div>
        )}

        {/* Recalculation Error Banner */}
        {recalculationError && (
          <div
            role="alert"
            className="flex items-center justify-between p-4 rounded-xl bg-accent-danger/10 border border-accent-danger/30 text-accent-danger text-sm font-medium"
            data-testid="recalculation-error-banner"
          >
            <span>{recalculationError}</span>
            <button
              type="button"
              onClick={() => setRecalculationError(null)}
              className="text-xs underline hover:opacity-80"
              aria-label="Dismiss recalculation error"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Responsive Split View Container */}
        <SplitViewContainer
          lifeModel={model}
          onChatClick={handleChat}
          onLetterClick={handleLetter}
          onReflectionsClick={handleReflections}
        />

        {/* Habit Levers Panel */}
        {model.habitLevers && model.habitLevers.length > 0 && (
          <HabitLeversPanel
            levers={model.habitLevers}
            isRegenerating={isRegenerating}
            onApplyChanges={handleApplyHabitLevers}
          />
        )}

        {/* 5-Year Milestone Timeline */}
        <DualTimeline
          currentMilestones={model.currentPath.timeline || []}
          improvedMilestones={model.improvedPath.timeline || []}
        />

        {/* Psychological Reflections Matrix */}
        <section aria-label="Dashboard Reflections Section" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">
                Psychological Reflections
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Explore what each future self looks back on with regret or gratitude.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Reflections trajectory selector"
              className="flex items-center p-1 rounded-xl bg-bg-secondary border border-border-primary text-xs self-start sm:self-center"
            >
              {(['current', 'improved'] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={reflectionsPersona === id}
                  onClick={() => setReflectionsPersona(id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    reflectionsPersona === id
                      ? id === 'current'
                        ? 'bg-accent-current text-bg-primary font-bold shadow-sm'
                        : 'bg-accent-improved text-bg-primary font-bold shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                  aria-label={`Show ${id === 'current' ? 'Current' : 'Improved'} Path reflections on dashboard`}
                >
                  {id === 'current' ? 'Current Path' : 'Improved Path'}
                </button>
              ))}
            </div>
          </div>

          <ReflectionsGrid
            regrets={(reflectionsPersona === 'current' ? model.currentPath : model.improvedPath).regrets || []}
            gratitudes={(reflectionsPersona === 'current' ? model.currentPath : model.improvedPath).gratitudes || []}
            personaId={reflectionsPersona}
            personaName={(reflectionsPersona === 'current' ? model.currentPath : model.improvedPath).name}
          />
        </section>

        {/* Honesty Disclaimer Banner */}
        <footer className="pt-6 border-t border-border-primary/60 text-center">
          <p className="text-xs text-text-tertiary">
            Future You is a reflection tool, not a prediction engine. Results are illustrative and based on your self-reported inputs.
          </p>
        </footer>
      </div>

      {/* Confirmation Modal for Regeneration */}
      <Modal
        isOpen={isRegenerateModalOpen}
        onClose={() => setIsRegenerateModalOpen(false)}
        title="Regenerate Your Futures?"
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            This will re-run the 5-stage AI simulation pipeline using your existing onboarding responses.
            Newly generated personas, timelines, and letters will replace your current ones.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsRegenerateModalOpen(false)}
              aria-label="Cancel regeneration"
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmRegenerate}
              aria-label="Confirm regeneration"
            >
              Yes, Regenerate
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
