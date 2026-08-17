import type { ApiTier } from './tiers';
import { API_TIER_LIMITS } from './tiers';
import {
  readMonthlyUsageNeon,
  recordMonthlyUsageNeon,
  resetLimitsForTestsNeon,
} from './limitStoreNeon';

export type ApiMeteredEndpoint = 'match' | 'vendors';

export interface UsageState {
  allowed: boolean;
  limit: number;
  remaining: number;
  period: string;
  used: number;
}

type MonthlyBucket = { count: number; period: string };

const monthlyBuckets = new Map<string, MonthlyBucket>();

function currentPeriod(now = new Date()): string {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function monthlyKey(clientId: string, endpoint: ApiMeteredEndpoint): string {
  return `${clientId}:${endpoint}`;
}

function useDurableLimits(): boolean {
  if (process.env.DATABASE_URL) return true;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL is required for API limits in production.');
  }
  return false;
}

function readUsageMemory(
  clientId: string,
  tier: ApiTier,
  endpoint: ApiMeteredEndpoint,
  now = new Date(),
): UsageState {
  const limit = API_TIER_LIMITS[tier].matchesPerMonth;
  const period = currentPeriod(now);
  const key = monthlyKey(clientId, endpoint);
  const existing = monthlyBuckets.get(key);
  const used = existing && existing.period === period ? existing.count : 0;

  return {
    allowed: used < limit,
    limit,
    remaining: Math.max(0, limit - used),
    period,
    used,
  };
}

function recordMonthlyUsageMemory(
  clientId: string,
  endpoint: ApiMeteredEndpoint,
  now = new Date(),
): void {
  const period = currentPeriod(now);
  const key = monthlyKey(clientId, endpoint);
  const existing = monthlyBuckets.get(key);

  if (!existing || existing.period !== period) {
    monthlyBuckets.set(key, { count: 1, period });
  } else {
    existing.count += 1;
  }
}

/** Check monthly quota without recording usage. */
export async function checkMonthlyUsage(
  clientId: string,
  tier: ApiTier,
  endpoint: ApiMeteredEndpoint,
  now = new Date(),
): Promise<UsageState> {
  const state = useDurableLimits()
    ? await readMonthlyUsageNeon(clientId, tier, endpoint, now)
    : readUsageMemory(clientId, tier, endpoint, now);
  if (!state.allowed) {
    return { ...state, remaining: 0 };
  }
  return { ...state, remaining: Math.max(0, state.limit - state.used - 1) };
}

export async function recordMonthlyUsage(
  clientId: string,
  tier: ApiTier,
  endpoint: ApiMeteredEndpoint,
  now = new Date(),
): Promise<UsageState> {
  if (useDurableLimits()) {
    return recordMonthlyUsageNeon(clientId, tier, endpoint, now);
  }
  recordMonthlyUsageMemory(clientId, endpoint, now);
  return readUsageMemory(clientId, tier, endpoint, now);
}

export async function getMonthlyUsage(
  clientId: string,
  tier: ApiTier,
  endpoint: ApiMeteredEndpoint,
  now = new Date(),
): Promise<UsageState> {
  if (useDurableLimits()) {
    return readMonthlyUsageNeon(clientId, tier, endpoint, now);
  }
  return readUsageMemory(clientId, tier, endpoint, now);
}

export async function resetMonthlyUsageForTests(): Promise<void> {
  monthlyBuckets.clear();
  if (process.env.DATABASE_URL) {
    await resetLimitsForTestsNeon();
  }
}
