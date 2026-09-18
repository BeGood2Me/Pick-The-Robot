'use client';



import { useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/Badge';

import { VendorMonogram } from '@/components/brand/VendorMonogram';

import { VendorCheckoutButton } from '@/components/vendor/VendorCheckoutButton';

import {
  FOR_VENDORS_LOGIN_PATH,
  FOR_VENDORS_PATH,
  VENDOR_TRACKED_OUTBOUND_VERIFIED_NOTE,
} from '@/lib/content/for-vendors';
import {
  VENDOR_PORTAL_TRACKED_OUTBOUND_FAQS,
  VENDOR_PORTAL_TRACKED_OUTBOUND_PROMPT,
} from '@/lib/content/vendor-portal';

import { VENDOR_LOGO_UPLOAD_GUIDANCE } from '@/lib/vendor/logoUpload';

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

  const [summary] = useState(initial);

  const [logoUrl, setLogoUrl] = useState(summary.profile?.logoUrl ?? '');

  const [trackedOutboundUrl, setTrackedOutboundUrl] = useState(summary.profile?.affiliateUrl ?? '');

  const [logoMessage, setLogoMessage] = useState<string | null>(null);

  const [clicksMessage, setClicksMessage] = useState<string | null>(null);

  const [logoUploading, setLogoUploading] = useState(false);

  const [trackedLinkSaving, setTrackedLinkSaving] = useState(false);

  const [billingLoading, setBillingLoading] = useState(false);



  async function uploadLogo(file: File) {

    setLogoMessage(null);

    setLogoUploading(true);

    try {

      const formData = new FormData();

      formData.set('logo', file);

      const response = await fetch('/api/vendor/profile/logo', {

        method: 'POST',

        body: formData,

      });

      const data = (await response.json()) as { logoUrl?: string; message?: string };

      if (!response.ok || !data.logoUrl) {

        throw new Error(data.message ?? 'Logo upload failed.');

      }

      setLogoUrl(data.logoUrl);

      setLogoMessage('Logo uploaded.');

      router.refresh();

    } catch (err) {

      setLogoMessage(err instanceof Error ? err.message : 'Logo upload failed.');

    } finally {

      setLogoUploading(false);

    }

  }



  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {

    const file = e.target.files?.[0];

    e.target.value = '';

    if (!file) return;

    void uploadLogo(file);

  }



  async function saveTrackedOutbound(e: React.FormEvent) {

    e.preventDefault();

    setClicksMessage(null);

    setTrackedLinkSaving(true);

    try {

      const response = await fetch('/api/vendor/profile', {

        method: 'PATCH',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({

          affiliateUrl: trackedOutboundUrl.trim() || null,

        }),

      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {

        throw new Error(data.message ?? 'Could not save tracked outbound link.');

      }

      setClicksMessage('Tracked outbound link saved.');

      router.refresh();

    } catch (err) {

      setClicksMessage(err instanceof Error ? err.message : 'Could not save tracked outbound link.');

    } finally {

      setTrackedLinkSaving(false);

    }

  }



  async function openBilling() {

    setBillingLoading(true);

    try {

      const response = await fetch('/api/vendor/portal', { method: 'POST' });

      const data = (await response.json()) as { url?: string; message?: string };

      if (!response.ok || !data.url) throw new Error(data.message ?? 'Billing portal unavailable.');

      window.location.href = data.url;

    } catch (err) {

      setClicksMessage(err instanceof Error ? err.message : 'Billing portal failed.');

      setBillingLoading(false);

    }

  }



  async function logout() {

    await fetch('/api/vendor/auth/logout', { method: 'POST' });

    router.push(FOR_VENDORS_LOGIN_PATH);

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



      <section className="grid gap-4 lg:grid-cols-2">

        <article className="card space-y-5">

          <div>

            <h2 className="text-lg font-semibold">Outbound clicks</h2>

            <p className="mt-2 text-sm text-pretty text-ink-muted">

              Clicks from your directory profile and matcher cards when buyers open your site.

            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div>

              <p className="text-3xl font-semibold">{summary.clickStats.last30Days}</p>

              <p className="text-sm text-ink-muted">Last 30 days</p>

            </div>

            <div>

              <p className="text-3xl font-semibold">{summary.clickStats.allTime}</p>

              <p className="text-sm text-ink-muted">All time</p>

            </div>

          </div>



          <div className="border-t border-surface-border pt-5">
            <h3 className="text-sm font-semibold text-ink">Tracked outbound link</h3>
            <p className="mt-1 text-sm text-ink-muted">{VENDOR_PORTAL_TRACKED_OUTBOUND_PROMPT}</p>

            {verified ? (
              <form onSubmit={saveTrackedOutbound} className="mt-4 space-y-3">
                <label className="sr-only" htmlFor="tracked-outbound-url">
                  Tracked outbound link
                </label>
                <input
                  id="tracked-outbound-url"
                  type="url"
                  value={trackedOutboundUrl}
                  onChange={(e) => setTrackedOutboundUrl(e.target.value)}
                  placeholder="https://yoursite.com/contact?utm_campaign=picktherobot"
                  className="w-full rounded-lg border border-surface-border px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  disabled={trackedLinkSaving}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
                >
                  {trackedLinkSaving ? 'Saving…' : 'Save tracked link'}
                </button>
              </form>
            ) : (
              <p className="mt-3 text-sm text-ink-muted">{VENDOR_TRACKED_OUTBOUND_VERIFIED_NOTE}</p>
            )}
            {clicksMessage && <p className="mt-3 text-sm text-ink-muted">{clicksMessage}</p>}

            <div className="mt-4 divide-y divide-surface-border border-t border-surface-border pt-4">
              {VENDOR_PORTAL_TRACKED_OUTBOUND_FAQS.map((item) => (
                <details key={item.question} className="group py-3">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-sm font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>
                    <span
                      aria-hidden
                      className="inline-block w-4 shrink-0 text-center text-ink-faint after:content-['+'] group-open:after:content-['−']"
                    />
                  </summary>
                  <p className="mt-2 text-sm text-pretty text-ink-muted">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>

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



      <section className="card space-y-4">

        <h2 className="text-lg font-semibold">Logo</h2>

        <p className="text-sm text-ink-muted">

          Shown on your directory profile and matcher cards when you are a Verified partner.

        </p>

        <div className="flex flex-wrap items-center gap-4">

          <VendorMonogram name={vendorListingName} logoUrl={logoUrl || undefined} size="md" />

          <div>

            <label

              htmlFor="logo-file"

              className="inline-flex cursor-pointer rounded-lg border border-surface-border bg-surface px-4 py-2 text-sm font-semibold hover:border-accent/40"

            >

              {logoUploading ? 'Uploading…' : logoUrl ? 'Replace logo' : 'Upload logo'}

            </label>

            <input

              id="logo-file"

              type="file"

              accept="image/png,image/jpeg,image/webp"

              disabled={logoUploading || !verified}

              onChange={handleLogoChange}

              className="sr-only"

            />

            <p className="mt-2 text-xs text-ink-faint">{VENDOR_LOGO_UPLOAD_GUIDANCE}</p>

            {!verified && (

              <p className="mt-1 text-xs text-ink-muted">Verified partner required to upload a logo.</p>

            )}

            {logoMessage && <p className="mt-2 text-sm text-ink-muted">{logoMessage}</p>}

          </div>

        </div>

      </section>



      <p className="text-sm text-ink-muted">

        View your listing:{' '}

        <Link href={`/vendors/${summary.account.vendorSlug}`} className="text-accent hover:underline">

          {vendorListingName}

        </Link>

      </p>

    </div>

  );

}


