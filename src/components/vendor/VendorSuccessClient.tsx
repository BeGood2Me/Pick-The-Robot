'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FOR_VENDORS_PATH } from '@/lib/content/for-vendors';

export function VendorSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    async function complete() {
      if (!sessionId) return;
      try {
        const response = await fetch(`/api/stripe/vendor-session?session_id=${encodeURIComponent(sessionId)}`);
        const data = (await response.json()) as { portalPath?: string; message?: string };
        if (!response.ok) {
          throw new Error(data.message ?? 'Could not complete checkout.');
        }
        if (!cancelled) router.replace(data.portalPath ?? `${FOR_VENDORS_PATH}/portal`);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Checkout completion failed.');
        }
      }
    }

    void complete();
    return () => {
      cancelled = true;
    };
  }, [sessionId, router]);

  if (!sessionId) {
    return (
      <p className="text-sm text-ink-muted">
        Missing checkout session.{' '}
        <Link href={FOR_VENDORS_PATH} className="text-accent hover:underline">
          Return to for vendors
        </Link>
        .
      </p>
    );
  }

  if (error) {
    return <p className="text-sm text-warn">{error}</p>;
  }

  return <p className="text-sm text-ink-muted">Activating your vendor account…</p>;
}
