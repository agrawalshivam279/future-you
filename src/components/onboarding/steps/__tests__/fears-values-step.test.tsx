import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FearsValuesStep } from '../fears-values-step';
import { useOnboardingStore } from '@/stores';

describe('FearsValuesStep Component', () => {
  beforeEach(() => {
    useOnboardingStore.getState().resetOnboarding();
  });

  it('renders all fears and values sections and controls', () => {
    render(<FearsValuesStep />);

    expect(screen.getByText('Primary Anxieties & Potential Regrets')).toBeInTheDocument();
    expect(screen.getByText('Non-Negotiable Core Values')).toBeInTheDocument();
    expect(
      screen.getByText('Past Choices, Habits, or Unaddressed Regrets')
    ).toBeInTheDocument();
    expect(screen.getByText('Core Motivational Drive')).toBeInTheDocument();
    expect(screen.getByText('Appetite for Risk (1–10)')).toBeInTheDocument();
  });

  it('adds and removes biggest fears', () => {
    render(<FearsValuesStep />);

    const chip = screen.getByRole('button', {
      name: /add suggested primary anxieties & potential regrets: unrealized potential & stagnation/i,
    });
    fireEvent.click(chip);

    expect(useOnboardingStore.getState().fearsAndValues.biggestFears).toContain(
      'Unrealized Potential & Stagnation'
    );

    const removeBtn = screen.getByRole('button', {
      name: /remove fear: unrealized potential & stagnation/i,
    });
    fireEvent.click(removeBtn);

    expect(useOnboardingStore.getState().fearsAndValues.biggestFears).not.toContain(
      'Unrealized Potential & Stagnation'
    );
  });

  it('adds and removes core values', () => {
    render(<FearsValuesStep />);

    const chip = screen.getByRole('button', {
      name: /add suggested non-negotiable core values: autonomy & creative freedom/i,
    });
    fireEvent.click(chip);

    expect(useOnboardingStore.getState().fearsAndValues.coreValues).toContain(
      'Autonomy & Creative Freedom'
    );

    const removeBtn = screen.getByRole('button', {
      name: /remove core value: autonomy & creative freedom/i,
    });
    fireEvent.click(removeBtn);

    expect(useOnboardingStore.getState().fearsAndValues.coreValues).not.toContain(
      'Autonomy & Creative Freedom'
    );
  });

  it('updates regrets reflection through textarea', () => {
    render(<FearsValuesStep />);

    const textarea = screen.getByLabelText(/reflective regrets and patterns to break/i);
    fireEvent.change(textarea, {
      target: { value: 'Stayed in a comfort zone for too long.' },
    });

    expect(useOnboardingStore.getState().fearsAndValues.regrets).toBe(
      'Stayed in a comfort zone for too long.'
    );
  });

  it('updates motivation type when option clicked', () => {
    render(<FearsValuesStep />);

    const internalBtn = screen.getByRole('radio', { name: /internal \/ intrinsic/i });
    fireEvent.click(internalBtn);

    expect(useOnboardingStore.getState().fearsAndValues.motivation).toBe('internal');
    expect(internalBtn).toHaveAttribute('aria-checked', 'true');
  });

  it('updates risk tolerance rating and displays dynamic note', () => {
    render(<FearsValuesStep />);

    const slider = screen.getByLabelText(/appetite for risk rating from 1 to 10/i);
    fireEvent.change(slider, { target: { value: '8' } });

    expect(useOnboardingStore.getState().fearsAndValues.riskTolerance).toBe(8);
    expect(
      screen.getByText('Bold explorer: Embraces uncertainty for asymmetrical upside')
    ).toBeInTheDocument();
  });
});
