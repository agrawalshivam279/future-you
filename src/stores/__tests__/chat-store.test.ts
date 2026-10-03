import { useChatStore } from '../chat-store';

describe('useChatStore', () => {
  beforeEach(() => {
    useChatStore.getState().resetChat();
  });

  it('initializes with empty conversations and default flags', () => {
    const state = useChatStore.getState();
    expect(state.conversations.current).toEqual([]);
    expect(state.conversations.improved).toEqual([]);
    expect(state.isStreaming).toBe(false);
    expect(state.activePersona).toBe('improved');
    expect(state.error).toBeNull();
  });

  it('adds user and assistant messages with generated metadata', () => {
    const store = useChatStore.getState();

    const userMsg = store.addMessage('improved', {
      role: 'user',
      content: 'What advice do you have for me today?',
    });

    expect(userMsg.id).toBeDefined();
    expect(userMsg.timestamp).toBeDefined();
    expect(userMsg.personaId).toBe('improved');
    expect(userMsg.role).toBe('user');

    const state = useChatStore.getState();
    expect(state.conversations.improved).toHaveLength(1);
    expect(state.conversations.current).toHaveLength(0);
    expect(store.getMessages('improved')).toHaveLength(1);
  });

  it('accumulates streaming tokens onto active assistant message', () => {
    const store = useChatStore.getState();

    const assistantMsg = store.addMessage('current', {
      role: 'assistant',
      content: '',
      isStreaming: true,
    });

    store.appendStreamingToken('current', assistantMsg.id, 'I ');
    store.appendStreamingToken('current', assistantMsg.id, 'remember ');
    store.appendStreamingToken('current', assistantMsg.id, 'this day.');

    const state = useChatStore.getState();
    expect(state.isStreaming).toBe(true);

    const updated = state.conversations.current.find((m) => m.id === assistantMsg.id);
    expect(updated?.content).toBe('I remember this day.');
    expect(updated?.isStreaming).toBe(true);

    // Conclude streaming
    store.finishStreaming('current', assistantMsg.id);
    const finalState = useChatStore.getState();
    expect(finalState.isStreaming).toBe(false);
    expect(finalState.conversations.current[0].isStreaming).toBe(false);
  });

  it('clears chat for a single persona without affecting the other', () => {
    const store = useChatStore.getState();

    store.addMessage('current', { role: 'user', content: 'Current msg' });
    store.addMessage('improved', { role: 'user', content: 'Improved msg' });

    expect(useChatStore.getState().conversations.current).toHaveLength(1);
    expect(useChatStore.getState().conversations.improved).toHaveLength(1);

    store.clearChat('current');
    expect(useChatStore.getState().conversations.current).toHaveLength(0);
    expect(useChatStore.getState().conversations.improved).toHaveLength(1);
  });

  it('clears all chats across personas', () => {
    const store = useChatStore.getState();

    store.addMessage('current', { role: 'user', content: 'A' });
    store.addMessage('improved', { role: 'user', content: 'B' });

    store.clearAllChats();
    expect(useChatStore.getState().conversations.current).toHaveLength(0);
    expect(useChatStore.getState().conversations.improved).toHaveLength(0);
  });

  it('sets active persona and error states', () => {
    const store = useChatStore.getState();

    store.setActivePersona('current');
    expect(useChatStore.getState().activePersona).toBe('current');

    store.setError('Failed to reach AI endpoint');
    expect(useChatStore.getState().error).toBe('Failed to reach AI endpoint');
  });

  it('resets chat state to defaults', () => {
    const store = useChatStore.getState();

    store.addMessage('improved', { role: 'user', content: 'Test' });
    store.setActivePersona('current');
    store.setError('Err');

    store.resetChat();

    const state = useChatStore.getState();
    expect(state.conversations.improved).toEqual([]);
    expect(state.activePersona).toBe('improved');
    expect(state.error).toBeNull();
  });
});
