import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatMessageList } from '../chat-message-list';
import { ChatMessage } from '@/types/chat.types';

describe('ChatMessageList Component', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  const mockMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      personaId: 'current',
      role: 'user',
      content: 'Hello future me',
      timestamp: '2026-10-04T12:00:00.000Z',
    },
    {
      id: 'msg-2',
      personaId: 'current',
      role: 'assistant',
      content: 'Hello, looking back from 5 years ahead.',
      timestamp: '2026-10-04T12:01:00.000Z',
    },
  ];

  it('renders empty state when there are no messages', () => {
    const handleSelectStarter = jest.fn();
    render(
      <ChatMessageList
        messages={[]}
        personaId="current"
        personaName="Taylor (Current)"
        onSelectStarter={handleSelectStarter}
      />
    );

    expect(screen.getByTestId('chat-empty-state')).toBeInTheDocument();
    expect(screen.getByText('Reflect with Taylor (Current)')).toBeInTheDocument();
    expect(
      screen.getByText(/reflection tool, not a prediction engine/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('suggested-questions')).toBeInTheDocument();

    const starterBtn = screen.getByRole('button', {
      name: /What is your biggest daily struggle right now\?/i,
    });
    fireEvent.click(starterBtn);
    expect(handleSelectStarter).toHaveBeenCalledWith(
      'What is your biggest daily struggle right now?'
    );
  });

  it('renders messages correctly when messages are present', () => {
    render(
      <ChatMessageList
        messages={mockMessages}
        personaId="current"
        personaName="Taylor (Current)"
      />
    );

    expect(screen.getByText('Hello future me')).toBeInTheDocument();
    expect(
      screen.getByText('Hello, looking back from 5 years ahead.')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('chat-empty-state')).not.toBeInTheDocument();
  });

  it('displays loading indicator bubble when isLoading is true and not streaming', () => {
    render(
      <ChatMessageList
        messages={mockMessages}
        personaId="improved"
        isLoading={true}
      />
    );

    expect(screen.getByTestId('chat-loading-indicator')).toBeInTheDocument();
    expect(screen.getByText('Reflecting on your question...')).toBeInTheDocument();
  });

  it('does not display separate loading indicator when the last message is actively streaming', () => {
    const streamingMessages: ChatMessage[] = [
      mockMessages[0],
      {
        id: 'msg-3',
        personaId: 'current',
        role: 'assistant',
        content: 'Streaming thoughts...',
        timestamp: '2026-10-04T12:02:00.000Z',
        isStreaming: true,
      },
    ];

    render(
      <ChatMessageList
        messages={streamingMessages}
        personaId="current"
        isLoading={true}
      />
    );

    expect(screen.queryByTestId('chat-loading-indicator')).not.toBeInTheDocument();
  });

  it('triggers scrollIntoView on mount and message update', () => {
    const scrollMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollMock;

    const { rerender } = render(
      <ChatMessageList
        messages={mockMessages}
        personaId="current"
      />
    );

    expect(scrollMock).toHaveBeenCalled();

    rerender(
      <ChatMessageList
        messages={[
          ...mockMessages,
          {
            id: 'msg-4',
            personaId: 'current',
            role: 'user',
            content: 'Another question',
            timestamp: '2026-10-04T12:03:00.000Z',
          },
        ]}
        personaId="current"
      />
    );

    expect(scrollMock).toHaveBeenCalledTimes(2);
  });
});
