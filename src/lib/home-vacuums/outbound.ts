import { emitMatchEvent } from '@/lib/matching/events';
import { isHttpsUrl } from '@/lib/vendors/validateUrls';
import type { HomeVacuumProduct } from './types';

const SITE_SOURCE = 'picktherobot';

export function getHomeVacuumOutboundUrl(product: HomeVacuumProduct, context?: string): string {
  const base = product.affiliateUrl ?? product.outboundUrl;
  if (!isHttpsUrl(base)) return base;

  try {
    const url = new URL(base);
    url.searchParams.set('utm_source', SITE_SOURCE);
    url.searchParams.set('utm_medium', product.affiliateUrl ? 'affiliate' : 'referral');
    url.searchParams.set('utm_campaign', product.slug);
    url.searchParams.set('utm_term', 'home-vacuum');
    if (context) url.searchParams.set('utm_content', context);
    return url.toString();
  } catch {
    return base;
  }
}

export function trackHomeVacuumOutboundClick(product: HomeVacuumProduct, context?: string): void {
  emitMatchEvent({
    type: 'vendor_clicked',
    payload: {
      track: 'home_vacuum',
      productId: product.id,
      productName: `${product.brand} ${product.name}`,
      slug: product.slug,
      affiliate: Boolean(product.affiliateUrl),
      outboundUrl: getHomeVacuumOutboundUrl(product, context),
      context,
    },
  });
}
