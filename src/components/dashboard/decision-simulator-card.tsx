import React from 'react';
import { useRouter } from 'next/navigation';
import { GitFork, ArrowRight } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';
import { useDecisionStore } from '@/stores/decision-store';
import { cn } from '@/lib/utils';

export interface DecisionSimulatorCardProps {
  /** Optional custom CSS classes for container */
  className?: string;
  /** Optional callback override for navigation */
  onNavigate?: () => void;
}

/**
 * Dashboard quick-action card triggering the Decision Simulator ("What If?" Fork Engine).
 * Displays count of currently simulated scenarios and provides direct navigation to /simulator.
 */
export function DecisionSimulatorCard({
  className,
  onNavigate,
}: DecisionSimulatorCardProps): React.JSX.Element {
  const router = useRouter();
  const scenarios = useDecisionStore((state) => state.scenarios);
  const count = scenarios.length;

  const handleLaunch = () => {
    if (onNavigate) {
      onNavigate();
    } else {
      router.push('/simulator');
    }
  };

  return (
    <Card
      className={cn(
        'p-6 border border-border-primary bg-bg-secondary/70 hover:border-accent-info/40 transition-all rounded-xl',
        className
      )}
      aria-label="Decision Simulator feature card"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-1.5 rounded-lg bg-accent-info/10 text-accent-info">
              <GitFork className="w-4 h-4" aria-hidden="true" />
            </div>
            <Badge variant="info" size="sm">
              Decision Simulator
            </Badge>
            <span className="text-xs text-text-tertiary">
              {count > 0 ? `${count} fork${count > 1 ? 's' : ''} evaluated` : 'Explore forks'}
            </span>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-text-primary">
              Test Major Life Decisions
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary max-w-2xl mt-0.5">
              Simulate forks like career transitions, relocations, or new investments. Observe multi-horizon ripple effects and direct verdicts from both future selves.
            </p>
          </div>
        </div>

        <div className="flex items-center self-start sm:self-center flex-shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={handleLaunch}
            rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
            aria-label="Launch Decision Simulator"
          >
            Launch Simulator
          </Button>
        </div>
      </div>
    </Card>
  );
}
