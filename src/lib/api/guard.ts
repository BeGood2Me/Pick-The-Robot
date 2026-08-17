import { NextResponse } from 'next/server';
import { getApiClientId } from './clientId';
import {
  checkMonthlyUsage,
  getMonthlyUsage,
  recordMonthlyUsage,
  type ApiMeteredEndpoint,
} from './metering';
import { consumeRateLimit, peekRateLimit } from './rateLimit';
import type { ApiTier } from './tiers';

export interface ApiLimitHeaders {
  rateLimit: { limit: number; remaining: number; resetAt: number };
  usage: { limit: number; remaining: number; period: string; used: number };
}

const COMMON_HEADERS = { 'Cache-Control': 'private, no-store' } as const;

function limitHeaders(headers: ApiLimitHeaders, includeUsage: boolean): HeadersInit {
  const base: Record<string, string> = {
    'X-RateLimit-Limit': String(headers.rateLimit.limit),
    'X-RateLimit-Remaining': String(headers.rateLimit.remaining),
    'X-RateLimit-Reset': String(headers.rateLimit.resetAt),
  };
  if (includeUsage) {
    base['X-Usage-Limit'] = String(headers.usage.limit);
    base['X-Usage-Remaining'] = String(headers.usage.remaining);
    base['X-Usage-Period'] = headers.usage.period;
    base['X-Usage-Used'] = String(headers.usage.used);
  }
  return base;
}

export function jsonWithLimits<T>(
  body: T,
  tier: ApiTier,
  headers: ApiLimitHeaders,
  options?: { includeUsage?: boolean },
): NextResponse {
  return NextResponse.json(body, {
    headers: {
      ...COMMON_HEADERS,
      'X-API-Tier': tier,
      ...limitHeaders(headers, options?.includeUsage ?? true),
    },
  });
}

/**
 * Check per-minute rate limits and monthly quotas before handling an API route.
 * Does not consume quota — call finalizeApiLimits() only after a successful response.
 * Returns a 429 response when blocked, otherwise null.
 */
export async function enforceApiLimits(
  request: Request,
  tier: ApiTier,
  endpoint: ApiMeteredEndpoint,
): Promise<NextResponse | null> {
  const clientId = getApiClientId(request, tier);
  const rate = await peekRateLimit(clientId, tier);

  if (!rate.allowed) {
    const retryAfter = String(Math.max(1, rate.resetAt - Math.floor(Date.now() / 1000)));
    return NextResponse.json(
      {
        error: 'rate_limit_exceeded',
        message: 'Too many requests. Retry after the rate limit window resets.',
      },
      {
        status: 429,
        headers: {
          ...COMMON_HEADERS,
          'X-API-Tier': tier,
          'Retry-After': retryAfter,
          'X-RateLimit-Limit': String(rate.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rate.resetAt),
        },
      },
    );
  }

  const usage = endpoint === 'match' ? await checkMonthlyUsage(clientId, tier, endpoint) : null;
  if (usage && !usage.allowed) {
    return NextResponse.json(
      {
        error: 'quota_exceeded',
        message: `Monthly API quota reached for ${usage.period}.`,
        period: usage.period,
        limit: usage.limit,
        used: usage.used,
      },
      {
        status: 429,
        headers: {
          ...COMMON_HEADERS,
          'X-API-Tier': tier,
          'X-RateLimit-Limit': String(rate.limit),
          'X-RateLimit-Remaining': String(rate.remaining),
          'X-RateLimit-Reset': String(rate.resetAt),
          'X-Usage-Limit': String(usage.limit),
          'X-Usage-Remaining': '0',
          'X-Usage-Period': usage.period,
          'X-Usage-Used': String(usage.used),
        },
      },
    );
  }

  return null;
}

/** Record successful usage and build response headers. */
export async function finalizeApiLimits(
  request: Request,
  tier: ApiTier,
  endpoint: ApiMeteredEndpoint,
): Promise<ApiLimitHeaders> {
  const clientId = getApiClientId(request, tier);
  const rate = await consumeRateLimit(clientId, tier);
  if (endpoint === 'match') {
    await recordMonthlyUsage(clientId, tier, endpoint);
  }
  const usageState =
    endpoint === 'match'
      ? await getMonthlyUsage(clientId, tier, endpoint)
      : { limit: 0, remaining: 0, period: '', used: 0 };

  return {
    rateLimit: {
      limit: rate.limit,
      remaining: rate.remaining,
      resetAt: rate.resetAt,
    },
    usage: {
      limit: usageState.limit,
      remaining: usageState.remaining,
      period: usageState.period,
      used: usageState.used,
    },
  };
}
