'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, RotateCcw, Sparkles, ArrowRight } from 'lucide-react';
import { useLifeModelStore } from '@/stores/life-model-store';
import { SplitViewContainer } from '@/components/dashboard';
import { DualTimeline } from '@/components/timeline';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PersonaId } from '@/types';

/**
 * DashboardPage displays the split-view comparison between Current Path
 * and Improved Path personas, providing navigation to Chat, Letter,
 * and Reflections, alongside a regeneration action.
 *
 * @returns JSX Element rendering the primary dashboard view
 */
export default function DashboardPage(): React.JSX.Element {
  const router = useRouter();
  const model = useLifeModelStore((state) => state.model);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);

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

        {/* Responsive Split View Container */}
        <SplitViewContainer
          lifeModel={model}
          onChatClick={handleChat}
          onLetterClick={handleLetter}
          onReflectionsClick={handleReflections}
        />

        {/* 5-Year Milestone Timeline */}
        <DualTimeline
          currentMilestones={model.currentPath.timeline || []}
          improvedMilestones={model.improvedPath.timeline || []}
        />

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
