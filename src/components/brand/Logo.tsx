import Link from 'next/link';
import { HOME_MATCHER_RESET_HREF, SITE_NAME } from '@/lib/content/navigation';
import { RobotMarkSvg } from '@/lib/brand/robotMark';

type LogoProps = {
  className?: string;
};

export function Logo({ className = '' }: LogoProps) {
  return (
    <Link
      href={HOME_MATCHER_RESET_HREF}
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="PickTheRobot home"
    >
      <span className="relative shrink-0">
        <RobotMarkSvg size={28} className="shadow-sm transition-transform group-hover:scale-[1.03]" />
        <span
          className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-accent"
          aria-hidden
        />
      </span>
      <span className="hidden font-display text-lg font-semibold tracking-tight text-ink sm:inline">
        {SITE_NAME}
      </span>
    </Link>
  );
}
