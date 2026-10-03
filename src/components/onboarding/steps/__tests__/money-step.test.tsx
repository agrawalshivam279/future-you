import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MoneyStep } from '../money-step';
import { useOnboardingStore } from '@/stores';

describe('MoneyStep Component', () => {
  beforeEach(() => {
    useOnboardingStore.getState().resetOnboarding();
  });

  it('renders all financial sections and controls', () => {
    render(<MoneyStep />);

    expect(screen.getByText('Current Annual Income Bracket')).toBeInTheDocument();
    expect(screen.getByText('Monthly Savings & Investment Rate')).toBeInTheDocument();
    expect(screen.getByText('Current Debt Burden')).toBeInTheDocument();
    expect(screen.getByText('Spending Habits & Discipline')).toBeInTheDocument();
    expect(screen.getByText('Primary 5-Year Financial Target')).toBeInTheDocument();
  });

  it('updates income bracket when option clicked', () => {
    render(<MoneyStep />);

    const incomeBtn = screen.getByRole('radio', { name: '$60k - $100k' });
    fireEvent.click(incomeBtn);

    expect(useOnboardingStore.getState().money.incomeRange).toBe('$60k - $100k');
    expect(incomeBtn).toHaveAttribute('aria-checked', 'true');
  });

  it('updates savings rate when slider changes and displays dynamic note', () => {
    render(<MoneyStep />);

    const savingsSlider = screen.getByLabelText('Monthly savings and investment rate percentage');
    fireEvent.change(savingsSlider, { target: { value: '35' } });

    expect(useOnboardingStore.getState().money.savingsRate).toBe(35);
    expect(
      screen.getByText('Strong wealth accumulator, rapid asset compounding')
    ).toBeInTheDocument();
  });

  it('updates debt level when option clicked', () => {
    render(<MoneyStep />);

    const moderateDebtBtn = screen.getByRole('radio', { name: /moderate/i });
    fireEvent.click(moderateDebtBtn);

    expect(useOnboardingStore.getState().money.debtLevel).toBe('moderate');
    expect(moderateDebtBtn).toHaveAttribute('aria-checked', 'true');
  });

  it('updates spending habits when option clicked', () => {
    render(<MoneyStep />);

    const habitsBtn = screen.getByRole('radio', { name: /balanced & conscious/i });
    fireEvent.click(habitsBtn);

    expect(useOnboardingStore.getState().money.spendingHabits).toBe('Balanced & Conscious');
    expect(habitsBtn).toHaveAttribute('aria-checked', 'true');
  });

  it('updates financial goal through text input', () => {
    render(<MoneyStep />);

    const goalInput = screen.getByLabelText(/primary 5-year financial milestone target/i);
    fireEvent.change(goalInput, { target: { value: 'Save $50k down payment' } });

    expect(useOnboardingStore.getState().money.financialGoal).toBe('Save $50k down payment');
  });

  it('updates financial goal when clicking quick suggestion chip', () => {
    render(<MoneyStep />);

    const chip = screen.getByRole('button', { name: /\+ become 100% debt-free/i });
    fireEvent.click(chip);

    expect(useOnboardingStore.getState().money.financialGoal).toBe('Become 100% debt-free');
  });
});
