import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DecisionForm } from '../decision-form';
import { DECISION_PRESETS } from '@/stores/decision-store';

describe('DecisionForm Component', () => {
  it('renders all core form sections and inputs', () => {
    render(<DecisionForm />);

    expect(screen.getByRole('heading', { name: /Simulate a Life Decision/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Decision Title/i)).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /Primary Impact Domain/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /Implementation Horizon/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Context, Risks & Motivation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Simulate Decision/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear decision form fields/i })).toBeInTheDocument();
  });

  it('renders preset template exploration buttons', () => {
    render(<DecisionForm />);

    DECISION_PRESETS.forEach((preset) => {
      expect(screen.getByRole('button', { name: new RegExp(`Apply preset: ${preset.title}`, 'i') })).toBeInTheDocument();
    });
  });

  it('populates form inputs when clicking a preset template', () => {
    render(<DecisionForm />);

    const targetPreset = DECISION_PRESETS[0];
    const presetBtn = screen.getByRole('button', { name: new RegExp(`Apply preset: ${targetPreset.title}`, 'i') });
    fireEvent.click(presetBtn);

    const titleInput = screen.getByLabelText(/Decision Title/i) as HTMLInputElement;
    const descTextarea = screen.getByLabelText(/Context, Risks & Motivation/i) as HTMLTextAreaElement;

    expect(titleInput.value).toBe(targetPreset.title);
    expect(descTextarea.value).toBe(targetPreset.description);
    expect(presetBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('enforces validation disabling submit when inputs are too short', () => {
    render(<DecisionForm />);

    const submitBtn = screen.getByRole('button', { name: /Simulate Decision/i });
    expect(submitBtn).toBeDisabled();

    const titleInput = screen.getByLabelText(/Decision Title/i);
    const descTextarea = screen.getByLabelText(/Context, Risks & Motivation/i);

    // Title too short
    fireEvent.change(titleInput, { target: { value: 'Hi' } });
    fireEvent.change(descTextarea, { target: { value: 'Long description that passes the validation test.' } });
    expect(submitBtn).toBeDisabled();

    // Valid title and description
    fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
    expect(submitBtn).toBeEnabled();
  });

  it('calls onSubmit with typed scenario payload when submitted', () => {
    const handleSubmit = jest.fn();
    render(<DecisionForm onSubmit={handleSubmit} />);

    // Select domain
    const financesBtn = screen.getByRole('button', { name: /Select domain Finances/i });
    fireEvent.click(financesBtn);

    // Select horizon
    const longTermBtn = screen.getByRole('button', { name: /Select horizon Long-term/i });
    fireEvent.click(longTermBtn);

    // Enter title & description
    const titleInput = screen.getByLabelText(/Decision Title/i);
    const descTextarea = screen.getByLabelText(/Context, Risks & Motivation/i);

    fireEvent.change(titleInput, { target: { value: 'Buying First Home' } });
    fireEvent.change(descTextarea, {
      target: { value: 'Taking on a mortgage with high interest rates to establish roots.' },
    });

    const submitBtn = screen.getByRole('button', { name: /Simulate Decision/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      title: 'Buying First Home',
      primaryDomain: 'finances',
      timeHorizon: '1year',
      description: 'Taking on a mortgage with high interest rates to establish roots.',
    });
  });

  it('disables inputs and buttons when isLoading is true', () => {
    render(<DecisionForm isLoading={true} />);

    expect(screen.getByLabelText(/Decision Title/i)).toBeDisabled();
    expect(screen.getByLabelText(/Context, Risks & Motivation/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /Simulate Decision/i })).toBeDisabled();
  });

  it('clears form inputs when clicking Clear button', () => {
    render(<DecisionForm />);

    const titleInput = screen.getByLabelText(/Decision Title/i) as HTMLInputElement;
    const descTextarea = screen.getByLabelText(/Context, Risks & Motivation/i) as HTMLTextAreaElement;

    fireEvent.change(titleInput, { target: { value: 'Temporary Title' } });
    fireEvent.change(descTextarea, { target: { value: 'Temporary detailed description text.' } });

    expect(titleInput.value).toBe('Temporary Title');
    expect(descTextarea.value).toBe('Temporary detailed description text.');

    const clearBtn = screen.getByRole('button', { name: /Clear decision form fields/i });
    fireEvent.click(clearBtn);

    expect(titleInput.value).toBe('');
    expect(descTextarea.value).toBe('');
  });
});
