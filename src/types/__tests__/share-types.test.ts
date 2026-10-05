import {
  ShareCardTheme,
  CardExportFormat,
  CardAspectRatio,
  CardPersonaMode,
  ShareCardPrivacyConfig,
  ShareCardConfig,
  ShareCardData,
  DEFAULT_SHARE_PRIVACY,
  DEFAULT_SHARE_CONFIG,
  CARD_DIMENSIONS,
} from '../index';

describe('Share Card Domain Types & Constants', () => {
  it('exports default privacy configuration with strict safety defaults', () => {
    expect(DEFAULT_SHARE_PRIVACY).toEqual({
      maskFinances: true,
      maskAnxieties: true,
      includeLetterQuote: true,
      includeAlignmentScore: true,
      includeHabits: true,
    });
    expect(DEFAULT_SHARE_PRIVACY.maskFinances).toBe(true);
    expect(DEFAULT_SHARE_PRIVACY.maskAnxieties).toBe(true);
  });

  it('exports default card configuration with midnight square preset', () => {
    expect(DEFAULT_SHARE_CONFIG.theme).toBe('midnight');
    expect(DEFAULT_SHARE_CONFIG.format).toBe('png');
    expect(DEFAULT_SHARE_CONFIG.aspectRatio).toBe('square');
    expect(DEFAULT_SHARE_CONFIG.personaMode).toBe('split');
    expect(DEFAULT_SHARE_CONFIG.privacy).toBe(DEFAULT_SHARE_PRIVACY);
  });

  it('provides valid dimensions for all aspect ratio presets', () => {
    expect(CARD_DIMENSIONS.square).toEqual({ width: 1080, height: 1080 });
    expect(CARD_DIMENSIONS.portrait).toEqual({ width: 1080, height: 1350 });
    expect(CARD_DIMENSIONS.landscape).toEqual({ width: 1200, height: 675 });
  });

  it('validates a complete ShareCardData snapshot', () => {
    const cardData: ShareCardData = {
      primaryGoal: 'Build an autonomous intelligence lab',
      improvedHeadline: 'Principal Architect orchestrating high-leverage systems',
      improvedQuote: 'The compound interest of your daily deep work became unstoppable.',
      currentHeadline: 'Senior Developer handling routine sprint maintenance',
      alignmentScore: 88,
      habits: [
        { label: 'Deep Work', baseline: 10, target: 25, isFinancial: false },
        { label: 'Monthly Savings', baseline: '$1,200', target: '$3,500', isFinancial: true },
      ],
      anxieties: ['Imposter syndrome in early leadership transitions'],
      generatedAt: '2026-10-06T00:00:00.000Z',
    };

    expect(cardData.primaryGoal).toBe('Build an autonomous intelligence lab');
    expect(cardData.alignmentScore).toBe(88);
    expect(cardData.habits).toHaveLength(2);
    expect(cardData.habits[1].isFinancial).toBe(true);
  });

  it('supports custom theme, format, and aspect settings in ShareCardConfig', () => {
    const customConfig: ShareCardConfig = {
      theme: 'emerald' as ShareCardTheme,
      format: 'svg' as CardExportFormat,
      aspectRatio: 'landscape' as CardAspectRatio,
      personaMode: 'improved' as CardPersonaMode,
      privacy: {
        ...DEFAULT_SHARE_PRIVACY,
        maskFinances: false,
      },
    };

    expect(customConfig.theme).toBe('emerald');
    expect(customConfig.format).toBe('svg');
    expect(customConfig.privacy.maskFinances).toBe(false);
  });
});
