import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../page';
import { useSettingsStore } from '@/stores/settings-store';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useLifeModelStore } from '@/stores/life-model-store';
import { mockLifeModel } from '@/app/dashboard/__tests__/fixtures';
import { HONESTY_DISCLAIMER } from '@/lib/constants';

describe('HomePage Landing View', () => {
  beforeEach(() => {
    // Reset all stores to baseline defaults
    useLifeModelStore.setState({ model: null });
    useOnboardingStore.setState({
      currentStep: 1,
      isCompleted: false,
      name: '',
    });
    useSettingsStore.setState({
      provider: 'openai',
      apiKey: '',
    });
  });

  it('renders the main reflection headline and ambient background', () => {
    render(<HomePage />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/meet the person you're becoming/i);
    expect(screen.getByTestId('ambient-background')).toBeInTheDocument();
  });

  it('renders API key warning banner when no key is configured', () => {
    render(<HomePage />);

    expect(screen.getByTestId('api-key-warning-banner')).toBeInTheDocument();
    expect(
      screen.getByText(/No API key configured for openai/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /configure api key in settings/i })
    ).toHaveAttribute('href', '/settings');
  });

  it('renders AI ready indicator when API key is configured', () => {
    useSettingsStore.setState({ apiKey: 'sk-test-key-123' });

    render(<HomePage />);

    expect(screen.queryByTestId('api-key-warning-banner')).not.toBeInTheDocument();
    expect(screen.getByTestId('api-key-ready-pill')).toHaveTextContent(
      /AI Provider Configured/i
    );
  });

  it('renders first-time visitor CTAs linking to onboarding and settings', () => {
    render(<HomePage />);

    const beginLink = screen.getByRole('link', { name: /begin onboarding flow/i });
    expect(beginLink).toBeInTheDocument();
    expect(beginLink).toHaveAttribute('href', '/onboarding');
    expect(beginLink).toHaveTextContent(/begin journey/i);

    const settingsLink = screen.getByRole('link', { name: /open settings/i });
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });

  it('renders in-progress onboarding CTA and badge when user has started onboarding', () => {
    useOnboardingStore.setState({ currentStep: 3, name: 'Taylor' });

    render(<HomePage />);

    expect(screen.getByTestId('onboarding-progress-badge')).toHaveTextContent(
      /Onboarding in Progress \(Step 3 of 6\)/i
    );

    const continueLink = screen.getByRole('link', {
      name: /continue onboarding step 3/i,
    });
    expect(continueLink).toBeInTheDocument();
    expect(continueLink).toHaveAttribute('href', '/onboarding');
    expect(continueLink).toHaveTextContent(/continue onboarding \(step 3\)/i);
  });

  it('renders simulation completed state with View Your Futures CTA when model exists', () => {
    useLifeModelStore.setState({ model: mockLifeModel });

    render(<HomePage />);

    expect(screen.getByTestId('simulation-active-badge')).toHaveTextContent(
      /5-Year Simulation Active/i
    );

    const viewFuturesLink = screen.getByRole('link', {
      name: /view your simulated futures dashboard/i,
    });
    expect(viewFuturesLink).toBeInTheDocument();
    expect(viewFuturesLink).toHaveAttribute('href', '/dashboard');
    expect(viewFuturesLink).toHaveTextContent(/view your futures/i);

    const newSimLink = screen.getByRole('link', {
      name: /start new simulation onboarding/i,
    });
    expect(newSimLink).toBeInTheDocument();
    expect(newSimLink).toHaveAttribute('href', '/onboarding');
  });

  it('renders core feature pillars and capabilities', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('region', { name: 'Core Capabilities' })
    ).toBeInTheDocument();
    expect(screen.getByText('Two Simulated Futures')).toBeInTheDocument();
    expect(screen.getByText('Compounding Habit Levers')).toBeInTheDocument();
    expect(screen.getByText('Letters & Voice Narration')).toBeInTheDocument();
    expect(screen.getByText('100% Private & Local-First')).toBeInTheDocument();
  });

  it('displays the honesty reflection disclaimer', () => {
    render(<HomePage />);

    expect(screen.getByText(new RegExp(HONESTY_DISCLAIMER, 'i'))).toBeInTheDocument();
  });
});
