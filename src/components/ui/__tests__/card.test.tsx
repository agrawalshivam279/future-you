import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../card';

describe('Card Primitive', () => {
  it('renders default card container and children', () => {
    render(<Card data-testid="card-element">Default Card Content</Card>);
    const card = screen.getByTestId('card-element');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('bg-bg-secondary');
  });

  it('renders persona variants with proper accent borders', () => {
    const { rerender } = render(
      <Card variant="current" data-testid="card-persona">
        Current Path
      </Card>
    );
    expect(screen.getByTestId('card-persona')).toHaveClass('border-l-accent-current');

    rerender(
      <Card variant="improved" data-testid="card-persona">
        Improved Path
      </Card>
    );
    expect(screen.getByTestId('card-persona')).toHaveClass('border-l-accent-improved');
  });

  it('applies interactive hover class when isInteractive is true', () => {
    render(
      <Card isInteractive data-testid="card-interactive">
        Interactive Card
      </Card>
    );
    expect(screen.getByTestId('card-interactive')).toHaveClass('hover:border-border-focus');
  });

  it('composes all card subcomponents cleanly', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle as="h2">Card Title Header</CardTitle>
          <CardDescription>Card Description Text</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main body paragraph</p>
        </CardContent>
        <CardFooter>
          <button type="button">Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByRole('heading', { level: 2, name: /card title header/i })).toBeInTheDocument();
    expect(screen.getByText(/card description text/i)).toBeInTheDocument();
    expect(screen.getByText(/main body paragraph/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });
});
