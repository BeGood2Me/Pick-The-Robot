/**
 * Detect likely vendor region from browser locale/timezone.
 * Used as default on first form load; user can override.
 */
export type VendorRegion = 'US' | 'EU' | 'UK' | 'APAC';

const APAC_LOCALES = new Set([
  'ja', 'ko', 'zh', 'zh-cn', 'zh-tw', 'zh-hk', 'th', 'vi', 'id', 'ms', 'tl', 'hi', 'en-au', 'en-nz', 'en-sg',
]);

const EU_COUNTRY_CODES = new Set([
  'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'sv', 'da', 'fi', 'no', 'cs', 'hu', 'ro', 'el', 'at', 'be', 'ie',
]);

export function detectRegionFromBrowser(): VendorRegion {
  if (typeof navigator === 'undefined') return 'US';

  const locale = (navigator.language || 'en-US').toLowerCase();
  const locales = navigator.languages?.map((l) => l.toLowerCase()) ?? [locale];

  for (const loc of locales) {
    if (loc === 'en-gb' || loc.endsWith('-gb')) return 'UK';
  }

  for (const loc of locales) {
    const base = loc.split('-')[0];
    if (APAC_LOCALES.has(loc) || APAC_LOCALES.has(base)) return 'APAC';
  }

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.startsWith('Europe/') && !tz.includes('London')) return 'EU';
    if (tz === 'Europe/London') return 'UK';
    if (tz.startsWith('Asia/') || tz.startsWith('Australia/') || tz.startsWith('Pacific/')) return 'APAC';
  } catch {
    // ignore
  }

  for (const loc of locales) {
    const base = loc.split('-')[0];
    if (EU_COUNTRY_CODES.has(base)) return 'EU';
  }

  return 'US';
}
