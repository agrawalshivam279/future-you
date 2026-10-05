import React from 'react';
import { render, screen } from '@testing-library/react';
import { PersonaVerdicts } from '../persona-verdicts';
import { DecisionPersonaReactions } from '@/types';

const mockReactions: DecisionPersonaReactions = {
  currentPathVerdict:
    'Staying on our current path protects the steady predictability we worked hard to build. Taking this leap could destabilize our emergency fund.',
  improvedPathVerdict:
    'The risk is asymmetric in our favor. If we commit to disciplined execution, the compounding upside far exceeds the temporary discomfort.',
};

describe('PersonaVerdicts Component', () => {
  it('renders section title and explanatory description', () => {
    render(<PersonaVerdicts reactions={mockReactions} />);

    expect(
      screen.getByRole('heading', { name: /Future Selves' Perspectives/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/How your competing future identities perceive the trade-offs of this path/i)
    ).toBeInTheDocument();
  });

  it('renders Current Path perspective card with appropriate badges and quotes', () => {
    render(<PersonaVerdicts reactions={mockReactions} />);

    expect(screen.getByText('Current Path Perspective')).toBeInTheDocument();
    expect(screen.getByText('Status Quo & Risk Preservation')).toBeInTheDocument();
    expect(screen.getByText('Current Self')).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(mockReactions.currentPathVerdict, 'i'))
    ).toBeInTheDocument();

    const currentCard = screen.getByLabelText('Current Path perspective on decision');
    expect(currentCard).toBeInTheDocument();
    expect(currentCard).toHaveClass('border-accent-current/30');
  });

  it('renders Improved Path perspective card with appropriate badges and quotes', () => {
    render(<PersonaVerdicts reactions={mockReactions} />);

    expect(screen.getByText('Improved Path Perspective')).toBeInTheDocument();
    expect(screen.getByText('Compounding Agency & Calculated Risk')).toBeInTheDocument();
    expect(screen.getByText('Improved Self')).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(mockReactions.improvedPathVerdict, 'i'))
    ).toBeInTheDocument();

    const improvedCard = screen.getByLabelText('Improved Path perspective on decision');
    expect(improvedCard).toBeInTheDocument();
    expect(improvedCard).toHaveClass('border-accent-improved/30');
  });

  it('renders fallback copy when verdicts are empty strings', () => {
    render(
      <PersonaVerdicts
        reactions={{
          currentPathVerdict: '',
          improvedPathVerdict: '   ',
        }}
      />
    );

    expect(
      screen.getByText(/No perspective recorded for Current Path\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No perspective recorded for Improved Path\./i)
    ).toBeInTheDocument();
  });

  it('merges custom container className', () => {
    const { container } = render(
      <PersonaVerdicts reactions={mockReactions} className="custom-test-class" />
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-test-class');
  });
});
