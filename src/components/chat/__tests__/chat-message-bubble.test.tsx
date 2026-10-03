import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatMessageBubble } from '../chat-message-bubble';
import { ChatMessage } from '@/types/chat.types';

describe('ChatMessageBubble Component', () => {
  const userMessage: ChatMessage = {
    id: 'msg-user-1',
    personaId: 'current',
    role: 'user',
    content: 'How did you handle the engineering pressure?',
    timestamp: '2026-10-04T10:30:00.000Z',
  };

  const currentAssistantMessage: ChatMessage = {
    id: 'msg-assistant-1',
    personaId: 'current',
    role: 'assistant',
    content: 'I kept pushing without breaks, which led to chronic fatigue.',
    timestamp: '2026-10-04T10:31:00.000Z',
  };

  const improvedAssistantMessage: ChatMessage = {
    id: 'msg-assistant-2',
    personaId: 'improved',
    role: 'assistant',
    content: 'I prioritized sleep and deep work blocks, creating high leverage.',
    timestamp: '2026-10-04T10:32:00.000Z',
  };

  it('renders user message with right alignment and content', () => {
    render(<ChatMessageBubble message={userMessage} />);

    expect(screen.getByTestId('chat-bubble-user-msg-user-1')).toBeInTheDocument();
    expect(
      screen.getByText('How did you handle the engineering pressure?')
    ).toBeInTheDocument();
  });

  it('renders Current Path assistant message with amber styling and speaker name', () => {
    render(
      <ChatMessageBubble
        message={currentAssistantMessage}
        personaName="Taylor (Current Path)"
      />
    );

    expect(
      screen.getByTestId('chat-bubble-assistant-msg-assistant-1')
    ).toBeInTheDocument();
    expect(screen.getByText('Taylor (Current Path)')).toBeInTheDocument();
    expect(
      screen.getByText(/I kept pushing without breaks/i)
    ).toBeInTheDocument();
  });

  it('renders Improved Path assistant message with emerald styling and speaker name', () => {
    render(
      <ChatMessageBubble
        message={improvedAssistantMessage}
        personaName="Taylor (Improved Path)"
      />
    );

    expect(
      screen.getByTestId('chat-bubble-assistant-msg-assistant-2')
    ).toBeInTheDocument();
    expect(screen.getByText('Taylor (Improved Path)')).toBeInTheDocument();
    expect(
      screen.getByText(/I prioritized sleep and deep work blocks/i)
    ).toBeInTheDocument();
  });

  it('displays streaming indicator when message isStreaming is true', () => {
    const streamingMessage: ChatMessage = {
      ...improvedAssistantMessage,
      isStreaming: true,
      content: 'Synthesizing thought...',
    };

    render(<ChatMessageBubble message={streamingMessage} />);

    expect(screen.getByTestId('streaming-indicator')).toBeInTheDocument();
    expect(screen.getByText('Synthesizing thought...')).toBeInTheDocument();
  });

  it('renders TTS listen button and triggers onSpeak callback', () => {
    const onSpeakMock = jest.fn();
    render(
      <ChatMessageBubble
        message={improvedAssistantMessage}
        onSpeak={onSpeakMock}
      />
    );

    const listenBtn = screen.getByRole('button', { name: 'Read message aloud' });
    expect(listenBtn).toBeInTheDocument();

    fireEvent.click(listenBtn);
    expect(onSpeakMock).toHaveBeenCalledWith(improvedAssistantMessage.content);
  });

  it('renders Stop button when isSpeaking is true', () => {
    const onSpeakMock = jest.fn();
    render(
      <ChatMessageBubble
        message={improvedAssistantMessage}
        onSpeak={onSpeakMock}
        isSpeaking={true}
      />
    );

    const stopBtn = screen.getByRole('button', { name: 'Stop reading' });
    expect(stopBtn).toBeInTheDocument();
  });

  it('applies custom className to outer wrapper', () => {
    render(
      <ChatMessageBubble message={userMessage} className="custom-bubble-wrapper" />
    );

    expect(screen.getByTestId('chat-bubble-user-msg-user-1')).toHaveClass(
      'custom-bubble-wrapper'
    );
  });
});
