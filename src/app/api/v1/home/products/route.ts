import { resolveApiBaseUrl } from '@/lib/api/baseUrl';
import { enforceApiLimits, finalizeApiLimits, jsonWithLimits } from '@/lib/api/guard';
import { toPublicHomeProductCatalogEntry } from '@/lib/api/publicHomeMatch';
import { resolveApiTier, unauthorizedApiResponse } from '@/lib/api/tiers';
import { catalogLimitForTier } from '@/lib/api/publicVendors';
import { getHomeVacuumCatalog } from '@/lib/home-vacuums/catalog';
import type { HomeVacuumClass } from '@/lib/home-vacuums/types';
import { NextResponse } from 'next/server';

const VALID_CLASSES = new Set<HomeVacuumClass>(['vacuum_only', 'mop_vac_combo']);

/**
 * GET /api/v1/home/products — home vacuum SKU catalog (not business vendors).
 * Rate-limited like /vendors; does not consume monthly match quota.
 */
export async function GET(request: Request) {
  const tier = await resolveApiTier(request);
  if (tier === null) {
    return unauthorizedApiResponse(request);
  }

  const { searchParams } = new URL(request.url);
  const classFilter = searchParams.get('class') as HomeVacuumClass | null;

  if (classFilter && !VALID_CLASSES.has(classFilter)) {
    return NextResponse.json(
      {
        error: 'validation_failed',
        message: 'Query parameter class must be vacuum_only or mop_vac_combo when set.',
      },
      { status: 400 },
    );
  }

  const blocked = await enforceApiLimits(request, tier, 'vendors');
  if (blocked) return blocked;

  const catalog = getHomeVacuumCatalog().filter((p) =>
    classFilter ? p.class === classFilter : true,
  );
  const products = catalog
    .slice(0, catalogLimitForTier(tier))
    .map((product) => toPublicHomeProductCatalogEntry(product, tier));

  const payload = {
    tier,
    track: 'home_vacuum' as const,
    ...(classFilter ? { class: classFilter } : {}),
    count: products.length,
    products,
  };

  return jsonWithLimits(payload, tier, await finalizeApiLimits(request, tier, 'vendors'), {
    includeUsage: false,
  });
}
