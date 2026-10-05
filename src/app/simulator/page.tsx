'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { useLifeModelStore } from '@/stores/life-model-store';
import { useDecisionStore } from '@/stores/decision-store';
import { simulateDecisionScenario } from '@/lib/ai/simulate-decision';
import { Button, Card, Badge, Spinner } from '@/components/ui';
import {
  DecisionForm,
  ImpactMatrix,
  PersonaVerdicts,
  TradeOffsCard,
  ScenarioOverview,
} from '@/components/simulator';
import { DecisionScenario } from '@/types';
import { cn } from '@/lib/utils';

/**
 * Dedicated Decision Simulator page route (`/simulator`).
 * Enables users to simulate pivotal life choices against their Life Model
 * and inspect multi-horizon projections across both personas.
 *
 * @returns JSX Element rendering the decision simulator page
 */
export default function SimulatorPage(): React.JSX.Element {
  const router = useRouter();
  const model = useLifeModelStore((state) => state.model);

  const {
    scenarios,
    evaluations,
    activeScenarioId,
    isLoading,
    error,
    addScenario,
    deleteScenario,
    setActiveScenario,
    setLoading,
    setError,
  } = useDecisionStore();

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId);
  const activeEvaluation = activeScenarioId ? evaluations[activeScenarioId] : undefined;

  // Empty state guard when onboarding has not been completed
  if (!model) {
    return (
      <main className="min-h-screen bg-bg-primary text-text-primary px-4 py-16 flex items-center justify-center">
        <Card
          className="max-w-md w-full text-center space-y-5 p-8 border border-border-primary"
          data-testid="empty-simulator-guard"
        >
          <div className="w-12 h-12 rounded-full bg-accent-info/10 text-accent-info flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">No Future Models Found</h2>
            <p className="text-sm text-text-secondary mt-2">
              Complete the onboarding process to simulate your two 5-year futures before testing decision forks.
            </p>
          </div>
          <Button
            onClick={() => router.push('/onboarding')}
            className="w-full"
            aria-label="Start onboarding"
          >
            Start Onboarding
          </Button>
        </Card>
      </main>
    );
  }

  const handleSimulate = async (scenarioData: Omit<DecisionScenario, 'id' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    setProgressStatus('Authoring scenario...');

    try {
      const created = addScenario(scenarioData);
      setIsCreatingNew(false);
      await simulateDecisionScenario(created, {
        onProgress: (status) => setProgressStatus(status),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to evaluate decision.';
      setError(msg);
    } finally {
      setLoading(false);
      setProgressStatus('');
    }
  };

  const handleSelectScenario = (id: string) => {
    setIsCreatingNew(false);
    setActiveScenario(id);
    setError(null);
  };

  const handleDeleteActiveScenario = () => {
    if (!activeScenarioId) return;
    deleteScenario(activeScenarioId);
    setIsCreatingNew(false);
  };

  const showForm = isCreatingNew || !activeScenario || (!activeEvaluation && !isLoading);

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-6xl mx-auto space-y-8">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-primary pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="text-text-secondary hover:text-text-primary -ml-2 p-1.5"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
              Dashboard
            </Button>
            <Badge variant="info" size="sm">
              Reflection Tool • Not Prediction
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Decision Simulator
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Simulate pivotal forks and project multi-horizon impacts across both 5-year futures.
          </p>
        </div>

        {/* Action: New Scenario */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setIsCreatingNew(true);
              setError(null);
            }}
            variant="secondary"
            size="sm"
            className="flex items-center gap-1.5"
            aria-label="Create new decision scenario"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>New Decision</span>
          </Button>
        </div>
      </div>

      {/* Saved Scenarios Tab Bar */}
      {scenarios.length > 0 && (
        <div
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
          role="tablist"
          aria-label="Saved decision scenarios"
        >
          {scenarios.map((scenario) => {
            const isSelected = !isCreatingNew && scenario.id === activeScenarioId;
            return (
              <button
                key={scenario.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectScenario(scenario.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border',
                  isSelected
                    ? 'bg-accent-info/10 text-accent-info border-accent-info/40 shadow-xs'
                    : 'bg-bg-secondary text-text-secondary border-border-primary hover:text-text-primary hover:bg-bg-hover'
                )}
              >
                {scenario.title}
              </button>
            );
          })}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div
          className="p-4 rounded-xl bg-accent-danger/10 border border-accent-danger/30 text-accent-danger flex items-center justify-between gap-3 text-sm"
          role="alert"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setError(null)}
            className="text-xs text-accent-danger hover:bg-accent-danger/20"
            aria-label="Dismiss error"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Loading State Card */}
      {isLoading && (
        <Card
          className="p-12 text-center flex flex-col items-center justify-center space-y-4 border border-border-primary bg-bg-secondary/50"
          aria-live="polite"
        >
          <Spinner size="lg" className="text-accent-info" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-text-primary">
              Projecting Decision Trajectories...
            </h3>
            <p className="text-xs text-text-secondary">
              {progressStatus || 'Consulting future identities across Years 1, 3, and 5...'}
            </p>
          </div>
        </Card>
      )}

      {/* Active Form Mode */}
      {!isLoading && showForm && (
        <div className="space-y-6">
          <div className="bg-bg-secondary/40 border border-border-primary rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-1">
              Explore a New Life Fork
            </h2>
            <p className="text-xs text-text-secondary mb-6">
              Enter a potential life change or select a preset template to analyze domain trade-offs.
            </p>
            <DecisionForm onSubmit={handleSimulate} isLoading={isLoading} />
          </div>
        </div>
      )}

      {/* Evaluation Results Mode */}
      {!isLoading && !showForm && activeScenario && activeEvaluation && (
        <div className="space-y-10" data-testid="decision-evaluation-results">
          {/* Active Scenario Overview Header */}
          <ScenarioOverview
            scenario={activeScenario}
            evaluation={activeEvaluation}
            onDelete={handleDeleteActiveScenario}
          />

          {/* Section 1: Domain Deltas & Multi-Horizon Projections */}
          <ImpactMatrix
            projections={activeEvaluation.projections}
            domainDeltas={activeEvaluation.domainDeltas}
          />

          {/* Section 2: Competing Persona Verdicts */}
          <PersonaVerdicts reactions={activeEvaluation.personaReactions} />

          {/* Section 3: Direct Trade-offs & Second-Order Blindspots */}
          <TradeOffsCard
            tradeOffs={activeEvaluation.tradeOffs}
            unforeseenRisks={activeEvaluation.unforeseenRisks}
          />

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-border-primary flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCreatingNew(true)}
              className="flex items-center gap-1.5"
              aria-label="Simulate another decision"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              Simulate Another Fork
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              aria-label="Return to dashboard"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
