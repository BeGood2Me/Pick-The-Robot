import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { resolveApiBaseUrl } from '@/lib/api/baseUrl';
import { enforceApiLimits, finalizeApiLimits, jsonWithLimits } from '@/lib/api/guard';
import { toPublicHomeMatchResponse } from '@/lib/api/publicHomeMatch';
import { resolveApiTier, unauthorizedApiResponse } from '@/lib/api/tiers';
import { recommendHomeVacuum } from '@/lib/home-vacuums/engine';
import { isHomeAffiliateLocale } from '@/lib/home-vacuums/outbound';
import {
  getHomeVacuumFieldErrors,
  isCompleteHomeVacuumAnswers,
} from '@/lib/home-vacuums/questions';
import type { HomeAffiliateLocale, WizardHomeVacuumAnswers } from '@/lib/home-vacuums/types';

/**
 * POST /api/v1/home/match — home robot vacuum matcher (separate from business /match).
 * Counts against the same monthly match quota as POST /api/v1/match.
 * Optional body field `affiliateLocale`: US | UK (default US) for clickUrl storefront.
 */
export async function POST(request: Request) {
  const tier = await resolveApiTier(request);
  if (tier === null) {
    return unauthorizedApiResponse(request);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'invalid_json', message: 'Request body must be JSON.' },
      { status: 400 },
    );
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { error: 'validation_failed', message: 'Request body must be a JSON object.' },
      { status: 400 },
    );
  }

  const record = body as Record<string, unknown>;
  let affiliateLocale: HomeAffiliateLocale | undefined;
  if (record.affiliateLocale !== undefined) {
    if (typeof record.affiliateLocale !== 'string' || !isHomeAffiliateLocale(record.affiliateLocale)) {
      return NextResponse.json(
        {
          error: 'validation_failed',
          message: 'affiliateLocale must be US, UK, or DE when set.',
          fields: { affiliateLocale: 'Must be US, UK, or DE.' },
        },
        { status: 400 },
      );
    }
    affiliateLocale = record.affiliateLocale;
  }

  const answers = body as WizardHomeVacuumAnswers;
  const fieldErrors = getHomeVacuumFieldErrors(answers);
  if (Object.keys(fieldErrors).length > 0 || !isCompleteHomeVacuumAnswers(answers)) {
    return NextResponse.json(
      {
        error: 'validation_failed',
        message:
          'Complete all home vacuum fields: floorMix, homeSize, pets, hairLength, mopNeeded, budgetBand, selfEmpty, multiFloor, obstacles.',
        fields: fieldErrors,
      },
      { status: 400 },
    );
  }

  const blocked = await enforceApiLimits(request, tier, 'match');
  if (blocked) return blocked;

  try {
    const result = recommendHomeVacuum(answers);
    const payload = toPublicHomeMatchResponse(result, tier, {
      matchId: randomUUID(),
      baseUrl: resolveApiBaseUrl(request),
      affiliateLocale,
    });
    return jsonWithLimits(payload, tier, await finalizeApiLimits(request, tier, 'match'));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Home match failed.';
    return NextResponse.json({ error: 'match_failed', message }, { status: 422 });
  }
}
