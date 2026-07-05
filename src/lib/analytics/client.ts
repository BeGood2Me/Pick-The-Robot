import type { MatchEvent } from '@/lib/matching/types';

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

function eventNameForType(type: MatchEvent['type']): string {
  return type;
}

function sanitizePayload(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== 'object') return {};
  const flat: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'object') {
      flat[key] = JSON.stringify(value);
    } else {
      flat[key] = value;
    }
  }
  return flat;
}

/** Dispatch a match event to configured analytics providers. */
export function dispatchAnalyticsEvent(event: MatchEvent): void {
  const name = eventNameForType(event.type);
  const props = sanitizePayload(event.payload);

  if (typeof window !== 'undefined') {
    if (window.gtag && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      window.gtag('event', name, props);
    }

    if (window.plausible && process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
      window.plausible(name, { props });
    }

    if (process.env.NODE_ENV === 'development') {
      console.debug('[analytics]', name, props);
    }
  }
}
