export const VENDOR_TIERS = ['verified', 'sponsored'] as const;

export type VendorTier = (typeof VENDOR_TIERS)[number];

export const VENDOR_TIER_PRICES_USD = {
  verified: 99,
  sponsored: 49,
} as const;

export function isVendorTier(value: string | null | undefined): value is VendorTier {
  return value === 'verified' || value === 'sponsored';
}

export function vendorStripePriceEnvKey(tier: VendorTier): string {
  return tier === 'verified'
    ? 'STRIPE_VENDOR_VERIFIED_PRICE_ID'
    : 'STRIPE_VENDOR_SPONSORED_PRICE_ID';
}
