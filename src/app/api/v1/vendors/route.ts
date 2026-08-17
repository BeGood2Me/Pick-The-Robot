import { NextResponse } from 'next/server';
import { resolveApiBaseUrl } from '@/lib/api/baseUrl';
import { enforceApiLimits, finalizeApiLimits, jsonWithLimits } from '@/lib/api/guard';
import {
  catalogLimitForTier,
  filterVendorsForCatalog,
  toPublicVendorCatalogEntry,
} from '@/lib/api/publicVendors';
import { resolveApiTier, unauthorizedApiResponse } from '@/lib/api/tiers';
import { compareVendorsForDisplay, VENDORS } from '@/lib/matching/vendors';
import type { RobotCategory } from '@/lib/matching/types';

const VALID_CATEGORIES = new Set<RobotCategory>(['warehouse', 'cleaning', 'restaurant']);

export async function GET(request: Request) {
  const tier = await resolveApiTier(request);
  if (tier === null) {
    return unauthorizedApiResponse(request);
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as RobotCategory | null;
  const region = searchParams.get('region') ?? undefined;

  if (!category || !VALID_CATEGORIES.has(category)) {
    return NextResponse.json(
      {
        error: 'validation_failed',
        message: 'Query parameter category is required (warehouse, cleaning, or restaurant).',
      },
      { status: 400 },
    );
  }

  const blocked = await enforceApiLimits(request, tier, 'vendors');
  if (blocked) return blocked;

  const filtered = filterVendorsForCatalog(VENDORS, category, region).sort(compareVendorsForDisplay);
  const vendors = filtered
    .slice(0, catalogLimitForTier(tier))
    .map((vendor) => toPublicVendorCatalogEntry(vendor, tier, resolveApiBaseUrl(request)));

  const payload = {
    tier,
    category,
    ...(region ? { region } : {}),
    count: vendors.length,
    vendors,
  };

  return jsonWithLimits(payload, tier, await finalizeApiLimits(request, tier, 'vendors'), {
    includeUsage: false,
  });
}
