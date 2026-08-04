'use client';

import { Suspense } from 'react';
import {
  MatchingTool as MatchingToolInner,
  type MatcherPhase,
} from '@/components/matching/MatchingTool';
import { MatcherSkeleton } from '@/components/matching/MatcherSkeleton';

type MatchingToolProps = React.ComponentProps<typeof MatchingToolInner>;

export type { MatcherPhase };

export function MatchingTool(props: MatchingToolProps) {
  return (
    <Suspense fallback={<MatcherSkeleton />}>
      <MatchingToolInner {...props} />
    </Suspense>
  );
}
