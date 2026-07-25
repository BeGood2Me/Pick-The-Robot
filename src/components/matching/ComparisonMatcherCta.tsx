'use client';

import { MatchingTool } from '@/components/matching/MatchingToolLoader';
import { StickyMatcherCta } from '@/components/layout/StickyMatcherCta';
import { CATEGORY_LABELS } from '@/lib/forms';
import type { RobotCategory } from '@/lib/matching';

export function ComparisonMatcherCta({ category }: { category?: RobotCategory | null }) {
  return (
    <>
      <section id="matcher" className="mt-10 scroll-mt-8 border-y border-surface-border py-8">
        <h2 className="text-xl font-semibold">Not sure which fits your operation?</h2>
        <p className="mt-1 text-sm text-ink-muted">
          {category
            ? `Run the ${CATEGORY_LABELS[category].toLowerCase()} matcher — robot type, acquisition model, and vendors ranked from your inputs.`
            : 'Run the matcher — pick warehouse, cleaning, or restaurant, then get robot type, acquisition model, and vendor rankings from your inputs.'}
        </p>
        <div className="mt-4">
          <MatchingTool initialCategory={category ?? null} />
        </div>
      </section>
      <StickyMatcherCta href="#matcher" />
    </>
  );
}
