import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Slider } from '../slider';

describe('Slider Primitive', () => {
  it('renders label and current value with unit', () => {
    const handleChange = jest.fn();
    render(
      <Slider
        label="Sleep Hours"
        value={7}
        min={4}
        max={12}
        step={0.5}
        unit="hrs"
        onChange={handleChange}
      />
    );

    expect(screen.getByText(/sleep hours/i)).toBeInTheDocument();
    expect(screen.getByText('7 hrs')).toBeInTheDocument();
  });

  it('sets appropriate ARIA value attributes on range input', () => {
    render(
      <Slider
        label="Savings Rate"
        value={20}
        min={0}
        max={50}
        unit="%"
        onChange={jest.fn()}
      />
    );

    const slider = screen.getByRole('slider', { name: /savings rate/i });
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '50');
    expect(slider).toHaveAttribute('aria-valuenow', '20');
  });

  it('calls onChange with parsed number when slider moves', () => {
    const handleChange = jest.fn();
    render(
      <Slider
        label="Study Time"
        value={5}
        min={0}
        max={40}
        onChange={handleChange}
      />
    );

    const slider = screen.getByRole('slider', { name: /study time/i });
    fireEvent.change(slider, { target: { value: '10' } });

    expect(handleChange).toHaveBeenCalledWith(10);
  });

  it('renders persona styling variant without errors', () => {
    const { rerender } = render(
      <Slider
        label="Current Habit"
        value={6}
        min={0}
        max={10}
        variant="current"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByRole('slider')).toBeInTheDocument();

    rerender(
      <Slider
        label="Improved Habit"
        value={8}
        min={0}
        max={10}
        variant="improved"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('respects disabled state', () => {
    render(
      <Slider
        label="Fixed Lever"
        value={5}
        min={0}
        max={10}
        disabled
        onChange={jest.fn()}
      />
    );

    expect(screen.getByRole('slider')).toBeDisabled();
  });
});
