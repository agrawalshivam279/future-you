'use client';

import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HONESTY_DISCLAIMER } from '@/lib/constants';

export interface ErrorBoundaryProps {
  /** Child tree guarded by the error boundary */
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Client-side React ErrorBoundary wrapping page-level views to prevent unhandled
 * rendering exceptions from crashing the entire application shell.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected rendering error occurred.',
    };
  }

  handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  handleGoHome = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex-1 flex items-center justify-center px-4 py-16 bg-bg-primary text-text-primary"
        >
          <Card className="max-w-md w-full p-8 text-center space-y-5 border-border-primary">
            <div className="w-12 h-12 rounded-full bg-accent-danger/10 text-accent-danger flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text-primary">
                Something went wrong
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                {this.state.errorMessage}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                variant="primary"
                onClick={this.handleReset}
                leftIcon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
                aria-label="Try recovering view"
                className="w-full sm:w-auto"
              >
                Try Again
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={this.handleGoHome}
                leftIcon={<Home className="w-4 h-4" aria-hidden="true" />}
                aria-label="Return to home page"
                className="w-full sm:w-auto"
              >
                Return Home
              </Button>
            </div>

            <p className="text-[11px] text-text-tertiary pt-2 border-t border-border-primary/50">
              {HONESTY_DISCLAIMER}
            </p>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
