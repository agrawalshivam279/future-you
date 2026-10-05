import React from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ArrowRight } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';
import { useCheckInStore } from '@/stores/check-in-store';
import { cn } from '@/lib/utils';

export interface CheckInSummaryCardProps {
  /** Optional custom CSS classes for container */
  className?: string;
  /** Optional callback override for navigation */
  onNavigate?: () => void;
}

/**
 * Dashboard quick-action card for Version 3 Check-in Mode.
 * Displays latest alignment score or checkpoint count and provides direct navigation to /check-in.
 */
export function CheckInSummaryCard({
  className,
  onNavigate,
}: CheckInSummaryCardProps): React.JSX.Element {
  const router = useRouter();
  const logs = useCheckInStore((state) => state.logs);
  const evaluations = useCheckInStore((state) => state.evaluations);

  const latestLog = logs.length > 0 ? logs[0] : null;
  const latestEvaluation = latestLog ? evaluations[latestLog.id] : undefined;
  const score = latestEvaluation?.overallAlignmentScore;

  const handleLaunch = () => {
    if (onNavigate) {
      onNavigate();
    } else {
      router.push('/check-in');
    }
  };

  return (
    <Card
      className={cn(
        'p-6 border border-border-primary bg-bg-secondary/70 hover:border-accent-improved/40 transition-all rounded-xl',
        className
      )}
      aria-label="Trajectory Check-in feature card"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-1.5 rounded-lg bg-accent-improved/10 text-accent-improved">
              <Activity className="w-4 h-4" aria-hidden="true" />
            </div>
            <Badge variant="improved" size="sm">
              Check-in Mode
            </Badge>
            <span className="text-xs text-text-tertiary">
              {score !== undefined
                ? `${score}% Trajectory Alignment`
                : logs.length > 0
                ? `${logs.length} checkpoint${logs.length > 1 ? 's' : ''}`
                : 'Track daily rhythms'}
            </span>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-text-primary">
              Track Habit Trajectory Drift
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary max-w-2xl mt-0.5">
              Log weekly habit rhythms and receive grounded trajectory reflections from your 5-year Future Self.
            </p>
          </div>
        </div>

        <div className="flex items-center self-start sm:self-center flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLaunch}
            rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
            aria-label="Open Trajectory Check-in"
          >
            {logs.length > 0 ? 'View Alignment' : 'Log Checkpoint'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
