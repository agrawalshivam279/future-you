import React from 'react';
import { render, screen } from '@testing-library/react';
import { ShareableCard } from '../shareable-card';
import {
  ShareCardConfig,
  ShareCardData,
  DEFAULT_SHARE_CONFIG,
} from '@/types/share.types';

const mockCardData: ShareCardData = {
  primaryGoal: 'Architect high-leverage AI systems and achieve deep calm',
  improvedHeadline: 'Staff Engineer leading autonomy initiatives with balanced habits',
  improvedQuote: 'The small daily boundaries you set became the foundation for everything.',
  currentHeadline: 'Overworked Senior Developer juggling reactive firefighting',
  alignmentScore: 84,
  habits: [
    { label: 'Deep Work', baseline: '10 hrs/wk', target: '25 hrs/wk', isFinancial: false },
    { label: 'Monthly Savings', baseline: '$800', target: '$2,500', isFinancial: true },
  ],
  anxieties: ['Fear of missing out on early opportunities', 'Imposter syndrome in leadership'],
  generatedAt: '2026-10-06T00:00:00.000Z',
};

describe('ShareableCard Component', () => {
  it('renders card preview with primary goal and mandatory reflection disclaimer', () => {
    render(<ShareableCard data={mockCardData} config={DEFAULT_SHARE_CONFIG} />);

    expect(screen.getByRole('region', { name: /shareable result card preview/i })).toBeInTheDocument();
    expect(screen.getByText('Architect high-leverage AI systems and achieve deep calm')).toBeInTheDocument();
    expect(screen.getByText('A reflection tool, not a prediction engine')).toBeInTheDocument();
    expect(screen.getByText('futureyou.app')).toBeInTheDocument();
  });

  it('renders split persona view by default', () => {
    render(<ShareableCard data={mockCardData} config={DEFAULT_SHARE_CONFIG} />);

    expect(screen.getByText(/Improved Path \(Year 5\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Staff Engineer leading autonomy initiatives/i)).toBeInTheDocument();
    expect(screen.getByText(/Current Path \(Year 5\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Overworked Senior Developer juggling/i)).toBeInTheDocument();
  });

  it('honors single persona mode filters', () => {
    const improvedConfig: ShareCardConfig = {
      ...DEFAULT_SHARE_CONFIG,
      personaMode: 'improved',
    };

    const { rerender } = render(<ShareableCard data={mockCardData} config={improvedConfig} />);
    expect(screen.getByText(/Improved Path/i)).toBeInTheDocument();
    expect(screen.queryByText(/Current Path \(Year 5\)/i)).not.toBeInTheDocument();

    const currentConfig: ShareCardConfig = {
      ...DEFAULT_SHARE_CONFIG,
      personaMode: 'current',
    };
    rerender(<ShareableCard data={mockCardData} config={currentConfig} />);
    expect(screen.queryByText(/Improved Path \(Year 5\)/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Current Path/i)).toBeInTheDocument();
  });

  it('masks sensitive finances when maskFinances is true', () => {
    render(<ShareableCard data={mockCardData} config={DEFAULT_SHARE_CONFIG} />);

    // Non-financial habit is visible
    expect(screen.getByText('10 hrs/wk')).toBeInTheDocument();
    expect(screen.getByText('25 hrs/wk')).toBeInTheDocument();

    // Financial values should be masked with bullets
    expect(screen.queryByText('$800')).not.toBeInTheDocument();
    expect(screen.queryByText('$2,500')).not.toBeInTheDocument();
    const maskedElements = screen.getAllByText('••••••');
    expect(maskedElements.length).toBeGreaterThan(0);
  });

  it('reveals financial values when maskFinances is false', () => {
    const unmaskedConfig: ShareCardConfig = {
      ...DEFAULT_SHARE_CONFIG,
      privacy: {
        ...DEFAULT_SHARE_CONFIG.privacy,
        maskFinances: false,
      },
    };

    render(<ShareableCard data={mockCardData} config={unmaskedConfig} />);
    expect(screen.getByText('$800')).toBeInTheDocument();
    expect(screen.getByText('$2,500')).toBeInTheDocument();
  });

  it('masks anxieties by default and shows them only when maskAnxieties is false', () => {
    const { rerender } = render(
      <ShareableCard data={mockCardData} config={DEFAULT_SHARE_CONFIG} />
    );
    expect(screen.queryByText(/Fear of missing out/i)).not.toBeInTheDocument();

    const showAnxietiesConfig: ShareCardConfig = {
      ...DEFAULT_SHARE_CONFIG,
      privacy: {
        ...DEFAULT_SHARE_CONFIG.privacy,
        maskAnxieties: false,
      },
    };
    rerender(<ShareableCard data={mockCardData} config={showAnxietiesConfig} />);
    expect(screen.getByText(/Fear of missing out/i)).toBeInTheDocument();
  });

  it('toggles quote and alignment score visibility via privacy config', () => {
    const hiddenConfig: ShareCardConfig = {
      ...DEFAULT_SHARE_CONFIG,
      privacy: {
        ...DEFAULT_SHARE_CONFIG.privacy,
        includeLetterQuote: false,
        includeAlignmentScore: false,
      },
    };

    render(<ShareableCard data={mockCardData} config={hiddenConfig} />);
    expect(screen.queryByText(/The small daily boundaries/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/84% Aligned/i)).not.toBeInTheDocument();
  });

  it('renders alignment score badge when included', () => {
    render(<ShareableCard data={mockCardData} config={DEFAULT_SHARE_CONFIG} />);
    expect(screen.getByText('84% Aligned')).toBeInTheDocument();
  });

  it('applies theme and aspect ratio class tokens correctly', () => {
    const emeraldLandscapeConfig: ShareCardConfig = {
      ...DEFAULT_SHARE_CONFIG,
      theme: 'emerald',
      aspectRatio: 'landscape',
    };

    render(<ShareableCard data={mockCardData} config={emeraldLandscapeConfig} />);
    const card = screen.getByRole('region', { name: /shareable result card preview/i });
    expect(card.className).toContain('aspect-[16/9]');
    expect(card.className).toContain('bg-[#031d13]');
  });
});
