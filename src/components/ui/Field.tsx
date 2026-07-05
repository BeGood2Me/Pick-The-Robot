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
      {helpText && <p className="mb-1.5 text-xs text-ink-muted">{helpText}</p>}
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
