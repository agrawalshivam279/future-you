'use client';

/**
 * Custom React hook managing the multi-step AI generation lifecycle.
 * Coordinates between Onboarding state, LifeModel store, and generatePipeline orchestrator.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { LifeModel, OnboardingData } from '@/types';
import { generatePipeline, PipelineProgress } from '@/lib/ai/generate-pipeline';
import { formatAIError } from '@/lib/ai/ai-utils';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useLifeModelStore } from '@/stores/life-model-store';

export type GenerationStatus = 'idle' | 'generating' | 'completed' | 'error';

export interface UseGenerationPipelineOptions {
  /** Automatically trigger generation upon hook mount */
  autoStart?: boolean;
  /** Explicit onboarding data override (defaults to useOnboardingStore) */
  customInputs?: OnboardingData;
  /** Callback fired upon successful pipeline synthesis */
  onComplete?: (model: LifeModel) => void;
  /** Callback fired upon pipeline error */
  onError?: (error: string) => void;
}

export interface UseGenerationPipelineResult {
  /** Current state of the generation process */
  status: GenerationStatus;
  /** Boolean convenience flag indicating active generation */
  isGenerating: boolean;
  /** Granular progress information of the active stage */
  progress: PipelineProgress | null;
  /** Error message if pipeline failed */
  error: string | null;
  /** Generated LifeModel upon completion */
  model: LifeModel | null;
  /** Begin or resume generation */
  startGeneration: () => Promise<LifeModel | null>;
  /** Abort the in-flight generation */
  cancelGeneration: () => void;
  /** Retry generation after a failure */
  retry: () => Promise<LifeModel | null>;
}

/**
 * Default initial progress placeholder.
 */
const INITIAL_PROGRESS: PipelineProgress = {
  stage: 'life-model',
  label: 'Baseline Synthesis',
  description: 'Initializing generation pipeline...',
  progressPercent: 0,
  stageIndex: 1,
  totalStages: 5,
};

/**
 * Hook orchestrating client-side generation flow, progress updates, and store persistence.
 *
 * @param options - Configuration options including autoStart and callbacks
 * @returns State and actions for the generation pipeline
 */
export function useGenerationPipeline(
  options: UseGenerationPipelineOptions = {}
): UseGenerationPipelineResult {
  const { autoStart = false, customInputs, onComplete, onError } = options;

  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [progress, setProgress] = useState<PipelineProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<LifeModel | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Set mounted flag
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (isMountedRef.current) {
      setStatus('idle');
      setProgress(null);
    }
  }, []);

  const startGeneration = useCallback(async (): Promise<LifeModel | null> => {
    // Abort any existing in-flight controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const onboardingInputs = customInputs ?? useOnboardingStore.getState().getOnboardingData();

    if (!onboardingInputs || !onboardingInputs.name) {
      const missingError = 'No completed onboarding data found. Please complete the questionnaire.';
      setStatus('error');
      setError(missingError);
      onError?.(missingError);
      return null;
    }

    setStatus('generating');
    setError(null);
    setProgress(INITIAL_PROGRESS);
    useLifeModelStore.getState().setGenerating(true);

    try {
      const result = await generatePipeline(onboardingInputs, {
        signal: controller.signal,
        onProgress: (stepProgress) => {
          if (isMountedRef.current && !controller.signal.aborted) {
            setProgress(stepProgress);
          }
        },
      });

      if (!isMountedRef.current || controller.signal.aborted) {
        return null;
      }

      setModel(result.model);
      setStatus('completed');
      useLifeModelStore.getState().setLifeModel(result.model);
      onComplete?.(result.model);
      return result.model;
    } catch (err: unknown) {
      // Ignore user-initiated aborts
      if (
        controller.signal.aborted ||
        (err instanceof DOMException && err.name === 'AbortError') ||
        (err instanceof Error && err.message.toLowerCase().includes('aborted'))
      ) {
        if (isMountedRef.current) {
          setStatus('idle');
          setProgress(null);
        }
        return null;
      }

      const formatted = formatAIError(err, 'simulation-engine').message;
      if (isMountedRef.current) {
        setStatus('error');
        setError(formatted);
        useLifeModelStore.getState().setError(formatted);
        onError?.(formatted);
      }
      return null;
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      useLifeModelStore.getState().setGenerating(false);
    }
  }, [customInputs, onComplete, onError]);

  const retry = useCallback(async (): Promise<LifeModel | null> => {
    setError(null);
    return startGeneration();
  }, [startGeneration]);

  // Handle auto-start on mount
  useEffect(() => {
    if (autoStart && status === 'idle') {
      startGeneration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  return {
    status,
    isGenerating: status === 'generating',
    progress,
    error,
    model,
    startGeneration,
    cancelGeneration,
    retry,
  };
}
