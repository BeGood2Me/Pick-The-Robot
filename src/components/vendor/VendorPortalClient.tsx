'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { VendorCheckoutButton } from '@/components/vendor/VendorCheckoutButton';
import { FOR_VENDORS_PATH } from '@/lib/content/for-vendors';
import type { VendorPortalSummary } from '@/lib/vendor/types';

function tierActive(summary: VendorPortalSummary, tier: 'verified' | 'sponsored'): boolean {
  return summary.subscriptions.some((s) => s.tier === tier && s.status === 'active');
}

export function VendorPortalClient({
  initial,
  vendorListingName,
}: {
  initial: VendorPortalSummary;
  vendorListingName: string;
}) {
  const router = useRouter();
  const [summary, setSummary] = useState(initial);
  const [logoUrl, setLogoUrl] = useState(summary.profile?.logoUrl ?? '');
  const [affiliateUrl, setAffiliateUrl] = useState(summary.profile?.affiliateUrl ?? '');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaveMessage(null);
    const response = await fetch('/api/vendor/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        logoUrl: logoUrl.trim() || null,
        affiliateUrl: affiliateUrl.trim() || null,
      }),
    });
    const data = (await response.json()) as { message?: string };
    if (!response.ok) {
      setSaveMessage(data.message ?? 'Could not save profile.');
      return;
    }
    setSaveMessage('Profile updated.');
    router.refresh();
  }

  async function openBilling() {
    setBillingLoading(true);
    try {
      const response = await fetch('/api/vendor/portal', { method: 'POST' });
      const data = (await response.json()) as { url?: string; message?: string };
      if (!response.ok || !data.url) throw new Error(data.message ?? 'Billing portal unavailable.');
      window.location.href = data.url;
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : 'Billing portal failed.');
      setBillingLoading(false);
    }
  }

  async function logout() {
    await fetch('/api/vendor/auth/logout', { method: 'POST' });
    router.push(`${FOR_VENDORS_PATH}/login`);
    router.refresh();
  }

  const verified = tierActive(summary, 'verified');
  const sponsored = tierActive(summary, 'sponsored');

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink-muted">{summary.account.email}</p>
          <h1 className="font-display text-3xl font-semibold">{vendorListingName}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {verified ? <Badge variant="success">Verified</Badge> : null}
            {sponsored ? <Badge variant="sponsored">Sponsored</Badge> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openBilling}
            disabled={billingLoading}
            className="rounded-lg border border-surface-border bg-surface px-4 py-2 text-sm font-semibold hover:border-accent/40"
          >
            {billingLoading ? 'Opening…' : 'Manage billing'}
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-surface-border px-4 py-2 text-sm font-semibold text-ink-muted hover:text-ink"
          >
            Log out
          </button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="card">
          <h2 className="text-lg font-semibold">Outbound clicks</h2>
          <p className="mt-2 text-3xl font-semibold">{summary.clickStats.last30Days}</p>
          <p className="text-sm text-ink-muted">Last 30 days</p>
          <p className="mt-3 text-sm text-ink-muted">{summary.clickStats.allTime} all time</p>
        </article>
        <article className="card">
          <h2 className="text-lg font-semibold">Subscriptions</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            {summary.subscriptions.length === 0 && <li>No active subscriptions yet.</li>}
            {summary.subscriptions.map((sub) => (
              <li key={sub.stripeSubscriptionId}>
                {sub.tier} — {sub.status}
              </li>
            ))}
          </ul>
          {!verified && (
            <div className="mt-4">
              <VendorCheckoutButton
                tier="verified"
                vendorSlug={summary.account.vendorSlug}
                className="inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                Subscribe — Verified
              </VendorCheckoutButton>
            </div>
          )}
          {verified && !sponsored && (
            <div className="mt-4">
              <VendorCheckoutButton
                tier="sponsored"
                vendorSlug={summary.account.vendorSlug}
                className="inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                Add sponsored boost
              </VendorCheckoutButton>
            </div>
          )}
        </article>
      </section>

      <form onSubmit={saveProfile} className="card space-y-4">
        <h2 className="text-lg font-semibold">Profile settings</h2>
        <p className="text-sm text-ink-muted">
          Logo and affiliate URL apply when your subscription is active. Use HTTPS URLs.
        </p>
        <div>
          <label className="text-sm font-medium" htmlFor="logo-url">
            Logo URL
          </label>
          <input
            id="logo-url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm"
            placeholder="https://…"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="affiliate-url">
            Affiliate URL (optional)
          </label>
          <input
            id="affiliate-url"
            value={affiliateUrl}
            onChange={(e) => setAffiliateUrl(e.target.value)}
            className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm"
            placeholder="https://…"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          Save profile
        </button>
        {saveMessage && <p className="text-sm text-ink-muted">{saveMessage}</p>}
      </form>

      <p className="text-sm text-ink-muted">
        View your listing:{' '}
        <Link href={`/vendors/${summary.account.vendorSlug}`} className="text-accent hover:underline">
          {vendorListingName}
        </Link>
      </p>
    </div>
  );
}
