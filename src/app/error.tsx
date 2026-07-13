'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-16 text-center">
      <h1 className="font-display text-3xl font-semibold">Something went wrong</h1>
      <p className="mx-auto mt-3 max-w-md text-ink-muted">
        The matcher hit an unexpected error. You can try again or return to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Link
          href="/#matcher"
          className="inline-flex items-center rounded-lg border border-surface-border px-4 py-2.5 text-sm font-semibold hover:bg-surface-soft"
        >
          Back to matcher
        </Link>
      </div>
    </div>
  );
}
