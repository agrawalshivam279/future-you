import { cn } from '../utils';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('handles conditional classes properly', () => {
    const isPrimary = true;
    const isSecondary = false;
    expect(cn('base', isPrimary && 'bg-primary', isSecondary && 'bg-secondary')).toBe('base bg-primary');
  });

  it('resolves tailwind class conflicts using tailwind-merge', () => {
    expect(cn('px-2 text-sm', 'px-4 text-lg')).toBe('px-4 text-lg');
  });
});
