import { createHash, randomBytes } from 'node:crypto';

export function generateLoginToken(): string {
  return `vl_${randomBytes(24).toString('base64url')}`;
}

export function hashLoginToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
