import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatHeader } from '../chat-header';

describe('ChatHeader Component', () => {
  it('renders persona title and active path badge for Current Path', () => {
    render(
      <ChatHeader
        activePersona="current"
        onSelectPersona={jest.fn()}
        personaName="Taylor"
      />
    );

    expect(screen.getByText('Taylor')).toBeInTheDocument();
    expect(screen.getByTestId('persona-badge')).toHaveTextContent('Current Path');

    const currentTab = screen.getByRole('tab', { name: /Current Path/i });
    const improvedTab = screen.getByRole('tab', { name: /Improved Path/i });

    expect(currentTab).toHaveAttribute('aria-selected', 'true');
    expect(improvedTab).toHaveAttribute('aria-selected', 'false');
  });

  it('renders persona title and active path badge for Improved Path', () => {
    render(
      <ChatHeader
        activePersona="improved"
        onSelectPersona={jest.fn()}
        personaName="Taylor"
      />
    );

    expect(screen.getByText('Taylor')).toBeInTheDocument();
    expect(screen.getByTestId('persona-badge')).toHaveTextContent('Improved Path');

    const currentTab = screen.getByRole('tab', { name: /Current Path/i });
    const improvedTab = screen.getByRole('tab', { name: /Improved Path/i });

    expect(currentTab).toHaveAttribute('aria-selected', 'false');
    expect(improvedTab).toHaveAttribute('aria-selected', 'true');
  });

  it('switches persona tabs when clicked', () => {
    const handleSelectPersona = jest.fn();
    render(
      <ChatHeader
        activePersona="current"
        onSelectPersona={handleSelectPersona}
        personaName="Taylor"
      />
    );

    const improvedTab = screen.getByTestId('persona-tab-improved');
    fireEvent.click(improvedTab);
    expect(handleSelectPersona).toHaveBeenCalledWith('improved');

    const currentTab = screen.getByTestId('persona-tab-current');
    fireEvent.click(currentTab);
    expect(handleSelectPersona).toHaveBeenCalledWith('current');
  });

  it('triggers onBackClick when back button is pressed', () => {
    const handleBack = jest.fn();
    render(
      <ChatHeader
        activePersona="current"
        onSelectPersona={jest.fn()}
        personaName="Taylor"
        onBackClick={handleBack}
      />
    );

    const backBtn = screen.getByRole('button', { name: 'Back to dashboard' });
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('triggers onClearChat when clear button is pressed', () => {
    const handleClear = jest.fn();
    render(
      <ChatHeader
        activePersona="current"
        onSelectPersona={jest.fn()}
        personaName="Taylor"
        onClearChat={handleClear}
      />
    );

    const clearBtn = screen.getByRole('button', { name: 'Clear chat history' });
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('does not render back or clear buttons if callbacks are not provided', () => {
    render(
      <ChatHeader
        activePersona="current"
        onSelectPersona={jest.fn()}
        personaName="Taylor"
      />
    );

    expect(
      screen.queryByRole('button', { name: 'Back to dashboard' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Clear chat history' })
    ).not.toBeInTheDocument();
  });
});
