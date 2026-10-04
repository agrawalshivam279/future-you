import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReflectionsGrid } from '../reflections-grid';
import { HONESTY_DISCLAIMER } from '@/lib/constants';

describe('ReflectionsGrid Component', () => {
  const sampleRegrets = [
    'Staying up late doomscrolling instead of resting.',
    'Delaying physical checkups.',
  ];

  const sampleGratitudes = [
    'Building a daily reading habit that compounded.',
    'Saving 20% of income consistently each month.',
    'Investing in lifelong friendships.',
  ];

  it('renders two-column matrix with regrets on left and gratitudes on right', () => {
    render(
      <ReflectionsGrid
        regrets={sampleRegrets}
        gratitudes={sampleGratitudes}
        personaId="improved"
        personaName="Taylor (Improved)"
      />
    );

    expect(
      screen.getByRole('region', {
        name: 'Reflections for Taylor (Improved)',
      })
    ).toBeInTheDocument();

    expect(screen.getByText('Improved Path')).toBeInTheDocument();
    expect(screen.getByText('Regrets & Gratitudes')).toBeInTheDocument();

    // Check count badges
    expect(screen.getByText('2 items')).toBeInTheDocument();
    expect(screen.getByText('3 items')).toBeInTheDocument();

    // Check items rendered
    expect(
      screen.getByText('Staying up late doomscrolling instead of resting.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Building a daily reading habit that compounded.')
    ).toBeInTheDocument();

    // Check honesty disclaimer
    expect(screen.getByText(HONESTY_DISCLAIMER)).toBeInTheDocument();
  });

  it('renders empty placeholders when regrets or gratitudes lists are empty', () => {
    render(
      <ReflectionsGrid
        regrets={[]}
        gratitudes={[]}
        personaId="current"
        personaName="Taylor (Current)"
      />
    );

    expect(screen.getByText('Current Path')).toBeInTheDocument();
    expect(
      screen.getByText('No specific regrets noted along this path.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('No specific gratitudes noted along this path.')
    ).toBeInTheDocument();
  });
});
