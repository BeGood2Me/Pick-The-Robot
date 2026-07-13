'use client';

import dynamic from 'next/dynamic';
import { MatcherSkeleton } from '@/components/matching/MatcherSkeleton';

export const MatchingTool = dynamic(
  () => import('@/components/matching/MatchingTool').then((mod) => mod.MatchingTool),
  { loading: () => <MatcherSkeleton /> },
);
