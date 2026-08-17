import {
  consumeLoginTokenFile,
  createLoginTokenFile,
  getVendorAccountByEmailFile,
  getVendorAccountByIdFile,
  getVendorAccountBySlugFile,
  getVendorEntitlementsFile,
  getVendorPortalSummaryFile,
  getVendorProfileFile,
  getVendorSubscriptionsForAccountFile,
  provisionVendorSubscriptionFile,
  recordVendorClickFile,
  resetVendorStoreForTests as resetVendorStoreForTestsFile,
  updateVendorSubscriptionStatusFile,
  upsertVendorProfileFile,
} from '@/lib/vendor/vendorStoreFile';
import {
  consumeLoginTokenNeon,
  createLoginTokenNeon,
  getVendorAccountByEmailNeon,
  getVendorAccountByIdNeon,
  getVendorAccountBySlugNeon,
  getVendorEntitlementsNeon,
  getVendorPortalSummaryNeon,
  getVendorProfileNeon,
  getVendorSubscriptionsForAccountNeon,
  provisionVendorSubscriptionNeon,
  recordVendorClickNeon,
  updateVendorSubscriptionStatusNeon,
  upsertVendorProfileNeon,
} from '@/lib/vendor/vendorStoreNeon';
import type {
  ProvisionVendorInput,
  VendorAccount,
  VendorEntitlement,
  VendorPortalSummary,
  VendorProfileOverlay,
  VendorSubscription,
  VendorSubscriptionStatus,
} from '@/lib/vendor/types';

function useNeonVendorStore(): boolean {
  if (process.env.DATABASE_URL) return true;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL is required for vendor storage in production.');
  }
  return false;
}

export async function provisionVendorSubscription(
  input: ProvisionVendorInput,
): Promise<VendorAccount> {
  if (useNeonVendorStore()) return provisionVendorSubscriptionNeon(input);
  return provisionVendorSubscriptionFile(input);
}

export async function updateVendorSubscriptionStatus(
  subscriptionId: string,
  status: VendorSubscriptionStatus,
): Promise<void> {
  if (useNeonVendorStore()) {
    await updateVendorSubscriptionStatusNeon(subscriptionId, status);
    return;
  }
  updateVendorSubscriptionStatusFile(subscriptionId, status);
}

export async function getVendorAccountById(id: string): Promise<VendorAccount | null> {
  if (useNeonVendorStore()) return getVendorAccountByIdNeon(id);
  return getVendorAccountByIdFile(id);
}

export async function getVendorAccountByEmail(email: string): Promise<VendorAccount | null> {
  if (useNeonVendorStore()) return getVendorAccountByEmailNeon(email);
  return getVendorAccountByEmailFile(email);
}

export async function getVendorAccountBySlug(slug: string): Promise<VendorAccount | null> {
  if (useNeonVendorStore()) return getVendorAccountBySlugNeon(slug);
  return getVendorAccountBySlugFile(slug);
}

export async function getVendorSubscriptionsForAccount(
  accountId: string,
): Promise<VendorSubscription[]> {
  if (useNeonVendorStore()) return getVendorSubscriptionsForAccountNeon(accountId);
  return getVendorSubscriptionsForAccountFile(accountId);
}

export async function upsertVendorProfile(
  vendorSlug: string,
  patch: { logoUrl?: string | null; affiliateUrl?: string | null },
): Promise<VendorProfileOverlay> {
  if (useNeonVendorStore()) return upsertVendorProfileNeon(vendorSlug, patch);
  return upsertVendorProfileFile(vendorSlug, patch);
}

export async function getVendorProfile(vendorSlug: string): Promise<VendorProfileOverlay | null> {
  if (useNeonVendorStore()) return getVendorProfileNeon(vendorSlug);
  return getVendorProfileFile(vendorSlug);
}

export async function recordVendorClick(vendorSlug: string, context?: string): Promise<void> {
  if (useNeonVendorStore()) return recordVendorClickNeon(vendorSlug, context);
  recordVendorClickFile(vendorSlug, context);
}

export async function getVendorEntitlements(): Promise<Record<string, VendorEntitlement>> {
  if (useNeonVendorStore()) return getVendorEntitlementsNeon();
  return getVendorEntitlementsFile();
}

export async function createLoginToken(email: string): Promise<string> {
  if (useNeonVendorStore()) return createLoginTokenNeon(email);
  return createLoginTokenFile(email);
}

export async function consumeLoginToken(token: string): Promise<string | null> {
  if (useNeonVendorStore()) return consumeLoginTokenNeon(token);
  return consumeLoginTokenFile(token);
}

export async function getVendorPortalSummary(
  accountId: string,
): Promise<VendorPortalSummary | null> {
  if (useNeonVendorStore()) return getVendorPortalSummaryNeon(accountId);
  return getVendorPortalSummaryFile(accountId);
}

export async function resetVendorStoreForTests(): Promise<void> {
  resetVendorStoreForTestsFile();
}
