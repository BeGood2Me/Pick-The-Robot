import type { VendorTier } from '@/lib/vendor/tiers';

export type VendorSubscriptionStatus = 'active' | 'past_due' | 'canceled';

export interface VendorAccount {
  id: string;
  email: string;
  vendorSlug: string;
  stripeCustomerId: string | null;
  createdAt: string;
}

export interface VendorSubscription {
  stripeSubscriptionId: string;
  vendorAccountId: string;
  tier: VendorTier;
  status: VendorSubscriptionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VendorProfileOverlay {
  vendorSlug: string;
  logoUrl: string | null;
  affiliateUrl: string | null;
  updatedAt: string;
}

export interface VendorEntitlement {
  verified: boolean;
  sponsored: boolean;
  logoUrl?: string;
  affiliateUrl?: string;
}

export interface ProvisionVendorInput {
  email: string;
  vendorSlug: string;
  customerId: string;
  checkoutSessionId: string;
  subscriptionId: string;
  tier: VendorTier;
}

export interface VendorPortalSummary {
  account: VendorAccount;
  subscriptions: VendorSubscription[];
  profile: VendorProfileOverlay | null;
  clickStats: { last30Days: number; allTime: number };
}
