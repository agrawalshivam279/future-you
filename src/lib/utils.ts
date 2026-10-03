import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple CSS class names safely using clsx and tailwind-merge.
 *
 * @param inputs - Array of class names, conditionals, or objects
 * @returns Combined, deduplicated Tailwind CSS class string
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
