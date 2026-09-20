import { cn } from '@/lib/utils';

export function Field({
  id,
  label,
  helpText,
  error,
  className,
  children,
  fullWidth,
}: {
  id: string;
  label: string;
  helpText?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={cn(fullWidth ? 'sm:col-span-2' : '', className)}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {/* Always reserve one help line so adjacent grid selects share the same top edge. */}
      <p
        className={cn('mb-1.5 min-h-4 text-xs', helpText ? 'text-ink-muted' : 'invisible')}
        aria-hidden={!helpText}
      >
        {helpText || '\u00a0'}
      </p>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
