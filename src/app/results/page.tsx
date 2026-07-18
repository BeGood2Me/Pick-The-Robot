import { Suspense } from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { MatchingTool } from '@/components/matching/MatchingToolLoader';
import { ResultsPageIntro } from '@/components/matching/ResultsPageIntro';
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
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Match results' }]} />
      <h1 className="font-display text-3xl font-semibold">Match results</h1>
      <Suspense fallback={<p className="mt-2 text-sm text-ink-muted">Loading…</p>}>
        <ResultsPageIntro />
      </Suspense>
      <section id="matcher" className="mt-8 scroll-mt-8">
        <MatchingTool />
      </section>
    </div>
  );
}
