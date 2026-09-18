'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  buildHomeVacuumSharePayload,
  buildHomeVacuumShareUrl,
} from '@/lib/home-vacuums/share';
import type { HomeVacuumAnswers } from '@/lib/home-vacuums/types';

export function HomeVacuumShareButton({ answers }: { answers: HomeVacuumAnswers }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  async function handleShare() {
    const url = buildHomeVacuumShareUrl(buildHomeVacuumSharePayload(answers));
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
