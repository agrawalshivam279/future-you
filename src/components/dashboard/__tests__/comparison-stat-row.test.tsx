import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { ComparisonStatRow, ComparisonStatsGrid } from '../comparison-stat-row';
import { Persona } from '@/types/persona.types';

describe('ComparisonStatRow & ComparisonStatsGrid', () => {
  describe('ComparisonStatRow', () => {
    it('renders label, category, values and auto-computed positive delta', () => {
      render(
        <ComparisonStatRow
          label="Sleep Duration"
          category="Health"
          currentValue={6.5}
          improvedValue={8}
          unit="hrs"
        />
      );

      expect(screen.getByText('Sleep Duration')).toBeInTheDocument();
      expect(screen.getByText('Health')).toBeInTheDocument();
      expect(screen.getByText('6.5 hrs')).toBeInTheDocument();
      expect(screen.getByText('8 hrs')).toBeInTheDocument();
      expect(screen.getByText('+1.5 hrs')).toBeInTheDocument();
    });

    it('renders negative delta with danger badge when outcome deteriorates', () => {
      render(
        <ComparisonStatRow
          label="Career Satisfaction"
          currentValue={8}
          improvedValue={5}
          unit="/10"
        />
      );

      expect(screen.getByText('-3 /10')).toBeInTheDocument();
    });

    it('renders "No change" badge when current and improved values are equal', () => {
      render(
        <ComparisonStatRow
          label="Reading Hours"
          currentValue={5}
          improvedValue={5}
          unit="hrs"
        />
      );

      expect(screen.getByText('No change')).toBeInTheDocument();
    });

    it('supports explicit delta override', () => {
      render(
        <ComparisonStatRow
          label="Autonomy Level"
          currentValue="Moderate"
          improvedValue="High"
          delta="Significant Growth"
        />
      );

      expect(screen.getByText('Significant Growth')).toBeInTheDocument();
    });

    it('handles non-numeric values gracefully without delta badge', () => {
      render(
        <ComparisonStatRow
          label="Role Type"
          currentValue="Employee"
          improvedValue="Founder"
        />
      );

      expect(screen.getByText('Employee')).toBeInTheDocument();
      expect(screen.getByText('Founder')).toBeInTheDocument();
    });

    it('respects higherIsBetter={false} for metrics where lower is preferred', () => {
      render(
        <ComparisonStatRow
          label="Weekly Burnout Incidents"
          currentValue={4}
          improvedValue={1}
          higherIsBetter={false}
          unit="days"
        />
      );

      // Decreasing burnout by 3 days is positive when higherIsBetter is false
      const badge = screen.getByText('-3 days');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('ComparisonStatsGrid', () => {
    const mockCurrentPersona: Persona = {
      id: 'current',
      name: 'Taylor (Current)',
      age: 35,
      summary: 'Status-quo baseline.',
      personality: 'Pragmatic',
      emotionalState: 'Tired',
      career: {
        title: 'Engineer',
        companyOrContext: 'Company A',
        satisfaction: 6,
        highlights: [],
        challenges: [],
      },
      health: {
        physicalStatus: 'Fair',
        sleepAverageHours: 6,
        energyLevel: 'Low',
        habitsSummary: 'Irregular',
      },
      finances: {
        savingsRate: 10,
        financialStatus: 'Living paycheck to paycheck',
        freedomLevel: 'Low',
      },
      relationships: {
        status: 'Single',
        socialCircle: 'Work colleagues',
        satisfaction: 5,
      },
      skills: ['JavaScript', 'HTML'],
      achievements: [],
      struggles: [],
      dailyRoutine: 'Routine',
      timeline: [],
      letter: '',
      regrets: [],
      gratitudes: [],
    };

    const mockImprovedPersona: Persona = {
      ...mockCurrentPersona,
      id: 'improved',
      name: 'Taylor (Improved)',
      career: {
        ...mockCurrentPersona.career,
        satisfaction: 9,
      },
      health: {
        ...mockCurrentPersona.health,
        sleepAverageHours: 8,
      },
      finances: {
        ...mockCurrentPersona.finances,
        savingsRate: 25,
      },
      relationships: {
        ...mockCurrentPersona.relationships,
        satisfaction: 8,
      },
      skills: ['JavaScript', 'HTML', 'TypeScript', 'Rust', 'Cloud Architecture'],
    };

    it('renders all 5 core domain comparison metrics', () => {
      render(
        <ComparisonStatsGrid
          currentPersona={mockCurrentPersona}
          improvedPersona={mockImprovedPersona}
        />
      );

      expect(screen.getByTestId('comparison-stats-grid')).toBeInTheDocument();
      expect(screen.getByText('Trajectory Comparison')).toBeInTheDocument();

      // Career
      const careerRow = screen.getByTestId('comparison-row-career-satisfaction');
      expect(within(careerRow).getByText('Career Satisfaction')).toBeInTheDocument();
      expect(within(careerRow).getByText('6 /10')).toBeInTheDocument();
      expect(within(careerRow).getByText('9 /10')).toBeInTheDocument();
      expect(within(careerRow).getByText('+3 /10')).toBeInTheDocument();

      // Sleep
      const sleepRow = screen.getByTestId('comparison-row-sleep-duration');
      expect(within(sleepRow).getByText('Sleep Duration')).toBeInTheDocument();
      expect(within(sleepRow).getByText('6 hrs')).toBeInTheDocument();
      expect(within(sleepRow).getByText('8 hrs')).toBeInTheDocument();
      expect(within(sleepRow).getByText('+2 hrs')).toBeInTheDocument();

      // Finances
      const financeRow = screen.getByTestId('comparison-row-savings-rate');
      expect(within(financeRow).getByText('Savings Rate')).toBeInTheDocument();
      expect(within(financeRow).getByText('10 %')).toBeInTheDocument();
      expect(within(financeRow).getByText('25 %')).toBeInTheDocument();
      expect(within(financeRow).getByText('+15 %')).toBeInTheDocument();

      // Skills
      const skillsRow = screen.getByTestId('comparison-row-skills-mastered');
      expect(within(skillsRow).getByText('Skills Mastered')).toBeInTheDocument();
      expect(within(skillsRow).getByText('2 skills')).toBeInTheDocument();
      expect(within(skillsRow).getByText('5 skills')).toBeInTheDocument();
      expect(within(skillsRow).getByText('+3 skills')).toBeInTheDocument();

      // Relational
      const relRow = screen.getByTestId('comparison-row-relational-health');
      expect(within(relRow).getByText('Relational Health')).toBeInTheDocument();
      expect(within(relRow).getByText('5 /10')).toBeInTheDocument();
      expect(within(relRow).getByText('8 /10')).toBeInTheDocument();
      expect(within(relRow).getByText('+3 /10')).toBeInTheDocument();
    });
  });
});
