import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PersonaCard } from '../persona-card';
import { Persona } from '@/types/persona.types';

describe('PersonaCard', () => {
  const currentPersona: Persona = {
    id: 'current',
    name: 'Alex in 2031 (Current Path)',
    age: 34,
    summary: 'Still navigating demanding engineering cycles with occasional burnout.',
    personality: 'Pragmatic, cautious, persistent',
    emotionalState: 'Mildly Restless',
    career: {
      title: 'Senior Software Engineer',
      companyOrContext: 'Mid-sized tech firm',
      satisfaction: 6,
      highlights: ['Refactored monolith'],
      challenges: ['Lack of strategic autonomy'],
    },
    health: {
      physicalStatus: 'Fair with minor fatigue',
      sleepAverageHours: 6.5,
      energyLevel: 'Variable',
      habitsSummary: 'Sedentary desk work',
    },
    finances: {
      savingsRate: 15,
      financialStatus: 'Comfortable buffer',
      freedomLevel: 'Moderate',
    },
    relationships: {
      status: 'Steady partnership',
      socialCircle: 'Core group of peers',
      satisfaction: 7,
    },
    skills: ['TypeScript', 'Node.js', 'PostgreSQL'],
    achievements: ['Delivered core platform v2'],
    struggles: ['Workplace overextension and late night doomscrolling'],
    dailyRoutine: 'Wake up at 8am, coffee, back-to-back meetings, late dinners.',
    timeline: [],
    letter: 'Dear Alex, be more protective of your quiet hours.',
    regrets: ['Did not establish exercise cadence sooner'],
    gratitudes: ['Kept learning systems programming'],
  };

  const improvedPersona: Persona = {
    ...currentPersona,
    id: 'improved',
    name: 'Alex in 2031 (Improved Path)',
    summary: 'Directing open-source architecture with vibrant physical vitality.',
    emotionalState: 'Calm & Purposeful',
    career: {
      ...currentPersona.career,
      title: 'Principal Systems Architect',
      satisfaction: 9,
    },
    health: {
      ...currentPersona.health,
      sleepAverageHours: 8,
      energyLevel: 'High & Sustained',
    },
    finances: {
      ...currentPersona.finances,
      savingsRate: 35,
      freedomLevel: 'High',
    },
    achievements: ['Published recognized distributed systems whitepaper'],
    struggles: [],
  };

  it('renders Current Path persona card with correct badges, name, and age', () => {
    render(<PersonaCard persona={currentPersona} />);

    expect(screen.getByTestId('persona-card-current')).toBeInTheDocument();
    expect(screen.getByText('Current Path')).toBeInTheDocument();
    expect(screen.getByText('Mildly Restless')).toBeInTheDocument();
    expect(screen.getByText('Alex in 2031 (Current Path)')).toBeInTheDocument();
    expect(screen.getByText('(Age 34)')).toBeInTheDocument();
  });

  it('renders Improved Path persona card with improved styling and badges', () => {
    render(<PersonaCard persona={improvedPersona} />);

    expect(screen.getByTestId('persona-card-improved')).toBeInTheDocument();
    expect(screen.getByText('Improved Path')).toBeInTheDocument();
    expect(screen.getByText('Calm & Purposeful')).toBeInTheDocument();
    expect(screen.getByText('Alex in 2031 (Improved Path)')).toBeInTheDocument();
  });

  it('renders narrative summary quote block', () => {
    render(<PersonaCard persona={currentPersona} />);

    expect(
      screen.getByText(/Still navigating demanding engineering cycles/i)
    ).toBeInTheDocument();
  });

  it('renders career, health, and finance metrics properly', () => {
    render(<PersonaCard persona={currentPersona} />);

    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('6/10 sat.')).toBeInTheDocument();
    expect(screen.getByText('6.5h / night')).toBeInTheDocument();
    expect(screen.getByText('Variable')).toBeInTheDocument();
    expect(screen.getByText('15% rate')).toBeInTheDocument();
    expect(screen.getByText('Moderate')).toBeInTheDocument();
  });

  it('renders ongoing struggle for Current Path and milestone accomplishment for Improved Path', () => {
    const { rerender } = render(<PersonaCard persona={currentPersona} />);

    expect(screen.getByText('Key Ongoing Struggle:')).toBeInTheDocument();
    expect(
      screen.getByText(/Workplace overextension and late night doomscrolling/i)
    ).toBeInTheDocument();

    rerender(<PersonaCard persona={improvedPersona} />);
    expect(screen.getByText('Key Milestone Accomplishment:')).toBeInTheDocument();
    expect(
      screen.getByText(/Published recognized distributed systems whitepaper/i)
    ).toBeInTheDocument();
  });

  it('triggers interactive callbacks for Chat, Letter, and Reflections buttons', () => {
    const onChatMock = jest.fn();
    const onLetterMock = jest.fn();
    const onReflectionsMock = jest.fn();

    render(
      <PersonaCard
        persona={currentPersona}
        onChatClick={onChatMock}
        onLetterClick={onLetterMock}
        onReflectionsClick={onReflectionsMock}
      />
    );

    const chatBtn = screen.getByRole('button', {
      name: `Chat with ${currentPersona.name}`,
    });
    const letterBtn = screen.getByRole('button', {
      name: `Read letter from ${currentPersona.name}`,
    });
    const reflectionsBtn = screen.getByRole('button', {
      name: `View regrets and gratitudes from ${currentPersona.name}`,
    });

    fireEvent.click(chatBtn);
    expect(onChatMock).toHaveBeenCalledTimes(1);

    fireEvent.click(letterBtn);
    expect(onLetterMock).toHaveBeenCalledTimes(1);

    fireEvent.click(reflectionsBtn);
    expect(onReflectionsMock).toHaveBeenCalledTimes(1);
  });

  it('applies custom className when provided', () => {
    render(<PersonaCard persona={currentPersona} className="custom-test-card" />);
    expect(screen.getByTestId('persona-card-current')).toHaveClass('custom-test-card');
  });
});
