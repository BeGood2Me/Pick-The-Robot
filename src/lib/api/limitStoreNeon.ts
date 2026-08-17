import { neon } from '@neondatabase/serverless';
import type { ApiTier } from './tiers';
import { API_TIER_LIMITS } from './tiers';
import type { RateLimitState } from './rateLimit';
import type { ApiMeteredEndpoint, UsageState } from './metering';

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required for durable API limits.');
  }
  return neon(url);
}

function currentMinuteWindow(now = Date.now()): number {
  return Math.floor(now / 60_000) * 60_000;
}

function currentPeriod(now = new Date()): string {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export async function peekRateLimitNeon(
  clientId: string,
  tier: ApiTier,
  now = Date.now(),
): Promise<RateLimitState> {
  const sql = getSql();
  const limit = API_TIER_LIMITS[tier].requestsPerMinute;
  const windowStartMs = currentMinuteWindow(now);
  const resetAt = Math.floor((windowStartMs + 60_000) / 1000);
  const rows = await sql`
    SELECT request_count FROM api_rate_limit_buckets
    WHERE client_id = ${clientId} AND window_start_ms = ${windowStartMs}
    LIMIT 1
  `;
  const count = rows.length > 0 ? Number(rows[0].request_count) : 0;
  return {
    allowed: count < limit,
    limit,
    remaining: Math.max(0, limit - count),
    resetAt,
  };
}

export async function consumeRateLimitNeon(
  clientId: string,
  tier: ApiTier,
  now = Date.now(),
): Promise<RateLimitState> {
  const sql = getSql();
  const limit = API_TIER_LIMITS[tier].requestsPerMinute;
  const windowStartMs = currentMinuteWindow(now);
  const resetAt = Math.floor((windowStartMs + 60_000) / 1000);

  const rows = await sql`
    INSERT INTO api_rate_limit_buckets (client_id, window_start_ms, request_count)
    VALUES (${clientId}, ${windowStartMs}, 1)
    ON CONFLICT (client_id, window_start_ms) DO UPDATE
    SET request_count = api_rate_limit_buckets.request_count + 1
    RETURNING request_count
  `;
  const count = Number(rows[0].request_count);
  return {
    allowed: count <= limit,
    limit,
    remaining: Math.max(0, limit - count),
    resetAt,
  };
}

export async function readMonthlyUsageNeon(
  clientId: string,
  tier: ApiTier,
  endpoint: ApiMeteredEndpoint,
  now = new Date(),
): Promise<UsageState> {
  const sql = getSql();
  const limit = API_TIER_LIMITS[tier].matchesPerMonth;
  const period = currentPeriod(now);
  const rows = await sql`
    SELECT request_count FROM api_monthly_usage
    WHERE client_id = ${clientId} AND endpoint = ${endpoint} AND period = ${period}
    LIMIT 1
  `;
  const used = rows.length > 0 ? Number(rows[0].request_count) : 0;
  return {
    allowed: used < limit,
    limit,
    remaining: Math.max(0, limit - used),
    period,
    used,
  };
}

export async function recordMonthlyUsageNeon(
  clientId: string,
  tier: ApiTier,
  endpoint: ApiMeteredEndpoint,
  now = new Date(),
): Promise<UsageState> {
  const sql = getSql();
  const period = currentPeriod(now);
  await sql`
    INSERT INTO api_monthly_usage (client_id, endpoint, period, request_count)
    VALUES (${clientId}, ${endpoint}, ${period}, 1)
    ON CONFLICT (client_id, endpoint, period) DO UPDATE
    SET request_count = api_monthly_usage.request_count + 1
  `;
  return readMonthlyUsageNeon(clientId, tier, endpoint, now);
}

export async function resetLimitsForTestsNeon(): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM api_rate_limit_buckets`;
  await sql`DELETE FROM api_monthly_usage`;
}
