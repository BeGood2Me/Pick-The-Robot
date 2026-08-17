import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import {
  encryptApiKey,
  decryptApiKey,
  generateApiKey,
  generateRecoveryToken,
  hashApiKey,
  hashRecoveryToken,
} from './keyStoreCrypto';
import type { KeyStoreData, ProvisionApiKeyInput, ProvisionResult } from './keyStoreTypes';
import type { ApiTier } from '@/lib/api/tierLimits';

const STORE_PATH =
  process.env.API_KEY_STORE_PATH ?? join(process.cwd(), 'data', 'api-subscribers.json');

function emptyStore(): KeyStoreData {
  return { keys: {}, pending: {} };
}

function readStore(): KeyStoreData {
  if (!existsSync(STORE_PATH)) return emptyStore();
  try {
    const raw = readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as KeyStoreData;
    return {
      keys: parsed.keys ?? {},
      pending: parsed.pending ?? {},
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(data: KeyStoreData): void {
  mkdirSync(dirname(STORE_PATH), { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function readPendingApiKey(pending: KeyStoreData['pending'][string]): string | null {
  if (!pending) return null;
  if (pending.apiKey.startsWith('enc:')) {
    return decryptApiKey(pending.apiKey.slice(4));
  }
  return pending.apiKey;
}

function storePendingApiKey(apiKey: string): string {
  return `enc:${encryptApiKey(apiKey)}`;
}

function activeKeyRecord(store: KeyStoreData, apiKey: string) {
  return store.keys[hashApiKey(apiKey)];
}

export function provisionApiKeyFile(input: ProvisionApiKeyInput): ProvisionResult {
  const store = readStore();
  const existing = store.pending[input.checkoutSessionId];
  if (existing) {
    const apiKey = readPendingApiKey(existing);
    if (!apiKey) throw new Error('Corrupt pending API key store.');
    return { apiKey, recoveryToken: null };
  }

  const apiKey = generateApiKey(input.tier);
  const recoveryToken = generateRecoveryToken();
  store.keys[hashApiKey(apiKey)] = {
    tier: input.tier,
    customerId: input.customerId,
    email: input.email,
    status: 'active',
    createdAt: new Date().toISOString(),
    subscriptionId: input.subscriptionId,
  };
  store.pending[input.checkoutSessionId] = {
    apiKey: storePendingApiKey(apiKey),
    keyHash: hashApiKey(apiKey),
    retrieved: false,
    tier: input.tier,
    subscriptionId: input.subscriptionId,
    recoveryTokenHash: hashRecoveryToken(recoveryToken),
  };
  writeStore(store);
  return { apiKey, recoveryToken };
}

export function peekPendingApiKeyFile(checkoutSessionId: string): string | null {
  const store = readStore();
  const pending = store.pending[checkoutSessionId];
  if (!pending || pending.retrieved) return null;
  const apiKey = readPendingApiKey(pending);
  if (!apiKey) return null;
  const record = activeKeyRecord(store, apiKey);
  if (!record || record.status !== 'active') return null;
  return apiKey;
}

export function pendingKeyWasRetrievedFile(checkoutSessionId: string): boolean {
  const store = readStore();
  const pending = store.pending[checkoutSessionId];
  return Boolean(pending?.retrieved);
}

export function verifyRecoveryTokenFile(checkoutSessionId: string, token: string): boolean {
  const store = readStore();
  const pending = store.pending[checkoutSessionId];
  if (!pending?.recoveryTokenHash) return false;
  return pending.recoveryTokenHash === hashRecoveryToken(token);
}

export function rotateApiKeyForCheckoutFile(input: ProvisionApiKeyInput): ProvisionResult {
  const store = readStore();
  const existing = store.pending[input.checkoutSessionId];
  if (existing?.keyHash && store.keys[existing.keyHash]) {
    store.keys[existing.keyHash] = { ...store.keys[existing.keyHash], status: 'revoked' };
  }

  const apiKey = generateApiKey(input.tier);
  const recoveryToken = generateRecoveryToken();
  store.keys[hashApiKey(apiKey)] = {
    tier: input.tier,
    customerId: input.customerId,
    email: input.email,
    status: 'active',
    createdAt: new Date().toISOString(),
    subscriptionId: input.subscriptionId,
  };
  store.pending[input.checkoutSessionId] = {
    apiKey: storePendingApiKey(apiKey),
    keyHash: hashApiKey(apiKey),
    retrieved: false,
    tier: input.tier,
    subscriptionId: input.subscriptionId,
    recoveryTokenHash: hashRecoveryToken(recoveryToken),
  };
  writeStore(store);
  return { apiKey, recoveryToken };
}

export function lookupTierByApiKeyFile(apiKey: string): ApiTier | null {
  const store = readStore();
  const record = store.keys[hashApiKey(apiKey)];
  if (!record || record.status !== 'active') return null;
  return record.tier;
}

export function retrievePendingApiKeyFile(checkoutSessionId: string): string | null {
  const store = readStore();
  const pending = store.pending[checkoutSessionId];
  if (!pending || pending.retrieved) return null;
  const apiKey = readPendingApiKey(pending);
  if (!apiKey) return null;
  const record = activeKeyRecord(store, apiKey);
  if (!record || record.status !== 'active') return null;
  pending.retrieved = true;
  pending.apiKey = '';
  writeStore(store);
  return apiKey;
}

export function revokeKeysForSubscriptionFile(subscriptionId: string): void {
  const store = readStore();
  for (const [hash, record] of Object.entries(store.keys)) {
    if (record.subscriptionId === subscriptionId) {
      store.keys[hash] = { ...record, status: 'revoked' };
    }
  }
  writeStore(store);
}

export function updateTierForSubscriptionFile(subscriptionId: string, tier: ApiTier): void {
  const store = readStore();
  for (const [hash, record] of Object.entries(store.keys)) {
    if (record.subscriptionId === subscriptionId && record.status === 'active') {
      store.keys[hash] = { ...record, tier };
    }
  }
  for (const pending of Object.values(store.pending)) {
    if (pending.subscriptionId === subscriptionId) {
      pending.tier = tier;
    }
  }
  writeStore(store);
}

export function revokeKeysForCustomerFile(customerId: string): void {
  const store = readStore();
  for (const [hash, record] of Object.entries(store.keys)) {
    if (record.customerId === customerId) {
      store.keys[hash] = { ...record, status: 'revoked' };
    }
  }
  writeStore(store);
}

export function resetKeyStoreForTestsFile(): void {
  writeStore(emptyStore());
}

export function issueRecoveryTokenFile(checkoutSessionId: string): string {
  const store = readStore();
  const pending = store.pending[checkoutSessionId];
  if (!pending) throw new Error('No pending checkout key for recovery token.');
  const recoveryToken = generateRecoveryToken();
  pending.recoveryTokenHash = hashRecoveryToken(recoveryToken);
  writeStore(store);
  return recoveryToken;
}
