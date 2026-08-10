'use client';

import Link from 'next/link';
import { StickyMatcherCta } from '@/components/layout/StickyMatcherCta';
import { CATEGORY_LABELS } from '@/lib/forms';
import { CATEGORY_ROUTES, HOME_MATCHER_RESET_HREF } from '@/lib/content/navigation';
import type { RobotCategory } from '@/lib/matching';

function matcherHref(category?: RobotCategory | null): string {
  if (category) return `${CATEGORY_ROUTES[category]}#matcher`;
  return HOME_MATCHER_RESET_HREF;
}

export function ComparisonMatcherCta({ category }: { category?: RobotCategory | null }) {
  const href = matcherHref(category);
  const label = category ? CATEGORY_LABELS[category].toLowerCase() : null;

  return (
    <>
      <section id="matcher" className="mt-10 scroll-mt-8 rounded-xl border border-surface-border bg-surface px-5 py-6 sm:px-6">
        <h2 className="text-xl font-semibold text-ink">Not sure which fits your operation?</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          {label
            ? `Run the ${label} matcher for a scored robot type, buy vs lease vs RaaS, and ranked vendors from your facility inputs.`
            : 'Run the matcher — pick warehouse, cleaning, or restaurant — then get a scored robot type, acquisition model, and vendor rankings.'}
        </p>
        <p className="mt-4">
          <Link
            href={href}
            className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            {label ? `Run ${label} matcher` : 'Run the matcher'}
          </Link>
        </p>
      </section>
      <StickyMatcherCta href={href} />
    </>
  );
}
