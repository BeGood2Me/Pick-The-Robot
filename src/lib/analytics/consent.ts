export const CONSENT_STORAGE_KEY = 'ptr-analytics-consent';

export type AnalyticsConsent = 'accepted' | 'declined';

export function isAnalyticsConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  );
}

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (value === 'accepted' || value === 'declined') return value;
  } catch {
    // ignore storage errors
  }
  return null;
}

export function writeAnalyticsConsent(consent: AnalyticsConsent): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, consent);
  } catch {
    // ignore storage errors
  }
}
