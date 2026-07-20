import Link from 'next/link';
import { categoryGuideHref } from '@/lib/content/navigation';
import type { RobotCategory } from '@/lib/matching';

const EXPLORE_LINKS: { href: string; label: string }[] = (
  ['warehouse', 'cleaning', 'restaurant'] as RobotCategory[]
).map((category) => ({
  href: categoryGuideHref(category),
  label: category.charAt(0).toUpperCase() + category.slice(1),
}));

export function HomeExploreStrip() {
  return (
    <nav
      aria-label="Explore guides"
      className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:justify-start"
    >
      {EXPLORE_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-full border border-surface-border bg-surface px-3 py-1.5 text-sm font-medium text-ink-muted transition hover:border-accent/40 hover:text-ink"
        >
          {link.label}
        </Link>
      ))}
      <Link
        href="/best"
        className="rounded-full border border-surface-border bg-surface px-3 py-1.5 text-sm font-medium text-ink-muted transition hover:border-accent/40 hover:text-ink"
      >
        Best for facility
      </Link>
      <Link
        href="/integrations"
        className="rounded-full border border-surface-border bg-surface px-3 py-1.5 text-sm font-medium text-ink-muted transition hover:border-accent/40 hover:text-ink"
      >
        Integrations
      </Link>
      <Link
        href="/blog"
        className="rounded-full border border-surface-border bg-surface px-3 py-1.5 text-sm font-medium text-ink-muted transition hover:border-accent/40 hover:text-ink"
      >
        Blog
      </Link>
      <Link
        href="/about"
        className="rounded-full border border-surface-border bg-surface px-3 py-1.5 text-sm font-medium text-ink-muted transition hover:border-accent/40 hover:text-ink"
      >
        About
      </Link>
    </nav>
  );
}
