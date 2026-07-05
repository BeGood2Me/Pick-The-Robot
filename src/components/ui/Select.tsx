import { cn } from '@/lib/utils';
import { inputClassName } from './inputStyles';

export function Select({
  className,
  hasError,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }) {
  return (
    <select className={cn(inputClassName(hasError), className)} {...props}>
      {children}
    </select>
  );
}
