import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GoalListBuilder } from '../goal-list-builder';

describe('GoalListBuilder Component', () => {
  const mockOnAdd = jest.fn();
  const mockOnRemove = jest.fn();

  const defaultProps = {
    id: 'test-builder',
    label: 'Test Goals',
    description: 'Enter your test goals',
    placeholder: 'e.g. My goal',
    goals: ['Existing Goal 1', 'Existing Goal 2'],
    suggestions: ['Suggestion 1', 'Suggestion 2'],
    onAddGoal: mockOnAdd,
    onRemoveGoal: mockOnRemove,
    inputAriaLabel: 'Add test goal',
    buttonAriaLabel: 'Add test goal to list',
    removeAriaLabelPrefix: 'Remove test goal',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label, description, input, and existing goals', () => {
    render(<GoalListBuilder {...defaultProps} />);

    expect(screen.getByText('Test Goals')).toBeInTheDocument();
    expect(screen.getByText('Enter your test goals')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. My goal')).toBeInTheDocument();
    expect(screen.getByText('Existing Goal 1')).toBeInTheDocument();
    expect(screen.getByText('Existing Goal 2')).toBeInTheDocument();
  });

  it('calls onAddGoal when clicking add button and clears input', () => {
    render(<GoalListBuilder {...defaultProps} />);

    const input = screen.getByLabelText('Add test goal');
    const addBtn = screen.getByRole('button', { name: 'Add test goal to list' });

    fireEvent.change(input, { target: { value: 'New Custom Goal' } });
    fireEvent.click(addBtn);

    expect(mockOnAdd).toHaveBeenCalledWith('New Custom Goal');
    expect(input).toHaveValue('');
  });

  it('calls onAddGoal when clicking suggestion chip', () => {
    render(<GoalListBuilder {...defaultProps} />);

    const chip = screen.getByRole('button', {
      name: 'Add suggested test goals: Suggestion 1',
    });
    fireEvent.click(chip);

    expect(mockOnAdd).toHaveBeenCalledWith('Suggestion 1');
  });

  it('calls onRemoveGoal when clicking remove button on badge', () => {
    render(<GoalListBuilder {...defaultProps} />);

    const removeBtn = screen.getByRole('button', {
      name: 'Remove test goal: Existing Goal 1',
    });
    fireEvent.click(removeBtn);

    expect(mockOnRemove).toHaveBeenCalledWith(0);
  });
});
