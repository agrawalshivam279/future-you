import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShareModal } from '../share-modal';
import { ToastProvider } from '@/components/ui/toast';
import { useLifeModelStore } from '@/stores/life-model-store';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useCheckInStore } from '@/stores/check-in-store';
import { LifeModel } from '@/types';

function renderWithToast(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

const mockModel: LifeModel = {
  id: 'mock-model-1',
  createdAt: '2026-10-06T00:00:00.000Z',
  inputs: {
    name: 'Alex',
    age: 30,
    goals: { shortTerm: ['Ship Version 3'], longTerm: ['Lead Architecture'], dreamLife: 'Leading autonomous systems research' },
    habits: { sleepHours: 8, exerciseFrequency: 'weekly', dietQuality: 'good', screenTime: 3, meditationOrReflection: true },
    time: { workHoursPerWeek: 40, studyHoursPerWeek: 10, socialHoursPerWeek: 10, creativeHoursPerWeek: 10, wastedHoursPerWeek: 5 },
    money: { incomeRange: '$120k+', savingsRate: 25, debtLevel: 'none', spendingHabits: 'Disciplined', financialGoal: 'Freedom' },
    skills: { currentSkills: ['TypeScript'], learningGoals: ['AI Systems'], careerField: 'Software', careerSatisfaction: 8, growthMindset: 9 },
    fearsAndValues: { biggestFears: ['Stagnation'], coreValues: ['Autonomy', 'Focus'], regrets: 'None', motivation: 'internal', riskTolerance: 7 },
  },
  currentPath: {
    id: 'current',
    name: 'Current Path',
    age: 35,
    summary: 'Status-quo baseline developer routine with modest linear compounding',
    personality: 'Pragmatic and cautious',
    emotionalState: 'Mild fatigue',
    career: { title: 'Senior Dev', companyOrContext: 'Tech Inc', satisfaction: 6, highlights: [], challenges: [] },
    health: { physicalStatus: 'Moderate', sleepAverageHours: 6.5, energyLevel: 'Fluctuating', habitsSummary: 'Irregular exercise' },
    finances: { savingsRate: 15, financialStatus: 'Comfortable', freedomLevel: 'Medium' },
    relationships: { status: 'Stable', socialCircle: 'Small close circle', satisfaction: 7 },
    skills: ['React'],
    achievements: [],
    struggles: [],
    dailyRoutine: '9-5 work with evening Netflix',
    timeline: [],
    letter: 'Take care of yourself before burnout catches up.',
    regrets: [],
    gratitudes: [],
  },
  improvedPath: {
    id: 'improved',
    name: 'Improved Path',
    age: 35,
    summary: 'Compounding deep work, autonomy, and high-vitality habits',
    personality: 'Grounded and visionary',
    emotionalState: 'Calm and energized',
    career: { title: 'Principal Architect', companyOrContext: 'Autonomy Labs', satisfaction: 9, highlights: [], challenges: [] },
    health: { physicalStatus: 'High vitality', sleepAverageHours: 8, energyLevel: 'Consistent and deep', habitsSummary: 'Daily physical training' },
    finances: { savingsRate: 40, financialStatus: 'Abundant investments', freedomLevel: 'High autonomy' },
    relationships: { status: 'Deeply bonded', socialCircle: 'Inspiring peers', satisfaction: 9 },
    skills: ['System Design', 'AI Autonomy'],
    achievements: [],
    struggles: [],
    dailyRoutine: 'Deep work mornings, nature walks, deliberate creation',
    timeline: [],
    letter: 'The compounding interest of your daily deep work created true freedom.',
    regrets: [],
    gratitudes: [],
  },
  habitLevers: [
    {
      id: 'lever-deep-work',
      label: 'Deep Work',
      currentValue: 10,
      min: 0,
      max: 40,
      step: 1,
      unit: 'hrs/wk',
    },
  ],
};

describe('ShareModal Component', () => {
  beforeEach(() => {
    useLifeModelStore.setState({ model: mockModel });
    useOnboardingStore.setState({
      goals: mockModel.inputs.goals,
      fearsAndValues: mockModel.inputs.fearsAndValues,
    });
    useCheckInStore.setState({
      logs: [],
      evaluations: {},
    });
  });

  it('does not render modal content when isOpen is false', () => {
    renderWithToast(<ShareModal isOpen={false} onClose={jest.fn()} />);
    expect(screen.queryByText(/export shareable result card/i)).not.toBeInTheDocument();
  });

  it('renders modal dialog with card preview, privacy toggles, and export actions when isOpen is true', () => {
    const handleClose = jest.fn();
    renderWithToast(<ShareModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText('Export Shareable Result Card')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /shareable result card preview/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /share card customization controls/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /share export actions/i })).toBeInTheDocument();
    expect(screen.getByText(/zero cloud storage/i)).toBeInTheDocument();
  });

  it('invokes onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    renderWithToast(<ShareModal isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
