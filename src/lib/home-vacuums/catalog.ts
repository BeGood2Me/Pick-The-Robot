import rawCatalog from '@/data/home-vacuums.json';
import type { HomeVacuumProduct } from './types';

/**
 * Product SKUs for the home matcher.
 * Set per-marketplace Amazon (or other) links on each SKU, e.g.:
 *   "affiliateUrls": {
 *     "US": "https://www.amazon.com/dp/ASIN?tag=your-us-20",
 *     "UK": "https://www.amazon.co.uk/dp/ASIN?tag=your-uk-21"
 *   }
 * Legacy single `affiliateUrl` still works as a US fallback.
 */
const catalog = rawCatalog as HomeVacuumProduct[];

export function getHomeVacuumCatalog(): HomeVacuumProduct[] {
  return catalog;
}

export function getHomeVacuumById(id: string): HomeVacuumProduct | undefined {
  return catalog.find((product) => product.id === id);
}

export function getHomeVacuumBySlug(slug: string): HomeVacuumProduct | undefined {
  return catalog.find((product) => product.slug === slug);
}

export interface HomeVacuumBrand {
  name: string;
  modelCount: number;
  modelNames: string[];
  outboundUrl: string;
}

/** Unique brands in the home vacuum SKU catalog (not B2B vendors.json). */
export function getHomeVacuumBrands(): HomeVacuumBrand[] {
  const byBrand = new Map<string, HomeVacuumBrand>();

  for (const product of catalog) {
    const existing = byBrand.get(product.brand);
    if (existing) {
      existing.modelCount += 1;
      existing.modelNames.push(product.name);
      continue;
    }
    byBrand.set(product.brand, {
      name: product.brand,
      modelCount: 1,
      modelNames: [product.name],
      outboundUrl: product.outboundUrl,
    });
  }

  return [...byBrand.values()].sort((a, b) => a.name.localeCompare(b.name));
}
