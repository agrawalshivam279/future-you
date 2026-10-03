import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillsStep } from '../skills-step';
import { useOnboardingStore } from '@/stores';

describe('SkillsStep Component', () => {
  beforeEach(() => {
    useOnboardingStore.getState().resetOnboarding();
  });

  it('renders all skills and learning sections and controls', () => {
    render(<SkillsStep />);

    expect(screen.getByText('Key Current Strengths & Capabilities')).toBeInTheDocument();
    expect(screen.getByText('Target Capabilities & Learning Goals')).toBeInTheDocument();
    expect(screen.getByText('Primary Professional Field')).toBeInTheDocument();
    expect(screen.getByText('Current Career Satisfaction (1–10)')).toBeInTheDocument();
    expect(screen.getByText('Growth Mindset Orientation (1–10)')).toBeInTheDocument();
  });

  it('adds and removes current skills', () => {
    render(<SkillsStep />);

    const input = screen.getByLabelText(/add a current skill or core strength/i);
    const addBtn = screen.getByRole('button', { name: /add current strength/i });

    fireEvent.change(input, { target: { value: 'Distributed Systems' } });
    fireEvent.click(addBtn);

    expect(useOnboardingStore.getState().skills.currentSkills).toContain('Distributed Systems');
    expect(screen.getByText('Distributed Systems')).toBeInTheDocument();

    const removeBtn = screen.getByRole('button', {
      name: /remove strength: distributed systems/i,
    });
    fireEvent.click(removeBtn);

    expect(useOnboardingStore.getState().skills.currentSkills).not.toContain(
      'Distributed Systems'
    );
  });

  it('adds a current skill using suggestion chip', () => {
    render(<SkillsStep />);

    const chip = screen.getByRole('button', {
      name: /add suggested key current strengths & capabilities: software architecture/i,
    });
    fireEvent.click(chip);

    expect(useOnboardingStore.getState().skills.currentSkills).toContain('Software Architecture');
  });

  it('adds and removes learning goals', () => {
    render(<SkillsStep />);

    const chip = screen.getByRole('button', {
      name: /add suggested target capabilities & learning goals: artificial intelligence \/ ml/i,
    });
    fireEvent.click(chip);

    expect(useOnboardingStore.getState().skills.learningGoals).toContain(
      'Artificial Intelligence / ML'
    );

    const removeBtn = screen.getByRole('button', {
      name: /remove learning goal: artificial intelligence \/ ml/i,
    });
    fireEvent.click(removeBtn);

    expect(useOnboardingStore.getState().skills.learningGoals).not.toContain(
      'Artificial Intelligence / ML'
    );
  });

  it('updates career field via input and suggestion chip', () => {
    render(<SkillsStep />);

    const careerInput = screen.getByLabelText(/primary professional field or discipline/i);
    fireEvent.change(careerInput, { target: { value: 'Robotics Engineering' } });

    expect(useOnboardingStore.getState().skills.careerField).toBe('Robotics Engineering');

    const suggestionChip = screen.getByRole('button', {
      name: /\+ software & engineering/i,
    });
    fireEvent.click(suggestionChip);

    expect(useOnboardingStore.getState().skills.careerField).toBe('Software & Engineering');
  });

  it('updates career satisfaction rating and displays dynamic note', () => {
    render(<SkillsStep />);

    const slider = screen.getByLabelText(/current career satisfaction rating from 1 to 10/i);
    fireEvent.change(slider, { target: { value: '9' } });

    expect(useOnboardingStore.getState().skills.careerSatisfaction).toBe(9);
    expect(
      screen.getByText('Peak flow, mastery, and purpose-driven engagement')
    ).toBeInTheDocument();
  });

  it('updates growth mindset rating and displays dynamic note', () => {
    render(<SkillsStep />);

    const slider = screen.getByLabelText(/growth mindset orientation rating from 1 to 10/i);
    fireEvent.change(slider, { target: { value: '10' } });

    expect(useOnboardingStore.getState().skills.growthMindset).toBe(10);
    expect(
      screen.getByText('Relentless experimental resilience and mastery orientation')
    ).toBeInTheDocument();
  });
});
