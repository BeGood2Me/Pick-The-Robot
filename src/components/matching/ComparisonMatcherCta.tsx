'use client';

import { MatchingTool } from '@/components/matching/MatchingTool';
import { StickyMatcherCta } from '@/components/layout/StickyMatcherCta';
import { CATEGORY_LABELS } from '@/lib/forms';
import type { RobotCategory } from '@/lib/matching';

export function ComparisonMatcherCta({ category }: { category: RobotCategory }) {
  return (
    <>
      <section id="matcher" className="mt-10 scroll-mt-8 border-y border-surface-border py-8">
        <h2 className="text-xl font-semibold">Not sure which fits your operation?</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Run the {CATEGORY_LABELS[category].toLowerCase()} matcher — robot type, acquisition model, and
          vendors ranked from your inputs.
        </p>
        <div className="mt-4">
          <MatchingTool initialCategory={category} />
        </div>
      </section>
      <StickyMatcherCta href="#matcher" />
    </>
  );
}
