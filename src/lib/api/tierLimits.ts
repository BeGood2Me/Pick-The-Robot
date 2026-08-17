export type ApiTier = 'starter' | 'pro';

export const API_TIER_LIMITS = {
  starter: {
    maxVendors: 3,
    maxCatalogVendors: 50,
    attributionRequired: false,
    requestsPerMinute: 30,
    matchesPerMonth: 2_000,
  },
  pro: {
    maxVendors: 5,
    maxCatalogVendors: 200,
    attributionRequired: false,
    requestsPerMinute: 60,
    matchesPerMonth: 10_000,
  },
} as const;

export function isApiTier(value: string): value is ApiTier {
  return value === 'starter' || value === 'pro';
}
