'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { decodeSharePayload } from '@/lib/matching/share';

export function ResultsPageIntro() {
  const shareToken = useSearchParams().get('share');
  const hasValidShare = shareToken ? decodeSharePayload(shareToken) !== null : false;

  if (hasValidShare) {
    return (
      <p className="mt-2 text-sm text-ink-muted">
        Loaded from a share link. Edit answers below to re-run the matcher.
      </p>
    );
  }

  if (shareToken) {
    return (
      <p className="mt-2 text-sm text-ink-muted" role="status">
        This share link is invalid or expired.{' '}
        <Link href="/#matcher" className="font-medium text-accent hover:underline">
          Start a new match
        </Link>{' '}
        instead.
      </p>
    );
  }

  return (
    <p className="mt-2 text-sm text-ink-muted">
      No share link detected.{' '}
      <Link href="/#matcher" className="font-medium text-accent hover:underline">
        Start a new match
      </Link>{' '}
      or paste a share URL with <code className="text-xs">?share=</code> to view saved results.
    </p>
  );
}
