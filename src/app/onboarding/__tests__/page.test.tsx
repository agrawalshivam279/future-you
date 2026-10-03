import React from 'react';
import { render, screen } from '@testing-library/react';
import OnboardingPage from '../page';
import { useOnboardingStore } from '@/stores';

describe('OnboardingPage View', () => {
  beforeEach(() => {
    useOnboardingStore.getState().resetOnboarding();
  });

  it('renders onboarding page layout and wizard scaffold', () => {
    render(<OnboardingPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getAllByText('Goals & Aspirations').length).toBeGreaterThan(0);
    expect(
      screen.getByRole('button', { name: /continue to next step/i })
    ).toBeInTheDocument();
  });
});
