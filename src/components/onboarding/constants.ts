import {
  Target,
  Activity,
  Clock,
  DollarSign,
  GraduationCap,
  HeartHandshake,
  LucideIcon,
} from 'lucide-react';

export interface OnboardingStepMeta {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
}

/**
 * Metadata definition for each step in the 6-step Future You onboarding flow.
 */
export const ONBOARDING_STEPS: OnboardingStepMeta[] = [
  {
    step: 1,
    title: 'Goals & Aspirations',
    subtitle: 'Where you want to go',
    description: 'Tell us about your short-term ambitions, 5-year visions, and what a fulfilled life looks like.',
    icon: Target,
  },
  {
    step: 2,
    title: 'Daily Habits & Lifestyle',
    subtitle: 'How you spend each day',
    description: 'Your physical and mental well-being: sleep routines, exercise frequency, nutrition, and screen time.',
    icon: Activity,
  },
  {
    step: 3,
    title: 'Time Allocation',
    subtitle: 'Where your hours actually go',
    description: 'Map out how your 168 weekly hours are distributed across work, learning, creative pursuits, and rest.',
    icon: Clock,
  },
  {
    step: 4,
    title: 'Finances & Resources',
    subtitle: 'Your economic trajectory',
    description: 'Income ranges, savings discipline, debt commitments, and the financial milestones that matter to you.',
    icon: DollarSign,
  },
  {
    step: 5,
    title: 'Skills & Learning',
    subtitle: 'Your professional capabilities',
    description: 'Your current strengths, growth areas, career satisfaction, and the specific capabilities you want to master.',
    icon: GraduationCap,
  },
  {
    step: 6,
    title: 'Fears, Values & Drivers',
    subtitle: 'What guides and tests you',
    description: 'The core values guiding your choices, risks you are willing to take, and potential regrets you wish to avoid.',
    icon: HeartHandshake,
  },
];

export const TOTAL_STEPS = ONBOARDING_STEPS.length;
