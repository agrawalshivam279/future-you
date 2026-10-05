import React from 'react';
import { Trash2, Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckInLog, CheckInEvaluation } from '@/types';
import { cn } from '@/lib/utils';

export interface CheckInHistoryCardProps {
  logs: CheckInLog[];
  evaluations: Record<string, CheckInEvaluation>;
  activeLogId: string | null;
  onSelectLog: (id: string) => void;
  onDeleteLog: (id: string) => void;
  className?: string;
}

/**
 * Historical checkpoints timeline displaying previous habit logs and alignment scores.
 */
export function CheckInHistoryCard({
  logs,
  evaluations,
  activeLogId,
  onSelectLog,
  onDeleteLog,
  className,
}: CheckInHistoryCardProps): React.JSX.Element {
  if (logs.length === 0) {
    return (
      <Card className={cn('border-border bg-bg-card', className)}>
        <CardContent className="p-6 text-center text-sm text-text-muted">
          No previous check-in checkpoints recorded yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-border bg-bg-card', className)}>
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-text-primary">
              Check-in History & Streaks
            </CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              {logs.length} checkpoint{logs.length === 1 ? '' : 's'} recorded locally in your browser.
            </CardDescription>
          </div>
          <Badge variant="neutral" size="sm">
            {logs.length} Recorded
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div role="list" aria-label="Historical Check-in Logs" className="space-y-2">
          {logs.map((log) => {
            const evaluation = evaluations[log.id];
            const isActive = log.id === activeLogId;
            const score = evaluation?.overallAlignmentScore;

            const dateStr = new Date(log.loggedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            const scoreBadgeVariant =
              score !== undefined && score >= 80
                ? 'improved'
                : score !== undefined && score >= 50
                ? 'current'
                : 'danger';

            return (
              <div
                key={log.id}
                role="listitem"
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border transition-colors',
                  isActive
                    ? 'border-accent-improved/50 bg-accent-improved/5'
                    : 'border-border/60 bg-bg-surface hover:border-border'
                )}
              >
                {/* Date & Note Excerpt */}
                <button
                  type="button"
                  onClick={() => onSelectLog(log.id)}
                  className="flex-1 text-left flex items-start space-x-3 cursor-pointer group"
                  aria-label={`View checkpoint from ${dateStr}`}
                >
                  <div
                    className={cn(
                      'mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors',
                      isActive
                        ? 'bg-accent-improved text-bg-primary'
                        : 'bg-bg-tertiary text-text-muted group-hover:text-text-primary'
                    )}
                  >
                    {isActive ? (
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Calendar className="w-4 h-4" aria-hidden="true" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-text-primary group-hover:text-accent-improved transition-colors">
                        {dateStr}
                      </span>
                      {score !== undefined && (
                        <Badge variant={scoreBadgeVariant} size="sm">
                          {score}% Alignment
                        </Badge>
                      )}
                    </div>

                    {log.notes && (
                      <p className="text-xs text-text-muted line-clamp-1 italic max-w-md">
                        &ldquo;{log.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </button>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteLog(log.id)}
                    aria-label={`Delete check-in from ${dateStr}`}
                    className="p-1.5 text-text-muted hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
