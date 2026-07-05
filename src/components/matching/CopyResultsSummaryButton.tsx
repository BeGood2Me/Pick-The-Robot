'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { formatResultsSummary } from '@/lib/matching/formatSummary';
import type { RecommendationResult } from '@/lib/matching';

export function CopyResultsSummaryButton({ result }: { result: RecommendationResult }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatResultsSummary(result));
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      setStatus('error');
    }
  }

  return (
    <Button type="button" variant="secondary" onClick={handleCopy}>
      {status === 'copied'
        ? 'Summary copied'
        : status === 'error'
          ? 'Copy failed'
          : 'Copy summary'}
    </Button>
  );
}
