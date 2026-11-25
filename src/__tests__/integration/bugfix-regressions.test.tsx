import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { TTSPlayer } from '@/components/letter/tts-player';
import { GoalsStep } from '@/components/onboarding/steps/goals-step';
import { parseLifeModelResponse } from '@/lib/prompts/life-model-generator';
import { renderCardToSVG } from '@/lib/export/card-canvas-renderer';
import { computeProgress } from '@/lib/scoring/drift-calculator';
import { evaluateAndGenerateCheckInFeedback } from '@/lib/ai/check-in-feedback';
import { simulateDecisionScenario } from '@/lib/ai/simulate-decision';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useSettingsStore } from '@/stores/settings-store';
import { DEFAULT_SHARE_CONFIG, ShareCardData } from '@/types/share.types';
import { OnboardingData, DecisionScenario, CheckInLog } from '@/types';
import OpenAI from 'openai';

jest.mock('openai');

const mockOnboarding: OnboardingData = {
  name: 'Alex',
  age: 30,
  goals: { shortTerm: ['Ship'], longTerm: ['Lead'], dreamLife: 'Freedom' },
  habits: {
    sleepHours: 7,
    exerciseFrequency: 'weekly',
    dietQuality: 'good',
    screenTime: 4,
    meditationOrReflection: true,
  },
  time: {
    workHoursPerWeek: 40,
    studyHoursPerWeek: 5,
    socialHoursPerWeek: 5,
    creativeHoursPerWeek: 5,
    wastedHoursPerWeek: 5,
  },
  money: {
    incomeRange: '$80k',
    savingsRate: 20,
    debtLevel: 'none',
    spendingHabits: 'Balanced',
    financialGoal: 'Independence',
  },
  skills: {
    currentSkills: ['TypeScript'],
    learningGoals: ['Architecture'],
    careerField: 'Engineering',
    careerSatisfaction: 7,
    growthMindset: 8,
  },
  fearsAndValues: {
    biggestFears: ['Stagnation'],
    coreValues: ['Autonomy'],
    regrets: '',
    motivation: 'internal',
    riskTolerance: 6,
  },
};

describe('Regression Tests for Project-Wide Fixes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useOnboardingStore.getState().resetOnboarding();
    useSettingsStore.getState().resetSettings();
  });

  it('TTSPlayer does not destroy controller on callback identity changes and keeps playing on rate change', () => {
    const mockSpeak = jest.fn();
    const mockCancel = jest.fn();
    const utterances: Array<{ rate?: number; onstart?: () => void }> = [];

    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        speak: mockSpeak,
        cancel: mockCancel,
        pause: jest.fn(),
        resume: jest.fn(),
        getVoices: jest.fn().mockReturnValue([]),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
      writable: true,
      configurable: true,
    });

    (global as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance =
      jest.fn().mockImplementation(() => {
        const u: { rate?: number; onstart?: () => void } = {};
        utterances.push(u);
        return u;
      });

    const { rerender } = render(
      <TTSPlayer text="First sentence. Second sentence." onSentenceChange={jest.fn()} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Play reading letter aloud' }));
    act(() => {
      utterances[utterances.length - 1]?.onstart?.();
    });

    const cancelCountAfterStart = mockCancel.mock.calls.length;

    // Simulate parent re-render passing a new callback function identity — must NOT cancel speech
    rerender(<TTSPlayer text="First sentence. Second sentence." onSentenceChange={jest.fn()} />);
    expect(mockCancel.mock.calls.length).toBe(cancelCountAfterStart);

    // Changing speed mid-playback updates rate without destroying controller
    fireEvent.click(screen.getByRole('button', { name: 'Set speed to 1.25x' }));
    expect(utterances[utterances.length - 1]?.rate).toBe(1.25);
    expect(screen.getByText('Playing')).toBeInTheDocument();
  });

  it('GoalsStep preserves trailing spaces and partial two-digit ages while typing', () => {
    render(<GoalsStep />);

    const nameInput = screen.getByLabelText(/what should your future selves call you/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Maya ' } });
    expect(nameInput.value).toBe('Maya ');

    fireEvent.change(nameInput, { target: { value: 'Maya Chen' } });
    expect(nameInput.value).toBe('Maya Chen');
    expect(useOnboardingStore.getState().name).toBe('Maya Chen');

    const ageInput = screen.getByLabelText(/current age/i) as HTMLInputElement;
    fireEvent.change(ageInput, { target: { value: '2' } });
    expect(ageInput.value).toBe('2');

    fireEvent.change(ageInput, { target: { value: '27' } });
    expect(ageInput.value).toBe('27');
    expect(useOnboardingStore.getState().age).toBe(27);
  });

  it('parseLifeModelResponse safely deep-merges partial or null persona sub-objects', () => {
    const partialJson = JSON.stringify({
      currentPath: {
        summary: 'Current summary',
        career: { title: 'Developer' },
        health: null,
      },
      improvedPath: {
        summary: 'Improved summary',
        finances: null,
      },
    });

    const model = parseLifeModelResponse(partialJson, mockOnboarding);
    expect(model.currentPath.career.title).toBe('Developer');
    expect(model.currentPath.career.satisfaction).toBe(5);
    expect(model.currentPath.health.sleepAverageHours).toBe(7);
    expect(model.improvedPath.finances.savingsRate).toBe(20);
  });

  it('renderCardToSVG keeps landscape layout within 675px height without footer overlap', () => {
    const data: ShareCardData = {
      primaryGoal: 'Lead autonomous engineering systems',
      improvedHeadline: 'Staff Architect with deep focus',
      currentHeadline: 'Overworked generalist',
      improvedQuote: 'Consistency compounded into true freedom.',
      alignmentScore: 90,
      habits: [
        { label: 'Sleep', baseline: '6h', target: '8h' },
        { label: 'Deep Work', baseline: '10h', target: '25h' },
        { label: 'Screen', baseline: '5h', target: '2h' },
        { label: 'Savings', baseline: '15%', target: '35%', isFinancial: true },
      ],
      generatedAt: '2026-10-06T00:00:00.000Z',
    };

    const svg = renderCardToSVG(data, {
      ...DEFAULT_SHARE_CONFIG,
      aspectRatio: 'landscape',
    });

    const yRegex = /translate\(\d+,\s*(\d+)\)/g;
    const yValues: number[] = [];
    let match: RegExpExecArray | null = yRegex.exec(svg);
    while (match !== null) {
      yValues.push(Number(match[1]));
      match = yRegex.exec(svg);
    }
    const maxTranslateY = Math.max(...yValues);
    // Footer translate is at height - 42 = 633, strictly below habits and inside 675px height
    expect(maxTranslateY).toBeLessThan(675);
    expect(svg).toContain('translate(70, 633)');
  });

  it('computeProgress handles baseline already beating target without sign inversion', () => {
    expect(computeProgress(1, 1, 2, true)).toBe(1.0);
    expect(computeProgress(9, 9, 8, false)).toBe(1.0);
  });

  it('allows freellmapi provider without an API key in Decision Simulator and Check-in Feedback', async () => {
    useSettingsStore.getState().setProvider('freellmapi');
    useSettingsStore.getState().setApiKey('');

    const mockCreate = jest.fn()
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                projections: [],
                domainDeltas: [],
                personaReactions: { currentPathVerdict: 'Cautious', improvedPathVerdict: 'Bold' },
                tradeOffs: ['Time'],
                unforeseenRisks: ['Fatigue'],
              }),
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                futureSelfReflection: 'Steady progress.',
                recommendedAdjustment: 'Protect sleep.',
                encouragement: 'Keep showing up.',
              }),
            },
          },
        ],
      });

    (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
      chat: { completions: { create: mockCreate } },
    }));

    const scenario: DecisionScenario = {
      id: 'scen-local',
      createdAt: '2026-10-06T00:00:00.000Z',
      title: 'Join early lab',
      description: 'Move to an independent research team',
      primaryDomain: 'career',
      timeHorizon: '1year',
    };

    const decisionEval = await simulateDecisionScenario(scenario);
    expect(decisionEval.scenarioId).toBe('scen-local');

    const log: CheckInLog = {
      id: 'log-local',
      loggedAt: '2026-10-06T00:00:00.000Z',
      sleepHours: 8,
      exerciseFrequency: 'weekly',
      deepWorkHoursPerWeek: 25,
      screenTimeHoursPerDay: 2,
      savingsRatePercentage: 25,
    };

    const checkInEval = await evaluateAndGenerateCheckInFeedback(log);
    expect(checkInEval.logId).toBe('log-local');
  });
});
