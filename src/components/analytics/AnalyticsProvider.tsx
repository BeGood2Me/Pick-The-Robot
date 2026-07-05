'use client';

import { useEffect } from 'react';
import { useAnalyticsConsent } from '@/components/analytics/AnalyticsConsentProvider';
import { dispatchAnalyticsEvent } from '@/lib/analytics/client';
import { isAnalyticsConfigured } from '@/lib/analytics/consent';
import { setMatchEventHandler } from '@/lib/matching/events';

/** Wires match engine events to GA4 / Plausible when configured and consented. */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { consent } = useAnalyticsConsent();

  useEffect(() => {
    if (!isAnalyticsConfigured() || consent !== 'accepted') {
      setMatchEventHandler(null);
      return;
    }
    setMatchEventHandler(dispatchAnalyticsEvent);
    return () => setMatchEventHandler(null);
  }, [consent]);

  return children;
}
