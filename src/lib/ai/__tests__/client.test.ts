import { createAIClient, testAIConnection } from '../client';
import { AISettings } from '@/types';
import OpenAI from 'openai';

jest.mock('openai');

describe('AI Client Module', () => {
  const mockCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));
  });

  const validSettings: AISettings = {
    provider: 'openai',
    apiKey: 'sk-test-key',
    baseURL: 'https://api.openai.com/v1',
    modelName: 'gpt-4o',
  };

  it('creates an OpenAI client with configured parameters', () => {
    const client = createAIClient(validSettings);
    expect(client).toBeDefined();
    expect(OpenAI).toHaveBeenCalledWith({
      apiKey: 'sk-test-key',
      baseURL: 'https://api.openai.com/v1',
      dangerouslyAllowBrowser: true,
      timeout: 60000,
    });
  });

  it('fails testAIConnection when required API key is missing', async () => {
    const result = await testAIConnection({
      ...validSettings,
      apiKey: '   ',
    });

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/provide an api key/i);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('fails testAIConnection when base URL is missing', async () => {
    const result = await testAIConnection({
      ...validSettings,
      baseURL: '',
    });

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/provide an endpoint base url/i);
  });

  it('succeeds when model returns completion choices', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: 'Pong' } }],
    });

    const result = await testAIConnection(validSettings);
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/connection successful/i);
    expect(mockCreate).toHaveBeenCalledWith({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Connection test' }],
      max_tokens: 5,
    });
  });

  it('handles 401 unauthorized errors with friendly message', async () => {
    mockCreate.mockRejectedValueOnce(new Error('401 Unauthorized: Invalid API key'));

    const result = await testAIConnection(validSettings);
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/invalid api key/i);
  });

  it('handles 404 model not found errors', async () => {
    mockCreate.mockRejectedValueOnce(new Error('404 The model `gpt-fake` does not exist'));

    const result = await testAIConnection(validSettings);
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/not found/i);
  });

  it('handles 429 quota errors', async () => {
    mockCreate.mockRejectedValueOnce(new Error('429 You exceeded your current quota'));

    const result = await testAIConnection(validSettings);
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/quota exceeded/i);
  });
});
