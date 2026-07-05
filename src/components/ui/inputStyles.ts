import { cn } from '@/lib/utils';

export const inputClassName = (hasError?: boolean) =>
  cn(
    'w-full rounded-lg border bg-surface px-3 py-2 text-sm transition-colors',
    'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20',
    hasError ? 'border-red-300 ring-1 ring-red-200' : 'border-surface-border',
  );
