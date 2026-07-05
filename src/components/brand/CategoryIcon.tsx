import type { ReactNode } from 'react';
import type { RobotCategory } from '@/lib/matching/types';

const paths: Record<RobotCategory, ReactNode> = {
  warehouse: (
    <path
      d="M4 18V8l8-4 8 4v10M4 18l8 4 8-4M12 4v18"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  cleaning: (
    <>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </>
  ),
  restaurant: (
    <path
      d="M6 8v12M10 6v14M14 10c2 0 4 2 4 5v5H10v-5c0-3 2-5 4-5z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

export function CategoryIcon({
  category,
  className,
}: {
  category: RobotCategory;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      {paths[category]}
    </svg>
  );
}
