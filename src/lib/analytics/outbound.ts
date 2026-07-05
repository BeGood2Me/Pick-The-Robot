import { emitMatchEvent } from '@/lib/matching/events';
import type { Vendor } from '@/lib/matching/types';
import { isHttpsUrl } from '@/lib/vendors/validateUrls';

const SITE_SOURCE = 'picktherobot';

/**
 * Build tracked outbound URL — always uses the official `outboundUrl`.
 * UTM params are appended for attribution only.
 */
export function getOutboundUrl(vendor: Vendor, context?: string): string {
  const base = vendor.affiliateUrl ?? vendor.outboundUrl;

  if (!isHttpsUrl(base)) {
    return base;
  }

  try {
    const url = new URL(base);
    url.searchParams.set('utm_source', SITE_SOURCE);
    url.searchParams.set('utm_medium', vendor.affiliateUrl ? 'affiliate' : 'referral');
    url.searchParams.set('utm_campaign', vendor.slug);
    if (context) url.searchParams.set('utm_content', context);
    if (vendor.sponsored) url.searchParams.set('utm_term', 'sponsored');
    return url.toString();
  } catch {
    return base;
  }
}

export function trackVendorOutboundClick(vendor: Vendor, context?: string): void {
  emitMatchEvent({
    type: 'vendor_clicked',
    payload: {
      vendorId: vendor.id,
      vendorName: vendor.name,
      slug: vendor.slug,
      sponsored: vendor.sponsored ?? false,
      affiliate: Boolean(vendor.affiliateUrl),
      outboundUrl: getOutboundUrl(vendor, context),
      context,
    },
  });
}

export function trackAcquisitionModelViewed(model: string, context?: string): void {
  emitMatchEvent({
    type: 'acquisition_model_viewed',
    payload: { model, context },
  });
}
