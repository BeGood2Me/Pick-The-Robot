'use client';

import { useState } from 'react';
import type { ApiTier } from '@/lib/api/tiers';

interface ApiCheckoutButtonProps {
  tier: ApiTier;
  className?: string;
  children: React.ReactNode;
}

export function ApiCheckoutButton({ tier, className, children }: ApiCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });
      const data = (await response.json()) as { url?: string; message?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.message ?? 'Could not start checkout.');
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed.');
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={startCheckout} disabled={loading} className={className}>
        {loading ? 'Redirecting…' : children}
      </button>
      {error && <p className="mt-2 text-sm text-warn">{error}</p>}
    </div>
  );
}
