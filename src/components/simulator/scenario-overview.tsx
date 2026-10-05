import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { DecisionScenario, DecisionEvaluation } from '@/types';

export interface ScenarioOverviewProps {
  /** The currently active decision scenario */
  scenario: DecisionScenario;
  /** The evaluation metadata for the scenario */
  evaluation: DecisionEvaluation;
  /** Callback to delete the active scenario */
  onDelete: () => void;
}

/**
 * Renders the top overview card for an evaluated decision scenario,
 * showing domain, time horizon, timestamp, and delete action.
 */
export function ScenarioOverview({
  scenario,
  evaluation,
  onDelete,
}: ScenarioOverviewProps): React.JSX.Element {
  return (
    <div className="p-5 rounded-xl bg-bg-secondary border border-border-primary flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="neutral" size="sm" className="capitalize">
            {scenario.primaryDomain}
          </Badge>
          <Badge variant="neutral" size="sm">
            Horizon: {scenario.timeHorizon}
          </Badge>
          <span className="text-[11px] text-text-tertiary">
            Evaluated: {new Date(evaluation.evaluatedAt).toLocaleDateString()}
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-text-primary">
          {scenario.title}
        </h2>
        <p className="text-xs text-text-secondary max-w-3xl">
          {scenario.description}
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-text-secondary hover:text-accent-danger hover:bg-accent-danger/10 text-xs"
          aria-label="Delete scenario"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
          Delete
        </Button>
      </div>
    </div>
  );
}
