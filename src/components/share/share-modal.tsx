'use client';

import React, { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { useLifeModelStore } from '@/stores/life-model-store';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useCheckInStore } from '@/stores/check-in-store';
import {
  ShareCardConfig,
  ShareCardData,
  DEFAULT_SHARE_CONFIG,
} from '@/types/share.types';
import { ShareableCard } from './shareable-card';
import { PrivacyToggles } from './privacy-toggles';
import { ShareActions } from './share-actions';

export interface ShareModalProps {
  /** Whether the modal dialog is open */
  isOpen: boolean;
  /** Callback invoked to close the modal */
  onClose: () => void;
}

/**
 * ShareModal brings together the visual card preview, privacy redaction controls,
 * and high-resolution export triggers (PNG, SVG, clipboard) in an accessible dialog.
 */
export function ShareModal({ isOpen, onClose }: ShareModalProps): JSX.Element {
  const model = useLifeModelStore((state) => state.model);
  const goals = useOnboardingStore((state) => state.goals);
  const fearsAndValues = useOnboardingStore((state) => state.fearsAndValues);
  const logs = useCheckInStore((state) => state.logs || []);
  const evaluations = useCheckInStore((state) => state.evaluations || {});
  const latestLog = logs[0];
  const latestEvaluation = latestLog ? evaluations[latestLog.id] : undefined;

  const [config, setConfig] = useState<ShareCardConfig>(DEFAULT_SHARE_CONFIG);

  const cardData: ShareCardData = useMemo(() => {
    const primaryGoal =
      goals?.dreamLife ||
      goals?.shortTerm?.[0] ||
      model?.inputs?.goals?.dreamLife ||
      '5-Year Future Self Trajectory';

    const improvedPersona = model?.improvedPath;
    const currentPersona = model?.currentPath;

    const improvedHeadline =
      improvedPersona?.summary?.slice(0, 90) ||
      'Compounding personal growth & high-leverage outcomes';

    const currentHeadline =
      currentPersona?.summary?.slice(0, 90) ||
      'Status-quo baseline trajectory';

    const letterQuote =
      improvedPersona?.letter
        ?.split('\n')
        ?.find((line: string) => line.trim().length > 20)
        ?.replace(/^"|"$/g, '') ||
      'The compounding interest of your daily deep work became unstoppable.';

    const habits = (model?.habitLevers || []).map((lever) => ({
      label: lever.label,
      baseline: `${lever.currentValue} ${lever.unit || ''}`.trim(),
      target: `${lever.max} ${lever.unit || ''}`.trim(),
      isFinancial:
        lever.label.toLowerCase().includes('sav') ||
        lever.label.toLowerCase().includes('income') ||
        lever.label.toLowerCase().includes('money'),
    }));

    return {
      primaryGoal,
      improvedHeadline,
      improvedQuote: letterQuote,
      currentHeadline,
      alignmentScore: latestEvaluation?.overallAlignmentScore,
      habits:
        habits.length > 0
          ? habits
          : [
              { label: 'Deep Work', baseline: '15 hrs/wk', target: '25 hrs/wk', isFinancial: false },
              { label: 'Savings Rate', baseline: '10%', target: '35%', isFinancial: true },
            ],
      anxieties: fearsAndValues?.biggestFears || model?.inputs?.fearsAndValues?.biggestFears,
      generatedAt: new Date().toISOString(),
    };
  }, [model, goals, fearsAndValues, latestEvaluation]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Shareable Result Card"
      className="max-w-4xl"
    >
      <div className="space-y-6 pt-2">
        <p className="text-xs sm:text-sm text-zinc-400">
          Export a high-contrast visual summary of your dual 5-year trajectories. Redact sensitive
          finances and private notes before downloading or sharing.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Card Preview Frame */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-3 self-start">
              Live Preview
            </span>
            <div className="w-full flex justify-center">
              <ShareableCard data={cardData} config={config} />
            </div>
          </div>

          {/* Customization & Controls */}
          <div className="lg:col-span-5 space-y-6">
            <PrivacyToggles config={config} onChange={setConfig} />

            <div className="pt-4 border-t border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">
                Export Format
              </span>
              <ShareActions data={cardData} config={config} />
            </div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="pt-3 border-t border-zinc-800/80 text-center">
          <p className="text-[11px] text-zinc-500 italic">
            Zero cloud storage · All rendering is performed locally in your browser.
          </p>
        </div>
      </div>
    </Modal>
  );
}
