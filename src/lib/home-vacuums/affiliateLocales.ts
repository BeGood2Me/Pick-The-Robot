import type { HomeAffiliateLocale, HomeAffiliateUrls, HomeVacuumProduct } from './types';

export const HOME_AFFILIATE_LOCALES: HomeAffiliateLocale[] = ['US', 'UK'];

export const HOME_AFFILIATE_LOCALE_LABELS: Record<HomeAffiliateLocale, string> = {
  US: 'Amazon.com',
  UK: 'Amazon.co.uk',
};

export function isHomeAffiliateLocale(value: string): value is HomeAffiliateLocale {
  return (HOME_AFFILIATE_LOCALES as string[]).includes(value);
}

/** Resolve affiliate URL for a marketplace; falls back to legacy single affiliateUrl for US. */
export function resolveHomeAffiliateUrl(
  product: HomeVacuumProduct,
  locale: HomeAffiliateLocale,
): string | undefined {
  const fromMap = product.affiliateUrls?.[locale]?.trim();
  if (fromMap) return fromMap;
  if (locale === 'US' && product.affiliateUrl?.trim()) return product.affiliateUrl.trim();
  return undefined;
}

export function productHasAffiliate(
  product: HomeVacuumProduct,
  locale?: HomeAffiliateLocale,
): boolean {
  if (locale) return Boolean(resolveHomeAffiliateUrl(product, locale));
  if (product.affiliateUrl?.trim()) return true;
  const urls = product.affiliateUrls;
  if (!urls) return false;
  return HOME_AFFILIATE_LOCALES.some((key) => Boolean(urls[key]?.trim()));
}

export function availableAffiliateLocales(product: HomeVacuumProduct): HomeAffiliateLocale[] {
  return HOME_AFFILIATE_LOCALES.filter((locale) => Boolean(resolveHomeAffiliateUrl(product, locale)));
}

/** Normalize optional catalog maps (strip empty strings). */
export function normalizeAffiliateUrls(
  urls: HomeAffiliateUrls | undefined,
): HomeAffiliateUrls | undefined {
  if (!urls) return undefined;
  const next: HomeAffiliateUrls = {};
  for (const locale of HOME_AFFILIATE_LOCALES) {
    const value = urls[locale]?.trim();
    if (value) next[locale] = value;
  }
  return Object.keys(next).length > 0 ? next : undefined;
}

/**
 * Guess shop locale from browser language/timezone.
 * UK/Ireland → Amazon.co.uk, else Amazon.com.
 */
export function detectHomeAffiliateLocaleFromBrowser(): HomeAffiliateLocale {
  if (typeof navigator === 'undefined') return 'US';

  const locale = (navigator.language || 'en-US').toLowerCase();
  const locales = navigator.languages?.map((l) => l.toLowerCase()) ?? [locale];

  for (const loc of locales) {
    if (loc === 'en-gb' || loc.endsWith('-gb') || loc.endsWith('-ie')) return 'UK';
  }

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz === 'Europe/London' || tz === 'Europe/Dublin') return 'UK';
  } catch {
    // ignore
  }

  return 'US';
}
