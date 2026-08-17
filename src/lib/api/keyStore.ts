import {
  lookupTierByApiKeyFile,
  peekPendingApiKeyFile,
  pendingKeyWasRetrievedFile,
  provisionApiKeyFile,
  resetKeyStoreForTestsFile,
  retrievePendingApiKeyFile,
  revokeKeysForCustomerFile,
  revokeKeysForSubscriptionFile,
  rotateApiKeyForCheckoutFile,
  updateTierForSubscriptionFile,
  verifyRecoveryTokenFile,
  issueRecoveryTokenFile,
} from './keyStoreFile';
import {
  lookupTierByApiKeyNeon,
  peekPendingApiKeyNeon,
  pendingKeyWasRetrievedNeon,
  provisionApiKeyNeon,
  resetKeyStoreForTestsNeon,
  retrievePendingApiKeyNeon,
  revokeKeysForCustomerNeon,
  revokeKeysForSubscriptionNeon,
  rotateApiKeyForCheckoutNeon,
  updateTierForSubscriptionNeon,
  verifyRecoveryTokenNeon,
  issueRecoveryTokenNeon,
} from './keyStoreNeon';
import type { ProvisionApiKeyInput, ProvisionResult } from './keyStoreTypes';
import type { ApiTier } from './tierLimits';

export { generateApiKey, hashApiKey, generateRecoveryToken, hashRecoveryToken } from './keyStoreCrypto';
export type { StoredApiKey, ProvisionResult } from './keyStoreTypes';

function useNeonKeyStore(): boolean {
  if (process.env.DATABASE_URL) return true;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL is required for API key storage in production.');
  }
  return false;
}

export async function provisionApiKey(input: ProvisionApiKeyInput): Promise<ProvisionResult> {
  if (useNeonKeyStore()) return provisionApiKeyNeon(input);
  return provisionApiKeyFile(input);
}

export async function peekPendingApiKey(checkoutSessionId: string): Promise<string | null> {
  if (useNeonKeyStore()) return peekPendingApiKeyNeon(checkoutSessionId);
  return peekPendingApiKeyFile(checkoutSessionId);
}

export async function pendingKeyWasRetrieved(checkoutSessionId: string): Promise<boolean> {
  if (useNeonKeyStore()) return pendingKeyWasRetrievedNeon(checkoutSessionId);
  return pendingKeyWasRetrievedFile(checkoutSessionId);
}

export async function verifyRecoveryToken(
  checkoutSessionId: string,
  token: string,
): Promise<boolean> {
  if (useNeonKeyStore()) return verifyRecoveryTokenNeon(checkoutSessionId, token);
  return verifyRecoveryTokenFile(checkoutSessionId, token);
}

export async function rotateApiKeyForCheckout(input: ProvisionApiKeyInput): Promise<ProvisionResult> {
  if (useNeonKeyStore()) return rotateApiKeyForCheckoutNeon(input);
  return rotateApiKeyForCheckoutFile(input);
}

export async function lookupTierByApiKey(apiKey: string): Promise<ApiTier | null> {
  if (useNeonKeyStore()) return lookupTierByApiKeyNeon(apiKey);
  return lookupTierByApiKeyFile(apiKey);
}

export async function retrievePendingApiKey(checkoutSessionId: string): Promise<string | null> {
  if (useNeonKeyStore()) return retrievePendingApiKeyNeon(checkoutSessionId);
  return retrievePendingApiKeyFile(checkoutSessionId);
}

export async function revokeKeysForSubscription(subscriptionId: string): Promise<void> {
  if (useNeonKeyStore()) return revokeKeysForSubscriptionNeon(subscriptionId);
  revokeKeysForSubscriptionFile(subscriptionId);
}

export async function updateTierForSubscription(
  subscriptionId: string,
  tier: ApiTier,
): Promise<void> {
  if (useNeonKeyStore()) return updateTierForSubscriptionNeon(subscriptionId, tier);
  updateTierForSubscriptionFile(subscriptionId, tier);
}

/** @deprecated Prefer revokeKeysForSubscription when a Stripe subscription id is known. */
export async function revokeKeysForCustomer(customerId: string): Promise<void> {
  if (useNeonKeyStore()) return revokeKeysForCustomerNeon(customerId);
  revokeKeysForCustomerFile(customerId);
}

export async function issueRecoveryToken(checkoutSessionId: string): Promise<string> {
  if (useNeonKeyStore()) return issueRecoveryTokenNeon(checkoutSessionId);
  return issueRecoveryTokenFile(checkoutSessionId);
}

export async function resetKeyStoreForTests(): Promise<void> {
  if (useNeonKeyStore()) return resetKeyStoreForTestsNeon();
  resetKeyStoreForTestsFile();
}
