import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-hover': 'var(--bg-hover)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-muted': 'var(--text-muted)',
        'border-primary': 'var(--border-primary)',
        'border-focus': 'var(--border-focus)',
        'accent-current': 'var(--accent-current)',
        'accent-improved': 'var(--accent-improved)',
        'accent-info': 'var(--accent-info)',
        'accent-danger': 'var(--accent-danger)',
        'current-bg': 'var(--current-bg)',
        'current-border': 'var(--current-border)',
        'current-text': 'var(--current-text)',
        'improved-bg': 'var(--improved-bg)',
        'improved-border': 'var(--improved-border)',
        'improved-text': 'var(--improved-text)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
