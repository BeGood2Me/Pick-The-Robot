import type { RobotCategory, Vendor } from '@/lib/matching/types';
import { buildApiClickUrl, buildVendorProfileUrl } from './clickUrl';
import type { ApiTier } from './tiers';
import { API_TIER_LIMITS } from './tiers';

export interface PublicVendorCatalogEntry {
  id: string;
  slug: string;
  name: string;
  categories: RobotCategory[];
  robotTypes: Vendor['robotTypes'];
  regions: string[];
  sponsored: boolean;
  shortDescription: string;
  clickUrl: string;
  profileUrl: string;
  logoUrl?: string;
  industries?: string[];
  idealFacilitySize?: Vendor['idealFacilitySize'];
  budgetTier?: Vendor['budgetTier'];
  deploymentComplexity?: Vendor['deploymentComplexity'];
  acquisitionModelsSupported?: Vendor['acquisitionModelsSupported'];
  bestFor?: string[];
  strengths?: string[];
  limitations?: string[];
}

export interface PublicVendorsResponse {
  tier: ApiTier;
  category: RobotCategory;
  region?: string;
  count: number;
  vendors: PublicVendorCatalogEntry[];
}

export function toPublicVendorCatalogEntry(
  vendor: Vendor,
  tier: ApiTier,
  baseUrl: string,
): PublicVendorCatalogEntry {
  const entry: PublicVendorCatalogEntry = {
    id: vendor.id,
    slug: vendor.slug,
    name: vendor.name,
    categories: vendor.categories,
    robotTypes: vendor.robotTypes,
    regions: vendor.regions,
    sponsored: vendor.sponsored ?? false,
    shortDescription: vendor.shortDescription,
    clickUrl: buildApiClickUrl(baseUrl, vendor.slug, 'catalog'),
    profileUrl: buildVendorProfileUrl(baseUrl, vendor.slug),
  };

  if (vendor.sponsored && vendor.logoUrl) {
    entry.logoUrl = vendor.logoUrl.startsWith('http')
      ? vendor.logoUrl
      : `${baseUrl.replace(/\/$/, '')}${vendor.logoUrl}`;
  }

  if (tier === 'pro') {
    entry.industries = vendor.industries;
    entry.idealFacilitySize = vendor.idealFacilitySize;
    entry.budgetTier = vendor.budgetTier;
    entry.deploymentComplexity = vendor.deploymentComplexity;
    entry.acquisitionModelsSupported = vendor.acquisitionModelsSupported;
    entry.bestFor = vendor.bestFor;
    entry.strengths = vendor.strengths;
    entry.limitations = vendor.limitations;
  }

  return entry;
}

export function filterVendorsForCatalog(
  vendors: Vendor[],
  category: RobotCategory,
  region?: string,
): Vendor[] {
  return vendors.filter((vendor) => {
    if (!vendor.categories.includes(category)) return false;
    if (region && !vendor.regions.includes(region)) return false;
    return true;
  });
}

export function catalogLimitForTier(tier: ApiTier): number {
  return API_TIER_LIMITS[tier].maxCatalogVendors;
}
