import { OnboardingWizard } from '@/components/onboarding';

export const metadata = {
  title: 'Onboarding | Future You',
  description: 'Map out your current life trajectory and aspirations across 6 reflective steps.',
};

/**
 * Onboarding route page hosting the 6-step interactive wizard.
 *
 * @returns JSX Element rendering the onboarding page
 */
export default function OnboardingPage(): React.JSX.Element {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <OnboardingWizard />
    </div>
  );
}
