import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SuggestedQuestions } from '../suggested-questions';

describe('SuggestedQuestions Component', () => {
  it('renders Current Path starter questions', () => {
    render(
      <SuggestedQuestions personaId="current" onSelectQuestion={jest.fn()} />
    );

    expect(screen.getByTestId('suggested-questions')).toBeInTheDocument();
    expect(screen.getByText('Conversation Starters')).toBeInTheDocument();
    expect(
      screen.getByText(/What is your biggest daily struggle right now\?/i)
    ).toBeInTheDocument();
  });

  it('renders Improved Path starter questions', () => {
    render(
      <SuggestedQuestions personaId="improved" onSelectQuestion={jest.fn()} />
    );

    expect(
      screen.getByText(/Which daily habit created the biggest compound breakthrough\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/What does a typical fulfilling day look like for you\?/i)
    ).toBeInTheDocument();
  });

  it('calls onSelectQuestion when a starter question is clicked', () => {
    const onSelectMock = jest.fn();
    render(
      <SuggestedQuestions
        personaId="improved"
        onSelectQuestion={onSelectMock}
      />
    );

    const questionBtn = screen.getByRole('button', {
      name: /Which daily habit created the biggest compound breakthrough\?/i,
    });
    fireEvent.click(questionBtn);

    expect(onSelectMock).toHaveBeenCalledTimes(1);
    expect(onSelectMock).toHaveBeenCalledWith(
      'Which daily habit created the biggest compound breakthrough?'
    );
  });

  it('applies custom className', () => {
    render(
      <SuggestedQuestions
        personaId="current"
        onSelectQuestion={jest.fn()}
        className="custom-starters-class"
      />
    );

    expect(screen.getByTestId('suggested-questions')).toHaveClass(
      'custom-starters-class'
    );
  });
});
