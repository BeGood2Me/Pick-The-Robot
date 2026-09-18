import rawCatalog from '@/data/home-vacuums.json';
import type { HomeVacuumProduct } from './types';

/** Product SKUs for the home matcher. Set `affiliateUrl` when a tracked retail link exists. */
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
