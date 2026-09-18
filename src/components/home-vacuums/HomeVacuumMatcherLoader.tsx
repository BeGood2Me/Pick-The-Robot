'use client';

import { Suspense } from 'react';
import {
  HomeVacuumMatcher as HomeVacuumMatcherInner,
  type HomeVacuumMatcherPhase,
} from '@/components/home-vacuums/HomeVacuumMatcher';
import { MatcherSkeleton } from '@/components/matching/MatcherSkeleton';

type HomeVacuumMatcherProps = React.ComponentProps<typeof HomeVacuumMatcherInner>;

export type { HomeVacuumMatcherPhase };

export function HomeVacuumMatcher(props: HomeVacuumMatcherProps) {
  return (
    <Suspense fallback={<MatcherSkeleton />}>
      <HomeVacuumMatcherInner {...props} />
    </Suspense>
  );
}
