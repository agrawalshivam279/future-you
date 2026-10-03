import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Input } from '../input';

describe('Input Primitive', () => {
  it('renders input with label and accepts text entry', () => {
    const handleChange = jest.fn();
    render(<Input label="Your Name" onChange={handleChange} placeholder="Enter name" />);

    const input = screen.getByLabelText(/your name/i);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Shivam' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders error state and sets aria-invalid attribute', () => {
    render(<Input label="Email" error="Invalid email address" />);

    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');

    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent(/invalid email address/i);
  });

  it('renders helper text when provided', () => {
    render(<Input label="Sleep Hours" helperText="Typical hours per night" />);
    expect(screen.getByText(/typical hours per night/i)).toBeInTheDocument();
  });

  it('supports left and right icon adornments', () => {
    render(
      <Input
        label="Search"
        leftIcon={<span data-testid="search-icon">🔍</span>}
        rightIcon={<span data-testid="clear-icon">✖</span>}
      />
    );

    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.getByTestId('clear-icon')).toBeInTheDocument();
  });

  it('handles disabled state properly', () => {
    render(<Input label="Disabled Field" disabled />);
    expect(screen.getByLabelText(/disabled field/i)).toBeDisabled();
  });
});
