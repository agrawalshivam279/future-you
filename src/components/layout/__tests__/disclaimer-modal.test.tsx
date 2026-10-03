import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DisclaimerModal, DISCLAIMER_STORAGE_KEY } from '../disclaimer-modal';

describe('DisclaimerModal Layout Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders modal content when isOpen is true', () => {
    render(<DisclaimerModal isOpen={true} onClose={jest.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('A Tool for Reflection, Not Prediction')).toBeInTheDocument();
    expect(screen.getByText(/1\. Thought Experiment, Not Destiny/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. 100% Client-Side Privacy/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Total User Sovereignty/i)).toBeInTheDocument();
  });

  it('does not render dialog when isOpen is false and autoPrompt is false', () => {
    render(<DisclaimerModal isOpen={false} autoPrompt={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('automatically opens for first-time visitor when autoPrompt is true', () => {
    expect(localStorage.getItem(DISCLAIMER_STORAGE_KEY)).toBeNull();

    render(<DisclaimerModal autoPrompt={true} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not open when autoPrompt is true if already acknowledged in localStorage', () => {
    localStorage.setItem(DISCLAIMER_STORAGE_KEY, 'true');

    render(<DisclaimerModal autoPrompt={true} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('persists acknowledgment to localStorage and calls onClose when primary action clicked', () => {
    const handleClose = jest.fn();
    render(<DisclaimerModal isOpen={true} onClose={handleClose} />);

    const confirmBtn = screen.getByRole('button', {
      name: /acknowledge reflection disclaimer and proceed/i,
    });
    expect(confirmBtn).toBeInTheDocument();

    fireEvent.click(confirmBtn);

    expect(localStorage.getItem(DISCLAIMER_STORAGE_KEY)).toBe('true');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
