import Link from 'next/link';
import { ROBOT_VACUUMS_PATH } from '@/lib/content/home-vacuums';
import { cn } from '@/lib/utils';

function RobotVacuumIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="16" cy="16" r="10" />
      <circle cx="11" cy="14" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="21" cy="14" r="1.25" fill="currentColor" stroke="none" />
      <path d="M10 20h12" strokeLinecap="round" />
    </svg>
  );
}

function HumanoidIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="16" cy="8" r="3" />
      <path d="M16 11v8M12 14h8M13 26l3-7 3 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HomeRobotCategoryPicker() {
  return (
    <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Home robot category">
      <Link
        href={`${ROBOT_VACUUMS_PATH}#matcher`}
        className={cn(
          'group w-full rounded-xl border border-surface-border bg-surface p-4 text-left shadow-sm transition-[border-color,background-color,box-shadow,color] duration-150',
          'hover:border-accent hover:bg-accent hover:text-white hover:shadow-card',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        )}
      >
        <RobotVacuumIcon className="mb-2 h-8 w-8 text-accent transition-colors group-hover:text-white" />
        <span className="block font-semibold">Robot vacuums</span>
        <span className="mt-1 block text-sm text-ink-muted transition-colors group-hover:text-white/85">
          Hardwood, carpet, pets, mopping, and budget — ranked models from public specs.
        </span>
        <span className="mt-3 block text-sm font-semibold text-accent transition-colors group-hover:text-white">
          Start matching →
        </span>
      </Link>

      <div
        className="rounded-xl border border-dashed border-surface-border bg-surface/60 p-4 text-left opacity-90"
        aria-disabled="true"
      >
        <HumanoidIcon className="mb-2 h-8 w-8 text-ink-faint" />
        <span className="block font-semibold text-ink-muted">Home humanoids</span>
        <span className="mt-1 block text-sm text-ink-muted">
          Consumer humanoid helpers are on the roadmap — a separate matcher when we add them.
        </span>
        <span className="mt-3 block text-sm font-medium text-ink-faint">Coming later</span>
      </div>
    </div>
  );
}
