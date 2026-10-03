import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenerationErrorCard } from '../generation-error-card';

describe('GenerationErrorCard Component', () => {
  it('renders generic error message and recovery buttons', () => {
    const onRetry = jest.fn();
    const onBack = jest.fn();

    render(
      <GenerationErrorCard
        error="Failed to connect to simulation engine"
        onRetry={onRetry}
        onBackToOnboarding={onBack}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Generation Paused')).toBeInTheDocument();
    expect(
      screen.getByText('Failed to connect to simulation engine')
    ).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /retry generation/i });
    const backBtn = screen.getByRole('button', { name: /return to onboarding wizard/i });

    expect(retryBtn).toBeInTheDocument();
    expect(backBtn).toBeInTheDocument();

    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);

    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders API configuration guidance when error references API key', () => {
    render(
      <GenerationErrorCard
        error="Invalid API key provided for OpenAI provider."
        onRetry={jest.fn()}
        onBackToOnboarding={jest.fn()}
      />
    );

    expect(screen.getByText('API Configuration Tip:')).toBeInTheDocument();
    expect(
      screen.getByText(/Future You runs entirely client-side/i)
    ).toBeInTheDocument();
  });

  it('disables buttons when isRetrying is true', () => {
    render(
      <GenerationErrorCard
        error="Something broke"
        onRetry={jest.fn()}
        onBackToOnboarding={jest.fn()}
        isRetrying={true}
      />
    );

    const retryBtn = screen.getByRole('button', { name: /retry generation/i });
    const backBtn = screen.getByRole('button', { name: /return to onboarding wizard/i });

    expect(retryBtn).toBeDisabled();
    expect(backBtn).toBeDisabled();
  });
});
