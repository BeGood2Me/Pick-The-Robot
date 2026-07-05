import vendorData from '@/data/vendors.json';
import type { Vendor, VendorMatch } from './types';

/**
 * Vendor dataset — edit src/data/vendors.json (run `node scripts/export-vendors.mjs` after TS edits if migrating back).
 */
export const VENDORS: Vendor[] = vendorData as Vendor[];

/** Sponsored listings sort by match score; sponsored boost is applied in scoring. */
export function compareVendorMatches(a: VendorMatch, b: VendorMatch): number {
  return b.overallMatch - a.overallMatch;
}

/** Sponsored listings first, then alphabetical. */
export function compareVendorsForDisplay(a: Vendor, b: Vendor): number {
  if (!!a.sponsored !== !!b.sponsored) return a.sponsored ? -1 : 1;
  return a.name.localeCompare(b.name);
}

export function getVendorsByCategory(category: Vendor['categories'][number]): Vendor[] {
  return VENDORS.filter((v) => v.categories.includes(category)).sort(compareVendorsForDisplay);
}
export function getVendorById(id: string): Vendor | undefined {
  return VENDORS.find((v) => v.id === id);
}

export function getVendorBySlug(slug: string): Vendor | undefined {
  return VENDORS.find((v) => v.slug === slug);
}
