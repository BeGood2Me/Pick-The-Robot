import Link from 'next/link';
import {
  BLOG_INDEX_PATH,
  blogPillarPath,
  getAllBlogPillars,
  getBlogPillarBySlug,
} from '@/lib/content/blog';

interface BlogTopBarProps {
  activePillarSlug?: string;
}

export function BlogTopBar({ activePillarSlug }: BlogTopBarProps) {
  const pillars = getAllBlogPillars();

  return (
    <nav
      aria-label="Blog navigation"
      className="border-b border-surface-border bg-surface/80 backdrop-blur-sm"
    >
      <div className="container-page flex flex-wrap items-center gap-x-4 gap-y-2 py-3 text-sm">
        <Link href={BLOG_INDEX_PATH} className="font-semibold text-ink hover:text-accent">
          Blog
        </Link>
        <span className="text-ink-faint" aria-hidden>
          /
        </span>
        <span className="text-ink-muted">Topics</span>
        <ul className="flex flex-wrap gap-2">
          {pillars.map((pillar) => {
            const active = pillar.slug === activePillarSlug;
            return (
              <li key={pillar.slug}>
                <Link
                  href={blogPillarPath(pillar.slug)}
                  className={
                    active
                      ? 'rounded-full bg-accent px-3 py-1 font-medium text-white'
                      : 'rounded-full border border-surface-border px-3 py-1 text-ink-muted hover:border-accent/40 hover:text-ink'
                  }
                  aria-current={active ? 'page' : undefined}
                >
                  {pillar.h1}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export function BlogTopicList({ activePillarSlug }: BlogTopBarProps) {
  const pillars = getAllBlogPillars();

  return (
    <nav aria-label="Topic clusters" className="border-t border-surface-border pt-6">
      <p className="text-sm font-semibold text-ink">Explore by topic</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {pillars.map((pillar) => (
          <li key={pillar.slug}>
            <Link
              href={blogPillarPath(pillar.slug)}
              className="inline-flex rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-ink-muted transition hover:border-accent/40 hover:text-ink"
            >
              {pillar.h1}
              {activePillarSlug === pillar.slug && (
                <span className="sr-only"> (current topic)</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function BlogPillarLabel({ pillarSlug }: { pillarSlug: string }) {
  const pillar = getBlogPillarBySlug(pillarSlug);
  if (!pillar) return null;
  return (
    <Link
      href={blogPillarPath(pillar.slug)}
      className="text-sm font-medium text-accent hover:underline"
    >
      {pillar.h1}
    </Link>
  );
}

const DEFAULT_EDITORIAL_DISCLAIMER =
  'PickTheRobot is a buyer-side research tool, not a robotics dealer or integrator. Figures in this article are illustrative — compiled from publicly discussed market ranges to help you budget before vendor quotes. Verify pricing, safety requirements, and deployment scope with qualified vendors.';

export function BlogEditorialNote({ disclaimer }: { disclaimer?: string }) {
  return (
    <aside className="card border-amber-500/20 bg-amber-500/5">
      <p className="text-sm font-semibold text-ink">Editorial note</p>
      <p className="mt-2 text-sm text-ink-muted">{disclaimer ?? DEFAULT_EDITORIAL_DISCLAIMER}</p>
    </aside>
  );
}
