import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ToastProvider, useToast } from '../toast';

function TestConsumer(): React.JSX.Element {
  const { showToast } = useToast();
  return (
    <div>
      <button
        type="button"
        onClick={() => showToast({ title: 'Success Alert', message: 'Life model saved', type: 'success' })}
      >
        Trigger Success Toast
      </button>
      <button
        type="button"
        onClick={() => showToast({ title: 'Error Alert', type: 'error', duration: 1000 })}
      >
        Trigger Error Toast
      </button>
    </div>
  );
}

describe('Toast Primitive & Provider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders a toast notification when triggered', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /trigger success toast/i }));

    expect(screen.getByText('Success Alert')).toBeInTheDocument();
    expect(screen.getByText('Life model saved')).toBeInTheDocument();
  });

  it('auto-dismisses toast after duration expires', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /trigger error toast/i }));
    expect(screen.getByText('Error Alert')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    expect(screen.queryByText('Error Alert')).not.toBeInTheDocument();
  });

  it('allows manual dismissal via close button', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /trigger success toast/i }));
    expect(screen.getByText('Success Alert')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /dismiss notification/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Success Alert')).not.toBeInTheDocument();
  });

  it('throws an error when useToast is used outside of ToastProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    function InvalidComponent() {
      useToast();
      return null;
    }

    expect(() => render(<InvalidComponent />)).toThrow(
      'useToast must be used within a ToastProvider'
    );

    consoleError.mockRestore();
  });
});
