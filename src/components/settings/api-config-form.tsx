'use client';

import * as React from 'react';
import { Eye, EyeOff, ExternalLink, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useSettingsStore, PROVIDER_PRESETS } from '@/stores';
import { AIProvider } from '@/types';
import { testAIConnection } from '@/lib/ai/client';

export interface ApiConfigFormProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Universal AI provider configuration form for Future You.
 * Allows users to choose their LLM backend, configure keys locally, and test connections.
 */
export function ApiConfigForm({ className, ...props }: ApiConfigFormProps) {
  const {
    provider,
    apiKey,
    baseURL,
    modelName,
    setProvider,
    setApiKey,
    setBaseURL,
    setModelName,
    isConfigured,
  } = useSettingsStore();

  const { showToast } = useToast();
  const [showKey, setShowKey] = React.useState(false);
  const [isTesting, setIsTesting] = React.useState(false);

  const currentPreset = PROVIDER_PRESETS[provider];

  const handleTestConnection = async () => {
    setIsTesting(true);

    try {
      const result = await testAIConnection({
        provider,
        apiKey,
        baseURL,
        modelName,
      });

      if (result.success) {
        showToast({
          type: 'success',
          title: 'Connection Successful',
          message: result.message,
        });
      } else {
        showToast({
          type: 'error',
          title: 'Connection Failed',
          message: result.message,
        });
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Connection Error',
        message: 'An unexpected error occurred while testing connection.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>AI Provider Configuration</span>
            {isConfigured() ? (
              <Badge variant="improved" size="sm">
                Configured
              </Badge>
            ) : (
              <Badge variant="current" size="sm">
                Action Required
              </Badge>
            )}
          </CardTitle>
        </div>
        <CardDescription>
          Future You connects directly from your browser to your chosen LLM. Keys and URLs are stored
          locally on this device and are never transmitted to any third-party analytics or server.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Provider Presets Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Provider Preset</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {(Object.keys(PROVIDER_PRESETS) as AIProvider[]).map((pKey) => {
              const preset = PROVIDER_PRESETS[pKey];
              const isSelected = provider === pKey;
              return (
                <button
                  key={pKey}
                  type="button"
                  onClick={() => setProvider(pKey)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-info ${
                    isSelected
                      ? 'border-accent-info bg-accent-info/10 text-text-primary shadow-sm'
                      : 'border-border-primary bg-bg-tertiary text-text-secondary hover:text-text-primary hover:border-border-focus'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`Select ${preset.name} provider`}
                >
                  <span className="font-semibold text-center">{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* API Key Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="api-key" className="text-sm font-medium text-text-primary">
              API Key {currentPreset.requiresKey ? '(Required)' : '(Optional for Local)'}
            </label>
            {currentPreset.helpUrl && (
              <a
                href={currentPreset.helpUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-accent-info hover:underline inline-flex items-center gap-1"
                aria-label={`Get ${currentPreset.name} API Key`}
              >
                <span>Get API Key</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            )}
          </div>

          <div className="relative">
            <Input
              id="api-key"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={currentPreset.apiKeyPlaceholder || 'Enter your API key...'}
              className="pr-10"
              aria-label="API Key"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-info rounded"
              aria-label={showKey ? 'Hide API key' : 'Show API key'}
            >
              {showKey ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Endpoint Base URL Input */}
        <div className="space-y-1.5">
          <label htmlFor="base-url" className="text-sm font-medium text-text-primary">
            Base URL
          </label>
          <Input
            id="base-url"
            type="url"
            value={baseURL}
            onChange={(e) => setBaseURL(e.target.value)}
            placeholder="https://api.openai.com/v1"
            aria-label="Base URL"
          />
          <p className="text-[11px] text-text-muted">
            Must expose OpenAI-compatible endpoints (/chat/completions).
          </p>
        </div>

        {/* Model Name Input */}
        <div className="space-y-1.5">
          <label htmlFor="model-name" className="text-sm font-medium text-text-primary">
            Model Name
          </label>
          <Input
            id="model-name"
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="e.g. gpt-4o, gemini-1.5-pro, llama-3.1-70b"
            aria-label="Model Name"
          />
        </div>

        {/* Test Connection Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-primary/50">
          <div className="text-xs text-text-muted flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-accent-success shrink-0" aria-hidden="true" />
            <span>Changes save automatically to localStorage</span>
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleTestConnection}
            isLoading={isTesting}
            disabled={isTesting}
            className="w-full sm:w-auto"
            aria-label="Test AI connection"
          >
            <Zap className="h-4 w-4 mr-1.5" aria-hidden="true" />
            <span>Test Connection</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
