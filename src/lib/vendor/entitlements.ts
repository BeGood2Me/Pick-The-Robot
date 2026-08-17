import type { Vendor } from '@/lib/matching/types';
import type { VendorEntitlement } from '@/lib/vendor/types';

let entitlementCache: Record<string, VendorEntitlement> | null = null;

export function setVendorEntitlementCache(cache: Record<string, VendorEntitlement> | null): void {
  entitlementCache = cache;
}

export function applyVendorEntitlements(vendor: Vendor): Vendor {
  return mergeVendorWithEntitlement(vendor, entitlementCache?.[vendor.slug]);
}

export function mergeVendorWithEntitlement(
  vendor: Vendor,
  entitlement?: VendorEntitlement,
): Vendor {
  if (!entitlement) return vendor;

  return {
    ...vendor,
    sponsored: entitlement.sponsored || Boolean(vendor.sponsored),
    logoUrl: entitlement.logoUrl ?? vendor.logoUrl,
    affiliateUrl: entitlement.affiliateUrl ?? vendor.affiliateUrl,
  };
}

export function isVerifiedVendor(slug: string): boolean {
  return Boolean(entitlementCache?.[slug]?.verified);
}
