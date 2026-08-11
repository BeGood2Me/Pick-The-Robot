'use client';

import Link from 'next/link';
import { writeAnalyticsConsent, type AnalyticsConsent } from '@/lib/analytics/consent';
import { Button } from '@/components/ui/Button';

export function CookieConsentBanner({ onChoice }: { onChoice: (consent: AnalyticsConsent) => void }) {
  function choose(consent: AnalyticsConsent) {
    writeAnalyticsConsent(consent);
    onChoice(consent);
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-surface-border bg-surface p-4 shadow-lg sm:p-5"
    >
      <div className="container-page flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl text-sm">
          <p id="cookie-consent-title" className="font-semibold text-ink">
            We use cookies
          </p>
          <p id="cookie-consent-desc" className="mt-1 text-ink-muted">
            We use cookies to understand how the site is used.{' '}
            <Link href="/privacy" className="font-medium text-accent hover:underline">
              Privacy policy
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => choose('declined')}>
            Reject
          </Button>
          <Button type="button" onClick={() => choose('accepted')}>
            Accept cookies
          </Button>
        </div>
      </div>
    </div>
  );
}
