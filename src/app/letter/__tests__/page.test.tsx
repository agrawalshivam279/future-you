import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LetterPage from '../page';
import { useLifeModelStore } from '@/stores/life-model-store';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { mockLifeModel, mockCurrentPersona, mockImprovedPersona } from '@/app/dashboard/__tests__/fixtures';

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
    letter: 'Current Path Letter: Stay aware of where drift leads.',
  },
  improvedPath: {
    ...mockImprovedPersona,
    letter: 'Improved Path Letter: Deliberate daily compounding transformed everything.',
  },
};

describe('LetterPage Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    useLifeModelStore.setState({ model: null });
    useOnboardingStore.setState({ isCompleted: false });
  });

  it('renders empty state card when life model is absent', () => {
    render(<LetterPage />);

    expect(screen.getByTestId('empty-letter-card')).toBeInTheDocument();
    expect(screen.getByText('No Letters Yet')).toBeInTheDocument();

    const onboardingButton = screen.getByRole('button', { name: 'Begin Onboarding' });
    fireEvent.click(onboardingButton);
    expect(mockPush).toHaveBeenCalledWith('/onboarding');
  });

  it('renders Improved Path letter by default when model is present', () => {
    useLifeModelStore.setState({ model: testModel });

    render(<LetterPage />);

    expect(screen.getByText('Letter From Future Self')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'View Improved Path letter' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(
      screen.getByText(/Deliberate daily compounding transformed everything/i)
    ).toBeInTheDocument();
  });

  it('honors ?persona=current query parameter on initial load', () => {
    useLifeModelStore.setState({ model: testModel });
    mockSearchParams = new URLSearchParams({ persona: 'current' });

    render(<LetterPage />);

    expect(screen.getByRole('tab', { name: 'View Current Path letter' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(
      screen.getByText(/Stay aware of where drift leads/i)
    ).toBeInTheDocument();
  });

  it('switches between persona tabs and syncs URL without reload', () => {
    useLifeModelStore.setState({ model: testModel });

    render(<LetterPage />);

    // Default is improved
    expect(
      screen.getByText(/Deliberate daily compounding transformed everything/i)
    ).toBeInTheDocument();

    // Click Current Path tab
    const currentTab = screen.getByRole('tab', { name: 'View Current Path letter' });
    fireEvent.click(currentTab);

    expect(mockReplace).toHaveBeenCalledWith('/letter?persona=current', {
      scroll: false,
    });
    expect(
      screen.getByText(/Stay aware of where drift leads/i)
    ).toBeInTheDocument();

    // Click Improved Path tab
    const improvedTab = screen.getByRole('tab', { name: 'View Improved Path letter' });
    fireEvent.click(improvedTab);

    expect(mockReplace).toHaveBeenCalledWith('/letter?persona=improved', {
      scroll: false,
    });
    expect(
      screen.getByText(/Deliberate daily compounding transformed everything/i)
    ).toBeInTheDocument();
  });

  it('navigates back to dashboard when clicking Dashboard button', () => {
    useLifeModelStore.setState({ model: testModel });

    render(<LetterPage />);

    const dashboardButton = screen.getByRole('button', { name: 'Return to Dashboard' });
    fireEvent.click(dashboardButton);
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to persona chat when clicking Talk button', () => {
    useLifeModelStore.setState({ model: testModel });

    render(<LetterPage />);

    const chatButton = screen.getByRole('button', {
      name: `Chat with ${testModel.improvedPath.name}`,
    });
    fireEvent.click(chatButton);
    expect(mockPush).toHaveBeenCalledWith('/chat?persona=improved');
  });
});
