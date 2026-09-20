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
