import { Suspense } from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ResultsSkeleton } from '@/components/matching/MatcherSkeleton';
import { MatchingTool } from '@/components/matching/MatchingTool';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'PickTheRobot — Pick the right robot for your business',
  description:
    'Shared PickTheRobot recommendation — robot type, acquisition model, and vendor matches.',
  path: '/results',
  noIndex: true,
});

export default function ResultsPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shared results' }]} />
      <h1 className="font-display text-3xl font-semibold">Match results</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Loaded from a share link. Edit answers to re-run the matcher.
      </p>
      <section id="matcher" className="mt-8 scroll-mt-8">
        <Suspense fallback={<ResultsSkeleton />}>
          <MatchingTool />
        </Suspense>
      </section>
    </div>
  );
}
