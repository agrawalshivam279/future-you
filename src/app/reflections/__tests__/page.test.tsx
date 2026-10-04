import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReflectionsPage from '../page';
import { useLifeModelStore } from '@/stores/life-model-store';
import { mockLifeModel, mockCurrentPersona, mockImprovedPersona } from '@/app/dashboard/__tests__/fixtures';
import { HONESTY_DISCLAIMER } from '@/lib/constants';

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => mockSearchParams,
}));

const testModel = {
  ...mockLifeModel,
  currentPath: {
    ...mockCurrentPersona,
    regrets: ['Current regret: Waiting for perfection.'],
    gratitudes: ['Current gratitude: Preserved steady friendships.'],
  },
  improvedPath: {
    ...mockImprovedPersona,
    regrets: ['Improved regret: Pushed too hard in year 2.'],
    gratitudes: ['Improved gratitude: Daily consistency compounded.'],
  },
};

describe('ReflectionsPage Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    useLifeModelStore.setState({ model: null });
  });

  it('renders empty state card when life model is absent', () => {
    render(<ReflectionsPage />);

    expect(screen.getByTestId('empty-reflections-card')).toBeInTheDocument();
    expect(screen.getByText('No Reflections Yet')).toBeInTheDocument();

    const onboardingButton = screen.getByRole('button', { name: 'Begin Onboarding' });
    fireEvent.click(onboardingButton);
    expect(mockPush).toHaveBeenCalledWith('/onboarding');
  });

  it('renders Improved Path reflections by default when model is present', () => {
    useLifeModelStore.setState({ model: testModel });

    render(<ReflectionsPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Regrets & Gratitudes' })
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'View Improved Path reflections' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByText('Improved regret: Pushed too hard in year 2.')).toBeInTheDocument();
    expect(screen.getByText('Improved gratitude: Daily consistency compounded.')).toBeInTheDocument();
    expect(screen.getByText(HONESTY_DISCLAIMER)).toBeInTheDocument();
  });

  it('honors ?persona=current query parameter on initial load', () => {
    useLifeModelStore.setState({ model: testModel });
    mockSearchParams = new URLSearchParams({ persona: 'current' });

    render(<ReflectionsPage />);

    expect(screen.getByRole('tab', { name: 'View Current Path reflections' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByText('Current regret: Waiting for perfection.')).toBeInTheDocument();
    expect(screen.getByText('Current gratitude: Preserved steady friendships.')).toBeInTheDocument();
  });

  it('switches between persona tabs and syncs URL without reload', () => {
    useLifeModelStore.setState({ model: testModel });

    render(<ReflectionsPage />);

    // Default is improved
    expect(screen.getByText('Improved regret: Pushed too hard in year 2.')).toBeInTheDocument();

    // Click Current Path tab
    const currentTab = screen.getByRole('tab', { name: 'View Current Path reflections' });
    fireEvent.click(currentTab);

    expect(mockReplace).toHaveBeenCalledWith('/reflections?persona=current', {
      scroll: false,
    });
    expect(screen.getByText('Current regret: Waiting for perfection.')).toBeInTheDocument();

    // Click Improved Path tab
    const improvedTab = screen.getByRole('tab', { name: 'View Improved Path reflections' });
    fireEvent.click(improvedTab);

    expect(mockReplace).toHaveBeenCalledWith('/reflections?persona=improved', {
      scroll: false,
    });
    expect(screen.getByText('Improved regret: Pushed too hard in year 2.')).toBeInTheDocument();
  });

  it('navigates back to dashboard when clicking Dashboard button', () => {
    useLifeModelStore.setState({ model: testModel });

    render(<ReflectionsPage />);

    const dashboardButton = screen.getByRole('button', { name: 'Return to Dashboard' });
    fireEvent.click(dashboardButton);
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to persona letter when clicking Letter button', () => {
    useLifeModelStore.setState({ model: testModel });

    render(<ReflectionsPage />);

    const letterButton = screen.getByRole('button', {
      name: `Read letter from ${testModel.improvedPath.name}`,
    });
    fireEvent.click(letterButton);
    expect(mockPush).toHaveBeenCalledWith('/letter?persona=improved');
  });

  it('navigates to persona chat when clicking Talk button', () => {
    useLifeModelStore.setState({ model: testModel });

    render(<ReflectionsPage />);

    const chatButton = screen.getByRole('button', {
      name: `Chat with ${testModel.improvedPath.name}`,
    });
    fireEvent.click(chatButton);
    expect(mockPush).toHaveBeenCalledWith('/chat?persona=improved');
  });
});
