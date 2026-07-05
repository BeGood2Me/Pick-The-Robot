import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-surface-border/60 motion-reduce:animate-none', className)}
      aria-hidden
    />
  );
}
