import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export const tw = (strings: TemplateStringsArray, ...substitutions: any[]) => String.raw(strings, ...substitutions);
