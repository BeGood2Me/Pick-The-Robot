import { emitMatchEvent } from '@/lib/matching/events';
import { isHttpsUrl } from '@/lib/vendors/validateUrls';
import {
  detectHomeAffiliateLocaleFromBrowser,
  productHasAffiliate,
  resolveHomeAffiliateUrl,
} from './affiliateLocales';
import type { HomeAffiliateLocale, HomeVacuumProduct } from './types';

const SITE_SOURCE = 'picktherobot';

export function getHomeVacuumOutboundUrl(
  product: HomeVacuumProduct,
  context?: string,
  locale: HomeAffiliateLocale = 'US',
): string {
  const affiliate = resolveHomeAffiliateUrl(product, locale);
  const base = affiliate ?? product.outboundUrl;
  if (!isHttpsUrl(base)) return base;

  try {
    const url = new URL(base);
    url.searchParams.set('utm_source', SITE_SOURCE);
    url.searchParams.set('utm_medium', affiliate ? 'affiliate' : 'referral');
    url.searchParams.set('utm_campaign', product.slug);
    url.searchParams.set('utm_term', 'home-vacuum');
    if (context) url.searchParams.set('utm_content', context);
    if (affiliate) url.searchParams.set('utm_locale', locale);
    return url.toString();
  } catch {
    return base;
  }
}

/** Client helper: pick locale from browser when caller does not pass one. */
export function getHomeVacuumOutboundUrlForBrowser(
  product: HomeVacuumProduct,
  context?: string,
  locale?: HomeAffiliateLocale,
): string {
  const resolved = locale ?? detectHomeAffiliateLocaleFromBrowser();
  return getHomeVacuumOutboundUrl(product, context, resolved);
}

export function trackHomeVacuumOutboundClick(
  product: HomeVacuumProduct,
  context?: string,
  locale: HomeAffiliateLocale = 'US',
): void {
  emitMatchEvent({
    type: 'vendor_clicked',
    payload: {
      track: 'home_vacuum',
      productId: product.id,
      productName: `${product.brand} ${product.name}`,
      slug: product.slug,
      affiliate: productHasAffiliate(product, locale),
      affiliateLocale: locale,
      outboundUrl: getHomeVacuumOutboundUrl(product, context, locale),
      context,
    },
  });
}

export {
  detectHomeAffiliateLocaleFromBrowser,
  HOME_AFFILIATE_LOCALE_LABELS,
  HOME_AFFILIATE_LOCALES,
  isHomeAffiliateLocale,
  productHasAffiliate,
  resolveHomeAffiliateUrl,
} from './affiliateLocales';
