import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import GenerationPage from '../page';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useGenerationPipeline } from '@/hooks/use-generation-pipeline';
import { HONESTY_DISCLAIMER } from '@/lib/constants';

jest.mock('@/hooks/use-generation-pipeline');

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/generate',
  useSearchParams: () => new URLSearchParams(),
}));

const mockUseGenerationPipeline = useGenerationPipeline as jest.MockedFunction<
  typeof useGenerationPipeline
>;

describe('GenerationPage Route Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useOnboardingStore.setState({
      name: 'Casey',
      age: 28,
      isCompleted: true,
    });

    mockUseGenerationPipeline.mockReturnValue({
      status: 'generating',
      isGenerating: true,
      progress: {
        stage: 'personas',
        label: 'Persona Development',
        description: 'Synthesizing dual personas...',
        progressPercent: 40,
        stageIndex: 2,
        totalStages: 5,
      },
      error: null,
      model: null,
      startGeneration: jest.fn(),
      cancelGeneration: jest.fn(),
      retry: jest.fn(),
    });
  });

  it('redirects to /onboarding if user has not entered a name or onboarding is empty', () => {
    useOnboardingStore.setState({
      name: '',
      age: 0,
      isCompleted: false,
    });

    render(<GenerationPage />);

    expect(mockReplace).toHaveBeenCalledWith('/onboarding');
  });

  it('renders header, stepper, quote ticker, and honesty disclaimer when onboarding is valid', () => {
    render(<GenerationPage />);

    expect(
      screen.getByText('Synthesizing Your Future Trajectories')
    ).toBeInTheDocument();
    expect(screen.getByTestId('generation-stepper')).toBeInTheDocument();
    expect(screen.getByTestId('reflective-quote-ticker')).toBeInTheDocument();
    expect(screen.getByText(HONESTY_DISCLAIMER)).toBeInTheDocument();
  });

  it('renders error card when generation pipeline status is error', () => {
    mockUseGenerationPipeline.mockReturnValue({
      status: 'error',
      isGenerating: false,
      progress: {
        stage: 'personas',
        label: 'Persona Development',
        description: 'Failed to synthesize',
        progressPercent: 40,
        stageIndex: 2,
        totalStages: 5,
      },
      error: 'AI Provider Rate Limit Exceeded',
      model: null,
      startGeneration: jest.fn(),
      cancelGeneration: jest.fn(),
      retry: jest.fn(),
    });

    render(<GenerationPage />);

    expect(screen.getByTestId('generation-error-card')).toBeInTheDocument();
    expect(
      screen.getByText('AI Provider Rate Limit Exceeded')
    ).toBeInTheDocument();
  });

  it('navigates to /onboarding when user clicks Edit Onboarding from error card', () => {
    mockUseGenerationPipeline.mockReturnValue({
      status: 'error',
      isGenerating: false,
      progress: null,
      error: 'Generation halted',
      model: null,
      startGeneration: jest.fn(),
      cancelGeneration: jest.fn(),
      retry: jest.fn(),
    });

    render(<GenerationPage />);

    const editBtn = screen.getByRole('button', { name: /return to onboarding wizard/i });
    fireEvent.click(editBtn);

    expect(mockPush).toHaveBeenCalledWith('/onboarding');
  });

  it('navigates to /dashboard when onComplete callback is triggered by the pipeline', () => {
    let onCompleteHandler: (() => void) | undefined;

    mockUseGenerationPipeline.mockImplementation((options) => {
      onCompleteHandler = options?.onComplete as any;
      return {
        status: 'generating',
        isGenerating: true,
        progress: null,
        error: null,
        model: null,
        startGeneration: jest.fn(),
        cancelGeneration: jest.fn(),
        retry: jest.fn(),
      };
    });

    render(<GenerationPage />);

    act(() => {
      onCompleteHandler?.();
    });

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});
