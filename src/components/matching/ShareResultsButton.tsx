'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { buildSharePayload, buildShareUrl } from '@/lib/matching/share';
import { trackResultsSaved } from '@/lib/matching';
import type { FormAnswers } from '@/lib/forms/types';
import type { RecommendationResult } from '@/lib/matching';

export function ShareResultsButton({
  answers,
  result,
}: {
  answers: FormAnswers;
  result: RecommendationResult;
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  async function handleShare() {
    const url = buildShareUrl(buildSharePayload(answers));
    trackResultsSaved({
      category: result.profile.category,
      robotType: result.bestRobotMatch.robotType,
      shareUrl: url,
    });

    try {
      await navigator.clipboard.writeText(url);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      setStatus('error');
    }
  }

  return (
    <Button type="button" variant="secondary" onClick={handleShare}>
      {status === 'copied' ? 'Link copied' : status === 'error' ? 'Copy failed — try again' : 'Copy share link'}
    </Button>
  );
}
