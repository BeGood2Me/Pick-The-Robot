'use client';

import { Suspense } from 'react';
import { MatchingTool as MatchingToolInner } from '@/components/matching/MatchingTool';
import { MatcherSkeleton } from '@/components/matching/MatcherSkeleton';

type MatchingToolProps = React.ComponentProps<typeof MatchingToolInner>;

export function MatchingTool(props: MatchingToolProps) {
  return (
    <Suspense fallback={<MatcherSkeleton />}>
      <MatchingToolInner {...props} />
    </Suspense>
  );
}
