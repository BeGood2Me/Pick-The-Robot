import { NextResponse } from 'next/server';
import { lookupTierByApiKey } from './keyStore';
import { type ApiTier } from './tierLimits';

export type { ApiTier } from './tierLimits';
export { API_TIER_LIMITS, isApiTier } from './tierLimits';

export function getApiKeyFromRequest(request: Request): string | null {
  const headerKey =
    request.headers.get('x-api-key') ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  return headerKey || null;
}

/**
 * Resolve API tier from `X-API-Key` or `Authorization: Bearer <key>`.
 * Missing or invalid key → null (caller should 401).
 */
export async function resolveApiTier(request: Request): Promise<ApiTier | null> {
  const headerKey = getApiKeyFromRequest(request);
  if (!headerKey) return null;

  const starterKey = process.env.PICKTHEROBOT_API_KEY_STARTER;
  const proKey = process.env.PICKTHEROBOT_API_KEY_PRO;

  if (proKey && headerKey === proKey) return 'pro';
  if (starterKey && headerKey === starterKey) return 'starter';

  const provisionedTier = await lookupTierByApiKey(headerKey);
  if (provisionedTier) return provisionedTier;

  return null;
}

export function unauthorizedApiResponse(request: Request): NextResponse {
  const hasKey = Boolean(getApiKeyFromRequest(request));
  return NextResponse.json(
    {
      error: 'unauthorized',
      message: hasKey
        ? 'Invalid API key.'
        : 'API key required. Subscribe at picktherobot.com/developers.',
    },
    { status: 401 },
  );
}
