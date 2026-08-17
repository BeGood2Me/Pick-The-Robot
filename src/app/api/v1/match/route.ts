import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { resolveApiBaseUrl } from '@/lib/api/baseUrl';
import { enforceApiLimits, finalizeApiLimits, jsonWithLimits } from '@/lib/api/guard';
import { toPublicMatchResponse } from '@/lib/api/publicMatch';
import { resolveApiTier, unauthorizedApiResponse } from '@/lib/api/tiers';
import { getRequiredFieldErrors } from '@/lib/forms/validateAnswers';
import type { FormAnswers } from '@/lib/forms/types';
import { onFormSubmit } from '@/lib/matching/adapter';
import type { RobotCategory } from '@/lib/matching/types';

const VALID_CATEGORIES = new Set<RobotCategory>(['warehouse', 'cleaning', 'restaurant']);

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

  if (!body || typeof body !== 'object' || !('category' in body)) {
    return NextResponse.json(
      { error: 'validation_failed', message: 'Field category is required.' },
      { status: 400 },
    );
  }

  const answers = body as Partial<FormAnswers> & { category: RobotCategory };
  if (!VALID_CATEGORIES.has(answers.category)) {
    return NextResponse.json(
      {
        error: 'validation_failed',
        message: 'category must be warehouse, cleaning, or restaurant.',
      },
      { status: 400 },
    );
  }

  const fieldErrors = getRequiredFieldErrors(answers);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: 'validation_failed', message: 'Complete all required fields.', fields: fieldErrors },
      { status: 400 },
    );
  }

  const blocked = await enforceApiLimits(request, tier, 'match');
  if (blocked) return blocked;

  try {
    const result = onFormSubmit(answers as FormAnswers);
    const payload = toPublicMatchResponse(result, tier, {
      matchId: randomUUID(),
      baseUrl: resolveApiBaseUrl(request),
    });
    return jsonWithLimits(payload, tier, await finalizeApiLimits(request, tier, 'match'));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Match failed.';
    return NextResponse.json({ error: 'match_failed', message }, { status: 422 });
  }
}
