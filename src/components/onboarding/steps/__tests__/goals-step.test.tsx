import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GoalsStep } from '../goals-step';
import { useOnboardingStore } from '@/stores';

describe('GoalsStep Component', () => {
  beforeEach(() => {
    useOnboardingStore.getState().resetOnboarding();
  });

  it('renders name, age, goal inputs, and dream life textarea', () => {
    render(<GoalsStep />);

    expect(
      screen.getByLabelText(/what should your future selves call you/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/current age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/add short-term goal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/add long-term goal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description of your ideal dream life/i)).toBeInTheDocument();
  });

  it('updates name and age in useOnboardingStore when inputs change', () => {
    render(<GoalsStep />);

    const nameInput = screen.getByLabelText(/what should your future selves call you/i);
    fireEvent.change(nameInput, { target: { value: 'Alex Mercer' } });

    expect(useOnboardingStore.getState().name).toBe('Alex Mercer');

    const ageInput = screen.getByLabelText(/current age/i);
    fireEvent.change(ageInput, { target: { value: '32' } });

    expect(useOnboardingStore.getState().age).toBe(32);
  });

  it('adds short-term goals on enter key and clicking add button', () => {
    render(<GoalsStep />);

    const shortInput = screen.getByLabelText(/add short-term goal/i);
    const addBtn = screen.getByRole('button', { name: /add short term goal to list/i });

    fireEvent.change(shortInput, { target: { value: 'Run 10km weekly' } });
    fireEvent.click(addBtn);

    expect(useOnboardingStore.getState().goals.shortTerm).toContain('Run 10km weekly');
    expect(screen.getByText('Run 10km weekly')).toBeInTheDocument();

    // Add with Enter key
    fireEvent.change(shortInput, { target: { value: 'Read 20 books' } });
    fireEvent.keyDown(shortInput, { key: 'Enter', code: 'Enter' });

    expect(useOnboardingStore.getState().goals.shortTerm).toContain('Read 20 books');
  });

  it('adds goals via suggestion chips', () => {
    render(<GoalsStep />);

    const suggestionBtn = screen.getByRole('button', {
      name: /launch side project/i,
    });
    fireEvent.click(suggestionBtn);

    expect(useOnboardingStore.getState().goals.shortTerm).toContain('Launch side project');
  });

  it('removes goals when clicking delete on goal badge', () => {
    useOnboardingStore.getState().updateGoals({
      shortTerm: ['Goal to keep', 'Goal to remove'],
    });

    render(<GoalsStep />);

    expect(screen.getByText('Goal to remove')).toBeInTheDocument();

    const removeBtn = screen.getByRole('button', {
      name: /remove short-term goal: goal to remove/i,
    });
    fireEvent.click(removeBtn);

    expect(useOnboardingStore.getState().goals.shortTerm).not.toContain('Goal to remove');
    expect(useOnboardingStore.getState().goals.shortTerm).toContain('Goal to keep');
  });

  it('adds and removes long-term goals', () => {
    render(<GoalsStep />);

    const longInput = screen.getByLabelText(/add long-term goal/i);
    const addBtn = screen.getByRole('button', { name: /add long term goal to list/i });

    fireEvent.change(longInput, { target: { value: 'Become Principal Architect' } });
    fireEvent.click(addBtn);

    expect(useOnboardingStore.getState().goals.longTerm).toContain(
      'Become Principal Architect'
    );

    const removeBtn = screen.getByRole('button', {
      name: /remove long-term goal: become principal architect/i,
    });
    fireEvent.click(removeBtn);

    expect(useOnboardingStore.getState().goals.longTerm).not.toContain(
      'Become Principal Architect'
    );
  });

  it('updates dream life vision in store', () => {
    render(<GoalsStep />);

    const dreamLifeTextarea = screen.getByLabelText(
      /description of your ideal dream life/i
    );
    fireEvent.change(dreamLifeTextarea, {
      target: {
        value: 'Living in a quiet mountain cabin with fiber internet and solar energy.',
      },
    });

    expect(useOnboardingStore.getState().goals.dreamLife).toBe(
      'Living in a quiet mountain cabin with fiber internet and solar energy.'
    );
  });
});
