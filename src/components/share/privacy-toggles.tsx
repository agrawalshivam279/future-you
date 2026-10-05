import React from 'react';
import { Lock, Eye, EyeOff, Palette, Layers, Sparkles } from 'lucide-react';
import {
  ShareCardConfig,
  ShareCardTheme,
  CardAspectRatio,
  CardPersonaMode,
  ShareCardPrivacyConfig,
} from '@/types/share.types';

export interface PrivacyTogglesProps {
  /** Active share card configuration */
  config: ShareCardConfig;
  /** Callback fired whenever any privacy or appearance setting changes */
  onChange: (updatedConfig: ShareCardConfig) => void;
  /** Optional container style override */
  className?: string;
}

const THEME_OPTIONS: Array<{ value: ShareCardTheme; label: string; dotClass: string }> = [
  { value: 'midnight', label: 'Midnight', dotClass: 'bg-zinc-800 border-zinc-600' },
  { value: 'emerald', label: 'Emerald', dotClass: 'bg-emerald-600 border-emerald-400' },
  { value: 'amber', label: 'Amber', dotClass: 'bg-amber-600 border-amber-400' },
  { value: 'monochrome', label: 'Mono', dotClass: 'bg-zinc-100 border-zinc-300' },
];

const ASPECT_OPTIONS: Array<{ value: CardAspectRatio; label: string; ratio: string }> = [
  { value: 'square', label: 'Square', ratio: '1:1' },
  { value: 'portrait', label: 'Story', ratio: '4:5' },
  { value: 'landscape', label: 'Banner', ratio: '16:9' },
];

const PERSONA_OPTIONS: Array<{ value: CardPersonaMode; label: string }> = [
  { value: 'split', label: 'Dual Split' },
  { value: 'improved', label: 'Improved Only' },
  { value: 'current', label: 'Current Only' },
];

/**
 * Customization controls for Shareable Result Card.
 * Manages privacy masking, content inclusion toggles, themes, and dimensions.
 */
export function PrivacyToggles({
  config,
  onChange,
  className = '',
}: PrivacyTogglesProps): JSX.Element {
  const { privacy } = config;

  const handlePrivacyToggle = (key: keyof ShareCardPrivacyConfig) => {
    onChange({
      ...config,
      privacy: {
        ...privacy,
        [key]: !privacy[key],
      },
    });
  };

  const handleThemeChange = (theme: ShareCardTheme) => {
    onChange({ ...config, theme });
  };

  const handleAspectChange = (aspectRatio: CardAspectRatio) => {
    onChange({ ...config, aspectRatio });
  };

  const handlePersonaChange = (personaMode: CardPersonaMode) => {
    onChange({ ...config, personaMode });
  };

  return (
    <div
      role="region"
      aria-label="Share Card Customization Controls"
      className={`space-y-6 text-sm ${className}`}
    >
      {/* Privacy Redaction Toggles */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Privacy & Redaction</span>
        </div>

        <div className="space-y-2 bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5">
          <label className="flex items-center justify-between cursor-pointer py-1 select-none">
            <div className="pr-4">
              <span className="font-medium text-zinc-200 block text-xs">
                Mask Financial Metrics
              </span>
              <span className="text-[11px] text-zinc-400 block">
                Replaces exact salaries and savings numbers with &bull;&bull;&bull;&bull;
              </span>
            </div>
            <input
              type="checkbox"
              aria-label="Mask Financial Metrics"
              checked={privacy.maskFinances}
              onChange={() => handlePrivacyToggle('maskFinances')}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500/30 cursor-pointer"
            />
          </label>

          <div className="border-t border-zinc-800/80 my-1" />

          <label className="flex items-center justify-between cursor-pointer py-1 select-none">
            <div className="pr-4">
              <span className="font-medium text-zinc-200 block text-xs">
                Mask Private Anxieties
              </span>
              <span className="text-[11px] text-zinc-400 block">
                Redacts personal fears and friction notes from card export
              </span>
            </div>
            <input
              type="checkbox"
              aria-label="Mask Private Anxieties"
              checked={privacy.maskAnxieties}
              onChange={() => handlePrivacyToggle('maskAnxieties')}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500/30 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Content Inclusions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <Eye className="w-3.5 h-3.5 text-zinc-400" />
          <span>Content Inclusions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            aria-pressed={privacy.includeLetterQuote}
            onClick={() => handlePrivacyToggle('includeLetterQuote')}
            className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-colors ${
              privacy.includeLetterQuote
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Future Self Quote
          </button>

          <button
            type="button"
            aria-pressed={privacy.includeAlignmentScore}
            onClick={() => handlePrivacyToggle('includeAlignmentScore')}
            className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-colors ${
              privacy.includeAlignmentScore
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Alignment Score
          </button>

          <button
            type="button"
            aria-pressed={privacy.includeHabits}
            onClick={() => handlePrivacyToggle('includeHabits')}
            className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-colors ${
              privacy.includeHabits
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Habit Levers
          </button>
        </div>
      </div>

      {/* Visual Theme Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <Palette className="w-3.5 h-3.5 text-zinc-400" />
          <span>Card Theme</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {THEME_OPTIONS.map((theme) => {
            const isSelected = config.theme === theme.value;
            return (
              <button
                key={theme.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleThemeChange(theme.value)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'bg-zinc-800 border-zinc-600 text-white shadow-sm'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full border ${theme.dotClass}`} />
                <span>{theme.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aspect Ratio & Persona Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Aspect Ratio */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span>Format</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {ASPECT_OPTIONS.map((aspect) => (
              <button
                key={aspect.value}
                type="button"
                aria-pressed={config.aspectRatio === aspect.value}
                onClick={() => handleAspectChange(aspect.value)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-colors ${
                  config.aspectRatio === aspect.value
                    ? 'bg-zinc-800 border-zinc-600 text-white'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="block">{aspect.label}</span>
                <span className="block text-[10px] text-zinc-500">{aspect.ratio}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Persona Mode */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>Persona Focus</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {PERSONA_OPTIONS.map((persona) => (
              <button
                key={persona.value}
                type="button"
                aria-pressed={config.personaMode === persona.value}
                onClick={() => handlePersonaChange(persona.value)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-colors ${
                  config.personaMode === persona.value
                    ? 'bg-zinc-800 border-zinc-600 text-white'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="block truncate">{persona.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
