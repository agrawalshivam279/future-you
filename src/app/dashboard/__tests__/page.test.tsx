import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import DashboardPage from '../page';
import { useLifeModelStore } from '@/stores/life-model-store';
import { LifeModel } from '@/types';
import { regenerateFutures } from '@/lib/ai/regenerate-futures';
import { mockCurrentPersona, mockImprovedPersona, mockLifeModel } from './fixtures';

jest.mock('@/lib/ai/regenerate-futures', () => ({
  regenerateFutures: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

describe('DashboardPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLifeModelStore.setState({ model: null });
  });

  it('renders empty state when life model is null', () => {
    render(<DashboardPage />);

    expect(screen.getByTestId('empty-dashboard-card')).toBeInTheDocument();
    expect(screen.getByText('No Simulation Yet')).toBeInTheDocument();

    const onboardingBtn = screen.getByRole('button', { name: 'Begin Onboarding' });
    fireEvent.click(onboardingBtn);
    expect(mockPush).toHaveBeenCalledWith('/onboarding');
  });

  it('renders dashboard with both personas, timeline, and habit levers when loaded', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    render(<DashboardPage />);

    expect(screen.getByText('Your Two Futures')).toBeInTheDocument();
    expect(screen.getByTestId('split-view-container')).toBeInTheDocument();
    expect(screen.getByTestId('dual-timeline')).toBeInTheDocument();
    expect(screen.getByTestId('habit-levers-panel')).toBeInTheDocument();
    expect(screen.getByText('Taylor in 2031 (Current)')).toBeInTheDocument();
    expect(screen.getByText('Taylor in 2031 (Improved)')).toBeInTheDocument();
  });

  it('navigates to settings when Settings button is clicked', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    render(<DashboardPage />);

    const settingsBtn = screen.getByRole('button', { name: 'Settings' });
    fireEvent.click(settingsBtn);
    expect(mockPush).toHaveBeenCalledWith('/settings');
  });

  it('opens regenerate modal and handles cancel and confirmation', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    render(<DashboardPage />);

    const regenerateBtn = screen.getByRole('button', { name: 'Regenerate Futures' });
    fireEvent.click(regenerateBtn);

    expect(screen.getByText('Regenerate Your Futures?')).toBeInTheDocument();

    // Cancel
    const cancelBtn = screen.getByRole('button', { name: 'Cancel regeneration' });
    fireEvent.click(cancelBtn);
    expect(screen.queryByText('Regenerate Your Futures?')).not.toBeInTheDocument();

    // Reopen and confirm
    fireEvent.click(regenerateBtn);
    const confirmBtn = screen.getByRole('button', { name: 'Confirm regeneration' });
    fireEvent.click(confirmBtn);
    expect(mockPush).toHaveBeenCalledWith('/generate');
  });

  it('navigates to chat when clicking Talk to Persona', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    render(<DashboardPage />);

    const chatBtn = screen.getByRole('button', {
      name: `Chat with ${mockCurrentPersona.name}`,
    });
    fireEvent.click(chatBtn);
    expect(mockPush).toHaveBeenCalledWith('/chat?persona=current');
  });

  it('navigates to letter when clicking Letter', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    render(<DashboardPage />);

    const letterBtn = screen.getByRole('button', {
      name: `Read letter from ${mockCurrentPersona.name}`,
    });
    fireEvent.click(letterBtn);
    expect(mockPush).toHaveBeenCalledWith('/letter?persona=current');
  });

  it('navigates to reflections when clicking Reflections', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    render(<DashboardPage />);

    const reflectionsBtn = screen.getByRole('button', {
      name: `View regrets and gratitudes from ${mockCurrentPersona.name}`,
    });
    fireEvent.click(reflectionsBtn);
    expect(mockPush).toHaveBeenCalledWith('/reflections?persona=current');
  });

  it('displays the honesty disclaimer text in footer', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    render(<DashboardPage />);

    expect(
      screen.getByText(/Future You is a reflection tool, not a prediction engine/i)
    ).toBeInTheDocument();
  });

  it('handles habit lever modification and successful futures recalculation', async () => {
    const updatedModel: LifeModel = {
      ...mockLifeModel,
      improvedPath: {
        ...mockImprovedPersona,
        summary: 'Updated improved path with 8.5 hours sleep.',
      },
    };
    (regenerateFutures as jest.Mock).mockResolvedValueOnce(updatedModel);

    useLifeModelStore.setState({ model: mockLifeModel });
    render(<DashboardPage />);

    const sleepSlider = screen.getByRole('slider', { name: /Nightly Sleep/i });
    fireEvent.change(sleepSlider, { target: { value: '8.5' } });

    const applyButton = screen.getByRole('button', { name: /Apply habit changes/i });
    await act(async () => {
      fireEvent.click(applyButton);
    });

    expect(regenerateFutures).toHaveBeenCalledWith(
      mockLifeModel,
      expect.arrayContaining([
        expect.objectContaining({ id: 'sleep-hours', currentValue: 8.5 }),
      ])
    );
    expect(useLifeModelStore.getState().model?.improvedPath.summary).toBe(
      'Updated improved path with 8.5 hours sleep.'
    );
  });

  it('displays error banner when recalculation fails and allows dismissal', async () => {
    (regenerateFutures as jest.Mock).mockRejectedValueOnce(new Error('AI generation rate limit'));

    useLifeModelStore.setState({ model: mockLifeModel });
    render(<DashboardPage />);

    const sleepSlider = screen.getByRole('slider', { name: /Nightly Sleep/i });
    fireEvent.change(sleepSlider, { target: { value: '8.5' } });

    const applyButton = screen.getByRole('button', { name: /Apply habit changes/i });
    await act(async () => {
      fireEvent.click(applyButton);
    });

    expect(screen.getByTestId('recalculation-error-banner')).toBeInTheDocument();
    expect(screen.getByText('AI generation rate limit')).toBeInTheDocument();

    const dismissBtn = screen.getByRole('button', { name: /Dismiss recalculation error/i });
    fireEvent.click(dismissBtn);

    expect(screen.queryByTestId('recalculation-error-banner')).not.toBeInTheDocument();
  });
});
