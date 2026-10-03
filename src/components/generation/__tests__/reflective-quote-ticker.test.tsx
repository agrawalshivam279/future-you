import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ReflectiveQuoteTicker } from '../reflective-quote-ticker';

describe('ReflectiveQuoteTicker Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders initial quote with polite aria-live announcement', () => {
    render(<ReflectiveQuoteTicker />);

    const container = screen.getByTestId('reflective-quote-ticker');
    expect(container).toHaveAttribute('aria-live', 'polite');
    expect(
      screen.getByText(/Your future self is not a stranger/i)
    ).toBeInTheDocument();
  });

  it('cycles through quotes after interval', () => {
    render(<ReflectiveQuoteTicker intervalMs={3000} />);

    expect(
      screen.getByText(/Your future self is not a stranger/i)
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.getByText(/We do not forecast an immutable destiny/i)
    ).toBeInTheDocument();
  });
});
