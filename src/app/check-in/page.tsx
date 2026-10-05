'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles, AlertCircle, RefreshCw, Activity, ArrowLeft } from 'lucide-react';
import { useLifeModelStore } from '@/stores/life-model-store';
import { useCheckInStore } from '@/stores/check-in-store';
import { evaluateAndGenerateCheckInFeedback } from '@/lib/ai/check-in-feedback';
import { Button, Card, Badge, Spinner } from '@/components/ui';
import {
  CheckInForm,
  CheckInFormData,
  AlignmentGauge,
  DriftVectorList,
  ReflectionBadge,
  CheckInHistoryCard,
} from '@/components/check-in';

/**
 * Dedicated Check-in Mode page route (`/check-in`).
 * Captures weekly habit checkpoints, calculates trajectory alignment vs baseline and target goals,
 * and renders personalized reflection notes from the Improved Path Future Self.
 */
export default function CheckInPage(): React.JSX.Element {
  const router = useRouter();
  const model = useLifeModelStore((state) => state.model);

  const {
    logs,
    evaluations,
    activeLogId,
    isLoading,
    error,
    addLog,
    deleteLog,
    setActiveLog,
    setLoading,
    setError,
  } = useCheckInStore();

  const [isRecordingNew, setIsRecordingNew] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');

  const activeLog = logs.find((l) => l.id === activeLogId) ?? (logs.length > 0 ? logs[0] : null);
  const activeEvaluation = activeLog ? evaluations[activeLog.id] : undefined;

  // Onboarding guard: user must generate future personas first
  if (!model) {
    return (
      <main className="min-h-screen bg-bg-primary text-text-primary px-4 py-16 flex items-center justify-center">
        <Card
          className="max-w-md w-full text-center space-y-5 p-8 border border-border-primary"
          data-testid="empty-checkin-guard"
        >
          <div className="w-12 h-12 rounded-full bg-accent-info/10 text-accent-info flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">No Future Models Found</h2>
            <p className="text-sm text-text-secondary mt-2">
              Complete onboarding to simulate your two 5-year futures before tracking weekly habit trajectory.
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

  const handleRecordCheckIn = async (data: CheckInFormData) => {
    setLoading(true);
    setError(null);
    setProgressStatus('Recording checkpoint & calculating drift...');

    try {
      const createdLog = addLog(data);
      setIsRecordingNew(false);
      await evaluateAndGenerateCheckInFeedback(createdLog, {
        onProgress: (status) => setProgressStatus(status),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to evaluate check-in.';
      setError(msg);
    } finally {
      setLoading(false);
      setProgressStatus('');
    }
  };

  const handleReevaluate = async () => {
    if (!activeLog) return;
    setLoading(true);
    setError(null);
    setProgressStatus('Synthesizing Future Self feedback...');

    try {
      await evaluateAndGenerateCheckInFeedback(activeLog, {
        onProgress: (status) => setProgressStatus(status),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to re-evaluate check-in.';
      setError(msg);
    } finally {
      setLoading(false);
      setProgressStatus('');
    }
  };

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary px-4 py-8 max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="text-text-muted hover:text-text-primary transition-colors p-1 -ml-1 rounded"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Trajectory Check-in
            </h1>
            <Badge variant="improved" size="sm">
              Version 3
            </Badge>
          </div>
          <p className="text-sm text-text-secondary">
            Weekly habit checkpoints and alignment reflections from your 5-year Future Self.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {logs.length > 0 && !isRecordingNew && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsRecordingNew(true)}
              disabled={isLoading}
              className="flex items-center space-x-1.5"
              aria-label="Record New Checkpoint"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Record Checkpoint</span>
            </Button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
        >
          <div className="flex items-center space-x-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Loading Progress Indicator */}
      {isLoading && progressStatus && (
        <div className="flex items-center justify-center p-6 space-x-3 bg-bg-surface rounded-xl border border-border">
          <Spinner size="md" variant="improved" />
          <span className="text-sm text-text-secondary font-medium animate-pulse">
            {progressStatus}
          </span>
        </div>
      )}

      {/* View Switch: Recording Mode vs Active Checkpoint */}
      {isRecordingNew || logs.length === 0 ? (
        <div className="space-y-4 max-w-2xl mx-auto">
          {logs.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRecordingNew(false)}
              className="text-text-muted hover:text-text-primary"
            >
              ← Cancel and view latest checkpoint
            </Button>
          )}
          <CheckInForm onSubmit={handleRecordCheckIn} isLoading={isLoading} />
        </div>
      ) : activeLog ? (
        <div className="space-y-8">
          {/* Active Checkpoint Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Alignment Gauge & Reflection Note */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="border-border bg-bg-card p-6 flex flex-col items-center">
                <AlignmentGauge
                  score={activeEvaluation?.overallAlignmentScore ?? 0}
                  size="md"
                />
              </Card>

              {activeEvaluation ? (
                <ReflectionBadge reflection={activeEvaluation.futureSelfReflection} />
              ) : (
                <Card className="p-6 text-center space-y-3 border-border bg-bg-card">
                  <p className="text-sm text-text-muted">
                    Feedback has not yet been generated for this checkpoint.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleReevaluate}
                    disabled={isLoading}
                    className="flex items-center space-x-1.5 mx-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Generate Future Self Reflection</span>
                  </Button>
                </Card>
              )}
            </div>

            {/* Right Column: Drift Vector Breakdown */}
            <div className="lg:col-span-7">
              <Card className="border-border bg-bg-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-accent-improved" aria-hidden="true" />
                    <h2 className="text-base font-semibold text-text-primary">
                      Habit Vector Analysis
                    </h2>
                  </div>
                  <span className="text-xs text-text-muted">
                    {new Date(activeLog.loggedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <DriftVectorList vectors={activeEvaluation?.driftVectors ?? []} />
              </Card>
            </div>
          </div>

          {/* Bottom Historical Timeline & Checkpoints */}
          <CheckInHistoryCard
            logs={logs}
            evaluations={evaluations}
            activeLogId={activeLog.id}
            onSelectLog={(id) => setActiveLog(id)}
            onDeleteLog={(id) => deleteLog(id)}
          />
        </div>
      ) : null}
    </main>
  );
}
