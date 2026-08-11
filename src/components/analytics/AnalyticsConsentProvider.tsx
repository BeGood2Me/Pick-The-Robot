'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  GoogleAnalyticsScripts,
  PlausibleScript,
} from '@/components/analytics/AnalyticsScripts';
import { CookieConsentBanner } from '@/components/analytics/CookieConsentBanner';
import { applyGoogleAnalyticsConsent } from '@/lib/analytics/client';
import {
  isAnalyticsConfigured,
  readAnalyticsConsent,
  type AnalyticsConsent,
} from '@/lib/analytics/consent';

const AnalyticsConsentContext = createContext<{
  consent: AnalyticsConsent | null;
  setConsent: (consent: AnalyticsConsent) => void;
} | null>(null);

export function useAnalyticsConsent() {
  const ctx = useContext(AnalyticsConsentContext);
  if (!ctx) {
    throw new Error('useAnalyticsConsent must be used within AnalyticsConsentProvider');
  }
  return ctx;
}

export function AnalyticsConsentProvider({ children }: { children: React.ReactNode }) {
  const analyticsConfigured = isAnalyticsConfigured();
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readAnalyticsConsent();
    setConsent(stored);
    setHydrated(true);
    if (stored) {
      applyGoogleAnalyticsConsent(stored);
    }
  }, []);

  function handleConsentChoice(next: AnalyticsConsent) {
    setConsent(next);
    applyGoogleAnalyticsConsent(next);
  }

  const showBanner = analyticsConfigured && hydrated && consent === null;
  const loadPlausible = analyticsConfigured && consent === 'accepted';
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <AnalyticsConsentContext.Provider value={{ consent, setConsent }}>
      {gaId ? <GoogleAnalyticsScripts /> : null}
      {loadPlausible ? <PlausibleScript /> : null}
      {children}
      {showBanner ? <CookieConsentBanner onChoice={handleConsentChoice} /> : null}
    </AnalyticsConsentContext.Provider>
  );
}
