import { neon } from '@neondatabase/serverless';
import type { ApiTier } from '@/lib/api/tierLimits';
import {
  decryptApiKey,
  encryptApiKey,
  generateApiKey,
  generateRecoveryToken,
  hashApiKey,
  hashRecoveryToken,
} from './keyStoreCrypto';
import type { PendingKeyMaterial, ProvisionApiKeyInput, ProvisionResult } from './keyStoreTypes';

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required for Neon key store.');
  }
  return neon(url);
}

function decryptPendingRow(row: {
  api_key_ciphertext: string | null;
  api_key: string | null;
}): string | null {
  if (row.api_key_ciphertext) return decryptApiKey(row.api_key_ciphertext);
  if (row.api_key) return row.api_key;
  return null;
}

async function readPendingMaterial(
  checkoutSessionId: string,
): Promise<PendingKeyMaterial | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT api_key_ciphertext, api_key, recovery_token_hash
    FROM pending_checkout_keys
    WHERE checkout_session_id = ${checkoutSessionId}
    LIMIT 1
  `;
  if (rows.length === 0) return null;
  const apiKey = decryptPendingRow(rows[0] as { api_key_ciphertext: string | null; api_key: string | null });
  if (!apiKey) return null;
  return {
    apiKey,
    recoveryTokenHash: (rows[0].recovery_token_hash as string | null) ?? null,
  };
}

export async function provisionApiKeyNeon(input: ProvisionApiKeyInput): Promise<ProvisionResult> {
  const sql = getSql();
  const existing = await readPendingMaterial(input.checkoutSessionId);
  if (existing) {
    return { apiKey: existing.apiKey, recoveryToken: null };
  }

  const apiKey = generateApiKey(input.tier);
  const recoveryToken = generateRecoveryToken();
  const keyHash = hashApiKey(apiKey);
  const createdAt = new Date().toISOString();
  const subscriptionId = input.subscriptionId ?? null;
  const ciphertext = encryptApiKey(apiKey);
  const recoveryTokenHash = hashRecoveryToken(recoveryToken);

  try {
    await sql.transaction([
      sql`
        INSERT INTO api_keys (key_hash, tier, customer_id, email, status, created_at, subscription_id)
        VALUES (${keyHash}, ${input.tier}, ${input.customerId}, ${input.email}, 'active', ${createdAt}, ${subscriptionId})
      `,
      sql`
        INSERT INTO pending_checkout_keys (
          checkout_session_id, api_key_ciphertext, key_hash, retrieved, tier, recovery_token_hash
        )
        VALUES (
          ${input.checkoutSessionId}, ${ciphertext}, ${keyHash}, FALSE, ${input.tier}, ${recoveryTokenHash}
        )
      `,
    ]);
    return { apiKey, recoveryToken };
  } catch {
    const retry = await readPendingMaterial(input.checkoutSessionId);
    if (retry) {
      await sql`
        UPDATE api_keys SET status = 'revoked'
        WHERE key_hash = ${keyHash} AND NOT EXISTS (
          SELECT 1 FROM pending_checkout_keys
          WHERE checkout_session_id = ${input.checkoutSessionId} AND key_hash = ${keyHash}
        )
      `;
      return { apiKey: retry.apiKey, recoveryToken: null };
    }
    throw new Error('Failed to provision API key.');
  }
}

export async function peekPendingApiKeyNeon(checkoutSessionId: string): Promise<string | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT p.api_key_ciphertext, p.api_key
    FROM pending_checkout_keys p
    INNER JOIN api_keys k ON k.key_hash = p.key_hash AND k.status = 'active'
    WHERE p.checkout_session_id = ${checkoutSessionId} AND p.retrieved = FALSE
    LIMIT 1
  `;
  if (rows.length === 0) return null;
  return decryptPendingRow(rows[0] as { api_key_ciphertext: string | null; api_key: string | null });
}

export async function pendingKeyWasRetrievedNeon(checkoutSessionId: string): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`
    SELECT retrieved FROM pending_checkout_keys
    WHERE checkout_session_id = ${checkoutSessionId}
    LIMIT 1
  `;
  return rows.length > 0 ? Boolean(rows[0].retrieved) : false;
}

export async function verifyRecoveryTokenNeon(
  checkoutSessionId: string,
  token: string,
): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`
    SELECT recovery_token_hash FROM pending_checkout_keys
    WHERE checkout_session_id = ${checkoutSessionId}
    LIMIT 1
  `;
  if (rows.length === 0 || !rows[0].recovery_token_hash) return false;
  return rows[0].recovery_token_hash === hashRecoveryToken(token);
}

export async function rotateApiKeyForCheckoutNeon(
  input: ProvisionApiKeyInput,
): Promise<ProvisionResult> {
  const sql = getSql();
  const existing = await sql`
    SELECT key_hash FROM pending_checkout_keys
    WHERE checkout_session_id = ${input.checkoutSessionId}
    LIMIT 1
  `;
  if (existing.length > 0) {
    await sql`
      UPDATE api_keys SET status = 'revoked'
      WHERE key_hash = ${existing[0].key_hash as string}
    `;
  }

  const apiKey = generateApiKey(input.tier);
  const recoveryToken = generateRecoveryToken();
  const keyHash = hashApiKey(apiKey);
  const createdAt = new Date().toISOString();
  const subscriptionId = input.subscriptionId ?? null;
  const ciphertext = encryptApiKey(apiKey);
  const recoveryTokenHash = hashRecoveryToken(recoveryToken);

  await sql.transaction([
    sql`
      INSERT INTO api_keys (key_hash, tier, customer_id, email, status, created_at, subscription_id)
      VALUES (${keyHash}, ${input.tier}, ${input.customerId}, ${input.email}, 'active', ${createdAt}, ${subscriptionId})
    `,
    sql`
      INSERT INTO pending_checkout_keys (
        checkout_session_id, api_key_ciphertext, key_hash, retrieved, tier, recovery_token_hash
      )
      VALUES (
        ${input.checkoutSessionId}, ${ciphertext}, ${keyHash}, FALSE, ${input.tier}, ${recoveryTokenHash}
      )
      ON CONFLICT (checkout_session_id) DO UPDATE SET
        api_key_ciphertext = EXCLUDED.api_key_ciphertext,
        api_key = NULL,
        key_hash = EXCLUDED.key_hash,
        retrieved = FALSE,
        tier = EXCLUDED.tier,
        recovery_token_hash = EXCLUDED.recovery_token_hash
    `,
  ]);

  return { apiKey, recoveryToken };
}

export async function lookupTierByApiKeyNeon(apiKey: string): Promise<ApiTier | null> {
  const sql = getSql();
  const keyHash = hashApiKey(apiKey);
  const rows = await sql`
    SELECT tier FROM api_keys
    WHERE key_hash = ${keyHash} AND status = 'active'
    LIMIT 1
  `;
  return rows.length > 0 ? (rows[0].tier as ApiTier) : null;
}

export async function retrievePendingApiKeyNeon(checkoutSessionId: string): Promise<string | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT p.api_key_ciphertext, p.api_key
    FROM pending_checkout_keys p
    INNER JOIN api_keys k ON k.key_hash = p.key_hash AND k.status = 'active'
    WHERE p.checkout_session_id = ${checkoutSessionId} AND p.retrieved = FALSE
    LIMIT 1
  `;
  if (rows.length === 0) return null;

  const apiKey = decryptPendingRow(rows[0] as { api_key_ciphertext: string | null; api_key: string | null });
  if (!apiKey) return null;

  await sql`
    UPDATE pending_checkout_keys
    SET retrieved = TRUE, api_key_ciphertext = NULL, api_key = NULL
    WHERE checkout_session_id = ${checkoutSessionId} AND retrieved = FALSE
  `;
  return apiKey;
}

export async function revokeKeysForSubscriptionNeon(subscriptionId: string): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE api_keys SET status = 'revoked'
    WHERE subscription_id = ${subscriptionId} AND status = 'active'
  `;
}

export async function updateTierForSubscriptionNeon(
  subscriptionId: string,
  tier: ApiTier,
): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE api_keys SET tier = ${tier}
    WHERE subscription_id = ${subscriptionId} AND status = 'active'
  `;
  await sql`
    UPDATE pending_checkout_keys SET tier = ${tier}
    WHERE key_hash IN (
      SELECT key_hash FROM api_keys
      WHERE subscription_id = ${subscriptionId} AND status = 'active'
    )
  `;
}

export async function revokeKeysForCustomerNeon(customerId: string): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE api_keys SET status = 'revoked'
    WHERE customer_id = ${customerId} AND status = 'active'
  `;
}

export async function resetKeyStoreForTestsNeon(): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM pending_checkout_keys`;
  await sql`DELETE FROM api_keys`;
}

export async function issueRecoveryTokenNeon(checkoutSessionId: string): Promise<string> {
  const sql = getSql();
  const recoveryToken = generateRecoveryToken();
  const recoveryTokenHash = hashRecoveryToken(recoveryToken);
  await sql`
    UPDATE pending_checkout_keys
    SET recovery_token_hash = ${recoveryTokenHash}
    WHERE checkout_session_id = ${checkoutSessionId}
  `;
  return recoveryToken;
}
