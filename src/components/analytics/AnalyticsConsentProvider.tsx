'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AnalyticsScripts } from '@/components/analytics/AnalyticsScripts';
import { CookieConsentBanner } from '@/components/analytics/CookieConsentBanner';
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
    setConsent(readAnalyticsConsent());
    setHydrated(true);
  }, []);

  const showBanner = analyticsConfigured && hydrated && consent === null;
  const loadScripts = analyticsConfigured && consent === 'accepted';

  return (
    <AnalyticsConsentContext.Provider value={{ consent, setConsent }}>
      {loadScripts && <AnalyticsScripts />}
      {children}
      {showBanner && <CookieConsentBanner onChoice={setConsent} />}
    </AnalyticsConsentContext.Provider>
  );
}
