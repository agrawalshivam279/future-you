import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInput } from '../chat-input';

describe('ChatInput Component', () => {
  it('renders input with default placeholder and send button', () => {
    render(<ChatInput onSendMessage={jest.fn()} />);

    const textarea = screen.getByPlaceholderText('Ask your future self anything...');
    const sendBtn = screen.getByRole('button', { name: 'Send message' });

    expect(textarea).toBeInTheDocument();
    expect(sendBtn).toBeInTheDocument();
    expect(sendBtn).toBeDisabled();
  });

  it('enables send button when text is entered and invokes onSendMessage on click', () => {
    const handleSend = jest.fn();
    render(<ChatInput onSendMessage={handleSend} />);

    const textarea = screen.getByPlaceholderText('Ask your future self anything...');
    const sendBtn = screen.getByRole('button', { name: 'Send message' });

    fireEvent.change(textarea, { target: { value: 'What will change in 3 years?' } });
    expect(sendBtn).not.toBeDisabled();

    fireEvent.click(sendBtn);
    expect(handleSend).toHaveBeenCalledWith('What will change in 3 years?');
    expect(textarea).toHaveValue('');
  });

  it('submits message on Enter key press', () => {
    const handleSend = jest.fn();
    render(<ChatInput onSendMessage={handleSend} />);

    const textarea = screen.getByPlaceholderText('Ask your future self anything...');
    fireEvent.change(textarea, { target: { value: 'Are you proud of me?' } });
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: false });

    expect(handleSend).toHaveBeenCalledWith('Are you proud of me?');
    expect(textarea).toHaveValue('');
  });

  it('does not submit on Shift+Enter (allows newline)', () => {
    const handleSend = jest.fn();
    render(<ChatInput onSendMessage={handleSend} />);

    const textarea = screen.getByPlaceholderText('Ask your future self anything...');
    fireEvent.change(textarea, { target: { value: 'First line\n' } });
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: true });

    expect(handleSend).not.toHaveBeenCalled();
  });

  it('does not submit whitespace-only text', () => {
    const handleSend = jest.fn();
    render(<ChatInput onSendMessage={handleSend} />);

    const textarea = screen.getByPlaceholderText('Ask your future self anything...');
    fireEvent.change(textarea, { target: { value: '   ' } });
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: false });

    expect(handleSend).not.toHaveBeenCalled();
  });

  it('disables input and shows loading state when isLoading is true', () => {
    render(<ChatInput onSendMessage={jest.fn()} isLoading={true} />);

    const textarea = screen.getByPlaceholderText('Ask your future self anything...');
    const sendBtn = screen.getByRole('button', { name: 'Send message' });

    expect(textarea).toBeDisabled();
    expect(sendBtn).toBeDisabled();
  });

  it('renders custom placeholder and applies custom className', () => {
    render(
      <ChatInput
        onSendMessage={jest.fn()}
        placeholder="Type a custom query..."
        className="test-custom-input"
      />
    );

    expect(screen.getByPlaceholderText('Type a custom query...')).toBeInTheDocument();
    expect(screen.getByTestId('chat-input-container')).toHaveClass('test-custom-input');
  });
});
