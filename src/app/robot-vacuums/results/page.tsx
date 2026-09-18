import { Suspense } from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { HomeVacuumMatcher } from '@/components/home-vacuums/HomeVacuumMatcherLoader';
import { ROBOT_VACUUMS_PATH, ROBOT_VACUUMS_RESULTS_PATH } from '@/lib/content/home-vacuums';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'Robot vacuum match results',
  description:
    'Shared PickTheRobot home robot-vacuum recommendation — ranked models from your floors, pets, and budget answers.',
  path: ROBOT_VACUUMS_RESULTS_PATH,
  noIndex: true,
});

export default function RobotVacuumResultsPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Robot vacuums', href: ROBOT_VACUUMS_PATH },
          { label: 'Match results' },
        ]}
      />
      <h1 className="font-display text-3xl font-semibold">Robot vacuum match results</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        Shared results are encoded in the URL. Rankings are rules-based from public specs — not lab tests.
      </p>
      <section id="matcher" className="mt-8 scroll-mt-8">
        <Suspense fallback={<p className="text-sm text-ink-muted">Loading…</p>}>
          <HomeVacuumMatcher />
        </Suspense>
      </section>
    </div>
  );
}
