import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../error-boundary';

function Bomb({ shouldThrow }: { shouldThrow: boolean }): React.JSX.Element {
  if (shouldThrow) {
    throw new Error('Simulated render crash');
  }
  return <div>Recovered safely</div>;
}

describe('ErrorBoundary Component', () => {
  const originalError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('renders children normally when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Recovered safely')).toBeInTheDocument();
  });

  it('catches rendering errors and displays accessible recovery UI', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Simulated render crash')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Try recovering view' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Return to home page' })
    ).toBeInTheDocument();
  });

  it('resets error state when Try Again is clicked', () => {
    let shouldThrow = true;
    function ToggleBomb(): React.JSX.Element {
      if (shouldThrow) {
        throw new Error('Temporary crash');
      }
      return <div>Back online</div>;
    }

    render(
      <ErrorBoundary>
        <ToggleBomb />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    shouldThrow = false;
    fireEvent.click(screen.getByRole('button', { name: 'Try recovering view' }));

    expect(screen.getByText('Back online')).toBeInTheDocument();
  });
});
