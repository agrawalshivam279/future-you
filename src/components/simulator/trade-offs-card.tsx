import React from 'react';
import { Scale, AlertOctagon } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface TradeOffsCardProps {
  /** Explicit sacrifices and trade-offs required by the decision */
  tradeOffs: string[];
  /** Latent frictions, second-order effects, or unforeseen risks */
  unforeseenRisks: string[];
  /** Optional custom CSS classes for container */
  className?: string;
}

/**
 * Visualizes the explicit sacrifices, trade-offs, and latent blindspots
 * projected for a user-submitted decision fork.
 *
 * @param props - Component properties containing trade-offs and unforeseen risks
 * @returns JSX Element rendering contrasting risk analysis cards
 */
export function TradeOffsCard({
  tradeOffs,
  unforeseenRisks,
  className,
}: TradeOffsCardProps): React.JSX.Element {
  const safeTradeOffs = Array.isArray(tradeOffs) ? tradeOffs.filter((item) => item.trim().length > 0) : [];
  const safeRisks = Array.isArray(unforeseenRisks) ? unforeseenRisks.filter((item) => item.trim().length > 0) : [];

  return (
    <section className={cn('space-y-4', className)} aria-labelledby="trade-offs-section-title">
      <div>
        <h3
          id="trade-offs-section-title"
          className="text-base md:text-lg font-semibold text-text-primary tracking-tight"
        >
          Trade-offs &amp; Latent Blindspots
        </h3>
        <p className="text-xs md:text-sm text-text-secondary mt-0.5">
          Confronting the unavoidable sacrifices and non-obvious hazards of this path.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Direct Sacrifices & Frictions Card */}
        <Card
          className="p-5 border border-accent-current/30 bg-accent-current/5 flex flex-col justify-between"
          aria-label="Direct sacrifices and frictions"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-accent-current/10 text-accent-current">
                  <Scale className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">
                    Direct Sacrifices &amp; Frictions
                  </h4>
                  <p className="text-xs text-text-secondary">
                    Explicit costs required by this choice
                  </p>
                </div>
              </div>
              <Badge variant="current" size="sm">
                Trade-offs
              </Badge>
            </div>

            {safeTradeOffs.length > 0 ? (
              <ul className="space-y-2.5" role="list">
                {safeTradeOffs.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 p-2.5 rounded-md bg-bg-secondary/60 border border-border-primary text-xs md:text-sm text-text-primary leading-relaxed"
                  >
                    <span className="flex-shrink-0 font-mono text-[11px] font-semibold text-accent-current px-1.5 py-0.5 rounded bg-accent-current/10 mt-0.5">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-text-secondary italic py-3">
                No explicit trade-offs detected for this decision.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-accent-current/15 text-[11px] text-text-tertiary">
            Every decision forfeits alternative options. Ensure these sacrifices are intentional.
          </div>
        </Card>

        {/* Unforeseen Risks & Blindspots Card */}
        <Card
          className="p-5 border border-accent-danger/30 bg-accent-danger/5 flex flex-col justify-between"
          aria-label="Unforeseen and latent risks"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-accent-danger/10 text-accent-danger">
                  <AlertOctagon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">
                    Unforeseen &amp; Latent Risks
                  </h4>
                  <p className="text-xs text-text-secondary">
                    Second-order hazards and hidden vulnerabilities
                  </p>
                </div>
              </div>
              <Badge variant="danger" size="sm">
                Blindspots
              </Badge>
            </div>

            {safeRisks.length > 0 ? (
              <ul className="space-y-2.5" role="list">
                {safeRisks.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 p-2.5 rounded-md bg-bg-secondary/60 border border-border-primary text-xs md:text-sm text-text-primary leading-relaxed"
                  >
                    <span className="flex-shrink-0 font-mono text-[11px] font-semibold text-accent-danger px-1.5 py-0.5 rounded bg-accent-danger/10 mt-0.5">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-text-secondary italic py-3">
                No latent blindspots detected for this decision.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-accent-danger/15 text-[11px] text-text-tertiary">
            Second-order consequences often manifest in relationships, energy, and unexpected burnout.
          </div>
        </Card>
      </div>
    </section>
  );
}
