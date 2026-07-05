import type { StepIconId } from '@/lib/forms/questions';

const icons: Record<StepIconId, React.ReactNode> = {
  labor: (
    <path
      d="M12 3v4M8 7h8M6 11h12v8H6z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  staffing: (
    <>
      <circle cx="9" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="15" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M5 18c0-2.5 2-4 4-4h6c2 0 4 1.5 4 4" stroke="currentColor" strokeWidth="1.75" />
    </>
  ),
  budget: (
    <path
      d="M6 8h12M6 12h8M6 16h10M4 4h16v16H4z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  readiness: (
    <path
      d="M12 4l2 4 4 .5-3 3 .8 4.5L12 14l-3.8 2 1-4.5-3-3L10 8z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
  ),
  facility: (
    <path
      d="M4 18V8l8-4 8 4v10M4 18l8 4 8-4"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  workflow: (
    <path
      d="M5 12h4l2-4 2 8 2-4h4"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  specifics: (
    <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.75" />
  ),
};

export function StepIcon({ id, className }: { id: StepIconId; className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      {icons[id]}
    </svg>
  );
}
