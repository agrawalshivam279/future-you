import React from 'react';
import { render, screen } from '@testing-library/react';
import { GenerationStepper } from '../generation-stepper';
import { PipelineProgress } from '@/lib/ai/generate-pipeline';

describe('GenerationStepper Component', () => {
  it('renders default initializing state when progress is null', () => {
    render(<GenerationStepper progress={null} />);

    expect(screen.getByTestId('generation-stepper')).toBeInTheDocument();
    expect(screen.getByText('Stage 1 of 5')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('Initializing Simulation...')).toBeInTheDocument();

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  it('renders active progress stage and percentage', () => {
    const progress: PipelineProgress = {
      stage: 'timelines',
      label: 'Timeline Projection',
      description: 'Projecting 1, 3, and 5-year chronological markers',
      progressPercent: 60,
      stageIndex: 3,
      totalStages: 5,
    };

    render(<GenerationStepper progress={progress} />);

    expect(screen.getByText('Stage 3 of 5')).toBeInTheDocument();
    expect(screen.getByTestId('progress-percent')).toHaveTextContent('60%');
    expect(screen.getByRole('heading', { level: 2, name: 'Timeline Projection' })).toBeInTheDocument();
    expect(screen.getAllByText('Timeline Projection')).toHaveLength(2);
    expect(
      screen.getAllByText('Projecting 1, 3, and 5-year chronological markers')
    ).toHaveLength(2);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '60');
  });

  it('marks earlier stages as completed and active stage as in progress', () => {
    const progress: PipelineProgress = {
      stage: 'letters',
      label: 'Letters From Future Self',
      description: 'Drafting letters...',
      progressPercent: 80,
      stageIndex: 4,
      totalStages: 5,
    };

    render(<GenerationStepper progress={progress} />);

    // Stages 1, 2, 3 should have completed markers
    expect(screen.getByLabelText('Baseline Synthesis completed')).toBeInTheDocument();
    expect(screen.getByLabelText('Persona Development completed')).toBeInTheDocument();
    expect(screen.getByLabelText('Timeline Projection completed')).toBeInTheDocument();

    // Stage 4 should have in progress marker
    expect(screen.getByLabelText('Letters From Future Self in progress')).toBeInTheDocument();

    // Stage 5 should have pending marker
    expect(screen.getByLabelText('Reflective Insights pending')).toBeInTheDocument();
  });

  it('renders complete state header when generation finishes', () => {
    const progress: PipelineProgress = {
      stage: 'complete',
      label: 'Generation Complete',
      description: 'Simulation ready.',
      progressPercent: 100,
      stageIndex: 5,
      totalStages: 5,
    };

    render(<GenerationStepper progress={progress} />);

    expect(screen.getByText('Synthesis Complete')).toBeInTheDocument();
    expect(screen.getByTestId('progress-percent')).toHaveTextContent('100%');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });
});
