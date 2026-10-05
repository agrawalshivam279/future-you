import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrivacyToggles } from '../privacy-toggles';
import { DEFAULT_SHARE_CONFIG, ShareCardConfig } from '@/types/share.types';

describe('PrivacyToggles Component', () => {
  it('renders with accessibility region and initial config state', () => {
    const handleChange = jest.fn();
    render(<PrivacyToggles config={DEFAULT_SHARE_CONFIG} onChange={handleChange} />);

    expect(
      screen.getByRole('region', { name: /share card customization controls/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/mask financial metrics/i)).toBeChecked();
    expect(screen.getByLabelText(/mask private anxieties/i)).toBeChecked();
  });

  it('triggers onChange when toggling maskFinances checkbox', () => {
    const handleChange = jest.fn();
    render(<PrivacyToggles config={DEFAULT_SHARE_CONFIG} onChange={handleChange} />);

    const financeCheckbox = screen.getByLabelText(/mask financial metrics/i);
    fireEvent.click(financeCheckbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith({
      ...DEFAULT_SHARE_CONFIG,
      privacy: {
        ...DEFAULT_SHARE_CONFIG.privacy,
        maskFinances: false,
      },
    });
  });

  it('triggers onChange when toggling maskAnxieties checkbox', () => {
    const handleChange = jest.fn();
    render(<PrivacyToggles config={DEFAULT_SHARE_CONFIG} onChange={handleChange} />);

    const anxietiesCheckbox = screen.getByLabelText(/mask private anxieties/i);
    fireEvent.click(anxietiesCheckbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith({
      ...DEFAULT_SHARE_CONFIG,
      privacy: {
        ...DEFAULT_SHARE_CONFIG.privacy,
        maskAnxieties: false,
      },
    });
  });

  it('toggles content inclusion buttons with aria-pressed states', () => {
    const handleChange = jest.fn();
    render(<PrivacyToggles config={DEFAULT_SHARE_CONFIG} onChange={handleChange} />);

    const quoteBtn = screen.getByRole('button', { name: /future self quote/i });
    expect(quoteBtn).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(quoteBtn);
    expect(handleChange).toHaveBeenCalledWith({
      ...DEFAULT_SHARE_CONFIG,
      privacy: {
        ...DEFAULT_SHARE_CONFIG.privacy,
        includeLetterQuote: false,
      },
    });

    const alignBtn = screen.getByRole('button', { name: /alignment score/i });
    fireEvent.click(alignBtn);
    expect(handleChange).toHaveBeenCalledWith({
      ...DEFAULT_SHARE_CONFIG,
      privacy: {
        ...DEFAULT_SHARE_CONFIG.privacy,
        includeAlignmentScore: false,
      },
    });
  });

  it('selects card themes and fires onChange with new theme value', () => {
    const handleChange = jest.fn();
    render(<PrivacyToggles config={DEFAULT_SHARE_CONFIG} onChange={handleChange} />);

    const emeraldBtn = screen.getByRole('button', { name: /emerald/i });
    fireEvent.click(emeraldBtn);

    expect(handleChange).toHaveBeenCalledWith({
      ...DEFAULT_SHARE_CONFIG,
      theme: 'emerald',
    });
  });

  it('selects aspect ratio format and fires onChange', () => {
    const handleChange = jest.fn();
    render(<PrivacyToggles config={DEFAULT_SHARE_CONFIG} onChange={handleChange} />);

    const storyBtn = screen.getByRole('button', { name: /story/i });
    fireEvent.click(storyBtn);

    expect(handleChange).toHaveBeenCalledWith({
      ...DEFAULT_SHARE_CONFIG,
      aspectRatio: 'portrait',
    });
  });

  it('selects persona mode focus and fires onChange', () => {
    const handleChange = jest.fn();
    render(<PrivacyToggles config={DEFAULT_SHARE_CONFIG} onChange={handleChange} />);

    const improvedBtn = screen.getByRole('button', { name: /improved only/i });
    fireEvent.click(improvedBtn);

    expect(handleChange).toHaveBeenCalledWith({
      ...DEFAULT_SHARE_CONFIG,
      personaMode: 'improved',
    });
  });
});
