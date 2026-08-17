'use client';

import { useState } from 'react';
import type { VendorTier } from '@/lib/vendor/tiers';

export function VendorCheckoutButton({
  tier,
  vendorSlug,
  className,
  children,
  disabled,
}: {
  tier: VendorTier;
  vendorSlug: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    if (!vendorSlug) {
      setError('Select your vendor listing first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/stripe/vendor-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, vendorSlug }),
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
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading || disabled || !vendorSlug}
        className={className}
      >
        {loading ? 'Redirecting…' : children}
      </button>
      {error && <p className="mt-2 text-sm text-warn">{error}</p>}
    </div>
  );
}
