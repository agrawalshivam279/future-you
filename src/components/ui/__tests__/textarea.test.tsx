import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Textarea } from '../textarea';

describe('Textarea Primitive', () => {
  it('renders textarea with label and accepts multiline input', () => {
    const handleChange = jest.fn();
    render(<Textarea label="Daily Reflections" onChange={handleChange} />);

    const textarea = screen.getByLabelText(/daily reflections/i);
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: 'Line 1\nLine 2' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders error message and marks aria-invalid when error is present', () => {
    render(<Textarea label="Goals" error="Please enter at least one goal" />);

    const textarea = screen.getByLabelText(/goals/i);
    expect(textarea).toHaveAttribute('aria-invalid', 'true');

    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent(/please enter at least one goal/i);
  });

  it('renders helper text properly', () => {
    render(<Textarea label="Dream Life" helperText="Describe your ideal future in 2-3 sentences" />);
    expect(screen.getByText(/describe your ideal future/i)).toBeInTheDocument();
  });

  it('handles disabled state properly', () => {
    render(<Textarea label="Locked Note" disabled />);
    expect(screen.getByLabelText(/locked note/i)).toBeDisabled();
  });
});
