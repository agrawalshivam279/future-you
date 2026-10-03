import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ApiConfigForm } from '@/components/settings/api-config-form';

/**
 * Settings & Preferences page view for Future You.
 * Allows users to configure AI API credentials and manage local application data.
 */
export default function SettingsPage() {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation & Header */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-info rounded"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" aria-hidden="true" />
          <span>Back to Home</span>
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Settings &amp; Preferences
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage your local AI credentials, endpoint endpoints, and stored reflection data.
          </p>
        </div>
      </div>

      {/* Main Settings Sections */}
      <div className="space-y-6">
        <ApiConfigForm />
      </div>
    </div>
  );
}
