import OpenAI from 'openai';
import { AISettings } from '@/types';
import { AI_TIMEOUT_MS } from '@/lib/constants';

/**
 * Creates and configures a universal OpenAI-compatible client instance.
 * Client runs entirely inside the browser without intermediate servers.
 *
 * @param settings - User-configured AI provider settings
 * @returns Configured OpenAI client
 */
export function createAIClient(settings: AISettings): OpenAI {
  return new OpenAI({
    apiKey: settings.apiKey || 'not-provided',
    baseURL: settings.baseURL,
    dangerouslyAllowBrowser: true,
    timeout: AI_TIMEOUT_MS,
  });
}

/**
 * Pings the configured AI provider endpoint to validate API key and network connectivity.
 *
 * @param settings - Current AI settings to test
 * @returns Object indicating connection success and descriptive feedback
 */
export async function testAIConnection(
  settings: AISettings
): Promise<{ success: boolean; message: string }> {
  // Validate key requirement based on provider
  if (settings.provider !== 'freellmapi' && !settings.apiKey.trim()) {
    return {
      success: false,
      message: 'Please provide an API key before testing connection.',
    };
  }

  if (!settings.baseURL.trim()) {
    return {
      success: false,
      message: 'Please provide an endpoint base URL.',
    };
  }

  try {
    const client = createAIClient(settings);

    // Send a minimal ping completion
    const response = await client.chat.completions.create({
      model: settings.modelName,
      messages: [{ role: 'user', content: 'Connection test' }],
      max_tokens: 5,
    });

    if (response?.choices && response.choices.length > 0) {
      return {
        success: true,
        message: `Connection successful! ${settings.modelName} responded.`,
      };
    }

    return {
      success: true,
      message: 'Connection established successfully.',
    };
  } catch (error: unknown) {
    let errorMessage = 'Failed to connect to the AI endpoint.';

    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('invalid api key')) {
        errorMessage = 'Invalid API key. Please check your credentials.';
      } else if (msg.includes('404') || msg.includes('not found')) {
        errorMessage = `Model '${settings.modelName}' not found or endpoint URL is incorrect.`;
      } else if (msg.includes('429') || msg.includes('quota')) {
        errorMessage = 'Rate limit or billing quota exceeded for this API key.';
      } else if (msg.includes('timeout')) {
        errorMessage = 'Connection timed out after 60 seconds. Endpoint unreachable.';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}
