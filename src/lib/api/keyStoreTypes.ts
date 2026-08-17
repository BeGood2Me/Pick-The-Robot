import type { ApiTier } from '@/lib/api/tierLimits';

export interface StoredApiKey {
  tier: ApiTier;
  customerId: string;
  email: string;
  status: 'active' | 'revoked';
  createdAt: string;
  subscriptionId?: string;
}

export interface PendingCheckoutKey {
  apiKey: string;
  keyHash: string;
  retrieved: boolean;
  tier: ApiTier;
  subscriptionId?: string;
  recoveryTokenHash?: string;
}

export interface KeyStoreData {
  keys: Record<string, StoredApiKey>;
  pending: Record<string, PendingCheckoutKey>;
}

export interface ProvisionApiKeyInput {
  tier: ApiTier;
  customerId: string;
  email: string;
  checkoutSessionId: string;
  subscriptionId?: string;
}

export interface ProvisionResult {
  apiKey: string;
  /** Present when a new key (or recovery token) was minted. */
  recoveryToken: string | null;
}

export interface PendingKeyMaterial {
  apiKey: string;
  recoveryTokenHash: string | null;
}
