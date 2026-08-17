import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import type { ApiTier } from '@/lib/api/tierLimits';

export function hashApiKey(apiKey: string): string {
  return createHash('sha256').update(apiKey).digest('hex');
}

export function generateApiKey(tier: ApiTier): string {
  const suffix = randomBytes(24).toString('base64url');
  return `ptr_${tier}_${suffix}`;
}

export function generateRecoveryToken(): string {
  return `rt_${randomBytes(24).toString('base64url')}`;
}

export function hashRecoveryToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function encryptionKey(): Buffer {
  const secret = process.env.API_KEY_ENCRYPTION_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('API_KEY_ENCRYPTION_KEY is required in production.');
    }
    return createHash('sha256').update('picktherobot-dev-key-encryption').digest();
  }
  return createHash('sha256').update(secret).digest();
}

export function encryptApiKey(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64url');
}

export function decryptApiKey(ciphertext: string): string {
  const buffer = Buffer.from(ciphertext, 'base64url');
  const iv = buffer.subarray(0, 12);
  const tag = buffer.subarray(12, 28);
  const encrypted = buffer.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}
