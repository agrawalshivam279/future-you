import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ApiConfigForm } from '../api-config-form';
import { ToastProvider } from '@/components/ui/toast';
import { useSettingsStore, PROVIDER_PRESETS } from '@/stores';
import * as aiClient from '@/lib/ai/client';

jest.mock('@/lib/ai/client');

describe('ApiConfigForm Component', () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.getState().resetSettings();
    jest.clearAllMocks();
  });

  const renderWithToast = (ui: React.ReactElement) => {
    return render(<ToastProvider>{ui}</ToastProvider>);
  };

  it('renders provider buttons, inputs, and test connection button', () => {
    renderWithToast(<ApiConfigForm />);

    expect(screen.getByText('AI Provider Configuration')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select openai provider/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select google gemini provider/i })).toBeInTheDocument();
    expect(screen.getByLabelText('API Key')).toBeInTheDocument();
    expect(screen.getByLabelText('Base URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Model Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /test ai connection/i })).toBeInTheDocument();
  });

  it('switches provider preset and auto-updates inputs', () => {
    renderWithToast(<ApiConfigForm />);

    const geminiBtn = screen.getByRole('button', { name: /select google gemini provider/i });
    fireEvent.click(geminiBtn);

    expect(useSettingsStore.getState().provider).toBe('gemini');
    expect(screen.getByLabelText('Base URL')).toHaveValue(PROVIDER_PRESETS.gemini.defaultBaseURL);
    expect(screen.getByLabelText('Model Name')).toHaveValue(PROVIDER_PRESETS.gemini.defaultModel);
  });

  it('toggles password visibility with eye button', () => {
    renderWithToast(<ApiConfigForm />);

    const apiKeyInput = screen.getByLabelText('API Key');
    expect(apiKeyInput).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByRole('button', { name: /show api key/i });
    fireEvent.click(toggleBtn);

    expect(apiKeyInput).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /hide api key/i })).toBeInTheDocument();
  });

  it('updates API key in store when input changes', () => {
    renderWithToast(<ApiConfigForm />);

    const apiKeyInput = screen.getByLabelText('API Key');
    fireEvent.change(apiKeyInput, { target: { value: 'sk-new-key-123' } });

    expect(useSettingsStore.getState().apiKey).toBe('sk-new-key-123');
  });

  it('invokes testAIConnection and shows toast on test button click', async () => {
    (aiClient.testAIConnection as jest.Mock).mockResolvedValueOnce({
      success: true,
      message: 'Connection verified!',
    });

    renderWithToast(<ApiConfigForm />);

    const testBtn = screen.getByRole('button', { name: /test ai connection/i });
    fireEvent.click(testBtn);

    await waitFor(() => {
      expect(aiClient.testAIConnection).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Connection Successful')).toBeInTheDocument();
    });
  });

  it('shows error toast when connection test fails', async () => {
    (aiClient.testAIConnection as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: 'Invalid API key provided.',
    });

    renderWithToast(<ApiConfigForm />);

    const testBtn = screen.getByRole('button', { name: /test ai connection/i });
    fireEvent.click(testBtn);

    await waitFor(() => {
      expect(screen.getByText('Connection Failed')).toBeInTheDocument();
      expect(screen.getByText('Invalid API key provided.')).toBeInTheDocument();
    });
  });
});
