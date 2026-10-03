import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimeStep } from '../time-step';
import { useOnboardingStore } from '@/stores';

describe('TimeStep Component', () => {
  beforeEach(() => {
    useOnboardingStore.getState().resetOnboarding();
  });

  it('renders 168-hour weekly budget summary card and all 5 sliders', () => {
    render(<TimeStep />);

    expect(screen.getByText('168-Hour Weekly Budget')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: /168-hour weekly time allocation/i })).toBeInTheDocument();
    expect(screen.getByText('Career & Work Hours')).toBeInTheDocument();
    expect(screen.getByText('Study & Skill Acquisition')).toBeInTheDocument();
    expect(screen.getByText('Social & Family Connection')).toBeInTheDocument();
    expect(screen.getByText('Creative & Passion Projects')).toBeInTheDocument();
    expect(screen.getByText('Unproductive Downtime')).toBeInTheDocument();
  });

  it('calculates unscheduled buffer correctly with default values', () => {
    render(<TimeStep />);

    // Default: sleep=7 (49h/wk), work=40, study=5, social=10, creative=3, wasted=5 => total=112h
    // Remaining buffer = 168 - 112 = 56h
    expect(screen.getByText(/56 hrs\/wk unscheduled buffer/i)).toBeInTheDocument();

    const progressBar = screen.getByRole('progressbar', { name: /168-hour weekly time allocation/i });
    expect(progressBar).toHaveAttribute('aria-valuenow', '112');
  });

  it('shows overbooked warning when total hours exceed 168', () => {
    useOnboardingStore.getState().updateTime({
      workHoursPerWeek: 70,
      studyHoursPerWeek: 30,
      socialHoursPerWeek: 25,
      creativeHoursPerWeek: 20,
      wastedHoursPerWeek: 15,
    });
    // Active = 160h. Sleep = 49h. Total = 209h. Overbooked by 41h.
    render(<TimeStep />);

    expect(screen.getByText(/overbooked by 41 hrs\/wk/i)).toBeInTheDocument();
  });

  it('updates work hours when slider changes', () => {
    render(<TimeStep />);

    const workSlider = screen.getByLabelText('Weekly career and work hours');
    fireEvent.change(workSlider, { target: { value: '50' } });

    expect(useOnboardingStore.getState().time.workHoursPerWeek).toBe(50);
  });

  it('updates study hours when slider changes', () => {
    render(<TimeStep />);

    const studySlider = screen.getByLabelText('Weekly study and learning hours');
    fireEvent.change(studySlider, { target: { value: '15' } });

    expect(useOnboardingStore.getState().time.studyHoursPerWeek).toBe(15);
  });

  it('updates social hours when slider changes', () => {
    render(<TimeStep />);

    const socialSlider = screen.getByLabelText('Weekly social and family hours');
    fireEvent.change(socialSlider, { target: { value: '18' } });

    expect(useOnboardingStore.getState().time.socialHoursPerWeek).toBe(18);
  });

  it('updates creative hours when slider changes', () => {
    render(<TimeStep />);

    const creativeSlider = screen.getByLabelText('Weekly creative and hobby hours');
    fireEvent.change(creativeSlider, { target: { value: '12' } });

    expect(useOnboardingStore.getState().time.creativeHoursPerWeek).toBe(12);
  });

  it('updates wasted hours when slider changes', () => {
    render(<TimeStep />);

    const wastedSlider = screen.getByLabelText('Weekly unproductive or wasted hours');
    fireEvent.change(wastedSlider, { target: { value: '8' } });

    expect(useOnboardingStore.getState().time.wastedHoursPerWeek).toBe(8);
  });
});
