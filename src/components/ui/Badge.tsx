import { cn } from '@/lib/utils';

const styles = {
  default: 'bg-surface-soft text-ink-muted border border-surface-border',
  accent: 'bg-accent-soft text-accent',
  sponsored: 'bg-warn-soft text-warn',
  confidence: 'bg-warn-soft text-warn',
  success: 'bg-emerald-50 text-emerald-800',
} as const;

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof styles;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
