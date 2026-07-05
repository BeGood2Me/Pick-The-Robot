import { cn } from '@/lib/utils';
import { inputClassName } from './inputStyles';

export function Input({
  className,
  hasError,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return <input className={cn(inputClassName(hasError), className)} {...props} />;
}
