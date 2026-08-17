'use client';

import { useMemo, useState } from 'react';
import { VENDORS } from '@/lib/matching/vendors';
import { VENDOR_TIER_PRICES_USD } from '@/lib/vendor/tiers';
import { VendorCheckoutButton } from '@/components/vendor/VendorCheckoutButton';

const PRIMARY_BUTTON_CLASS =
  'inline-flex w-full justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60';

export function VendorSubscribeSection() {
  const [vendorSlug, setVendorSlug] = useState('');
  const vendors = useMemo(
    () => [...VENDORS].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  return (
    <section className="card border-accent/30 bg-accent-soft/15">
      <h2 className="text-lg font-semibold">Subscribe</h2>
      <p className="mt-2 text-sm text-ink-muted">
        Select your vendor listing from our directory, then checkout with Stripe. You will land in the
        vendor portal immediately after payment.
      </p>
      <label className="mt-4 block text-sm font-medium text-ink" htmlFor="vendor-listing">
        Your vendor listing
      </label>
      <select
        id="vendor-listing"
        value={vendorSlug}
        onChange={(e) => setVendorSlug(e.target.value)}
        className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm"
      >
        <option value="">Select a listing…</option>
        {vendors.map((vendor) => (
          <option key={vendor.slug} value={vendor.slug}>
            {vendor.name}
          </option>
        ))}
      </select>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-surface-border bg-surface p-4">
          <p className="font-semibold">Verified partner</p>
          <p className="mt-1 text-2xl font-semibold">${VENDOR_TIER_PRICES_USD.verified}/mo</p>
          <VendorCheckoutButton
            tier="verified"
            vendorSlug={vendorSlug}
            className={PRIMARY_BUTTON_CLASS}
          >
            Subscribe — Verified
          </VendorCheckoutButton>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface p-4">
          <p className="font-semibold">Sponsored boost</p>
          <p className="mt-1 text-2xl font-semibold">+${VENDOR_TIER_PRICES_USD.sponsored}/mo</p>
          <p className="mt-1 text-xs text-ink-muted">Requires active Verified partner.</p>
          <VendorCheckoutButton
            tier="sponsored"
            vendorSlug={vendorSlug}
            className={PRIMARY_BUTTON_CLASS}
          >
            Add sponsored boost
          </VendorCheckoutButton>
        </div>
      </div>
    </section>
  );
}
