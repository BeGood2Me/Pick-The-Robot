import type { ApiTier } from './tiers';
import { API_TIER_LIMITS } from './tiers';
import {
  consumeRateLimitNeon,
  peekRateLimitNeon,
  resetLimitsForTestsNeon,
} from './limitStoreNeon';

export interface RateLimitState {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

type MinuteBucket = { count: number; windowStartMs: number };

const minuteBuckets = new Map<string, MinuteBucket>();

function currentMinuteWindow(now = Date.now()): number {
  return Math.floor(now / 60_000) * 60_000;
}

function useDurableLimits(): boolean {
  if (process.env.DATABASE_URL) return true;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL is required for API limits in production.');
  }
  return false;
}

function bucketState(clientId: string, tier: ApiTier, now = Date.now()): RateLimitState {
  const limit = API_TIER_LIMITS[tier].requestsPerMinute;
  const windowStartMs = currentMinuteWindow(now);
  const resetAt = Math.floor((windowStartMs + 60_000) / 1000);
  const existing = minuteBuckets.get(clientId);

  if (!existing || existing.windowStartMs !== windowStartMs) {
    return { allowed: true, limit, remaining: limit, resetAt };
  }

  const remaining = Math.max(0, limit - existing.count);
  return {
    allowed: existing.count < limit,
    limit,
    remaining,
    resetAt,
  };
}

function consumeRateLimitMemory(clientId: string, tier: ApiTier, now = Date.now()): RateLimitState {
  const limit = API_TIER_LIMITS[tier].requestsPerMinute;
  const windowStartMs = currentMinuteWindow(now);
  const resetAt = Math.floor((windowStartMs + 60_000) / 1000);
  const existing = minuteBuckets.get(clientId);

  if (!existing || existing.windowStartMs !== windowStartMs) {
    minuteBuckets.set(clientId, { count: 1, windowStartMs });
    return { allowed: true, limit, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, limit, remaining: 0, resetAt };
  }

  existing.count += 1;
  return { allowed: true, limit, remaining: limit - existing.count, resetAt };
}

/** Read current rate limit state without consuming a request. */
export async function peekRateLimit(
  clientId: string,
  tier: ApiTier,
  now = Date.now(),
): Promise<RateLimitState> {
  if (useDurableLimits()) return peekRateLimitNeon(clientId, tier, now);
  return bucketState(clientId, tier, now);
}

/** Consume one request in the current minute window. */
export async function consumeRateLimit(
  clientId: string,
  tier: ApiTier,
  now = Date.now(),
): Promise<RateLimitState> {
  if (useDurableLimits()) return consumeRateLimitNeon(clientId, tier, now);
  return consumeRateLimitMemory(clientId, tier, now);
}

export async function resetRateLimitsForTests(): Promise<void> {
  minuteBuckets.clear();
  if (process.env.DATABASE_URL) {
    await resetLimitsForTestsNeon();
  }
}
