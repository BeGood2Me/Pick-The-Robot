import { createHash } from 'node:crypto';
import type { ApiTier } from './tiers';

/** Stable client id for rate limits and monthly usage (never log raw API keys). */
export function getApiClientId(request: Request, tier: ApiTier): string {
  const headerKey =
    request.headers.get('x-api-key') ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();

  if (headerKey) {
    const digest = createHash('sha256').update(headerKey).digest('hex').slice(0, 16);
    return `${tier}:key:${digest}`;
  }

  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'anonymous';
  return `${tier}:ip:${ip}`;
}
