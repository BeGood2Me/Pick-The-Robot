import {
  BUDGET_LANE_LABELS,
  CLASS_LABELS,
  PRICE_BAND_LABELS,
  ROBOT_VACUUMS_RESULTS_PATH,
} from '@/lib/content/home-vacuums';
import {
  buildHomeVacuumSharePayload,
  encodeHomeVacuumSharePayload,
} from '@/lib/home-vacuums/share';
import { getHomeVacuumOutboundUrl } from '@/lib/home-vacuums/outbound';
import type {
  HomeProductMatch,
  HomeVacuumProduct,
  HomeVacuumRecommendation,
} from '@/lib/home-vacuums/types';
import { API_TIER_LIMITS, type ApiTier } from './tiers';

export interface PublicHomeMatchScore {
  overallMatch: number;
  useCaseFit?: number;
  economicFit?: number;
  deploymentFit?: number;
}

export interface PublicHomeProductMatch {
  productId: string;
  slug: string;
  brand: string;
  name: string;
  class: string;
  classLabel: string;
  priceBand: string;
  priceBandLabel: string;
  priceUsdApprox: number;
  overallMatch: number;
  score?: PublicHomeMatchScore;
  reasons: string[];
  cautions?: string[];
  shortDescription: string;
  clickUrl: string;
  affiliate: boolean;
}

export interface PublicHomeMatchResponse {
  matchId: string;
  tier: ApiTier;
  track: 'home_vacuum';
  matchConfidence: HomeVacuumRecommendation['matchConfidence'];
  bestClass: string;
  bestClassLabel: string;
  budgetLane: string;
  budgetLaneLabel: string;
  summary: string;
  classReasons: string[];
  cautions: string[];
  affiliateDisclosure: string;
  productMatches: PublicHomeProductMatch[];
  shareUrl: string;
  attribution: {
    required: boolean;
    link: string;
    text: string;
  };
}

export interface PublicHomeProductCatalogEntry {
  productId: string;
  slug: string;
  brand: string;
  name: string;
  class: string;
  classLabel: string;
  priceBand: string;
  priceBandLabel: string;
  priceUsdApprox: number;
  shortDescription: string;
  clickUrl: string;
  affiliate: boolean;
  strengths?: string[];
  limitations?: string[];
}

function toPublicScore(
  score: HomeProductMatch['score'],
  tier: ApiTier,
): PublicHomeMatchScore {
  const base: PublicHomeMatchScore = {
    overallMatch: Math.round(score.overallMatch),
  };
  if (tier === 'pro') {
    base.useCaseFit = Math.round(score.useCaseFit);
    base.economicFit = Math.round(score.economicFit);
    base.deploymentFit = Math.round(score.deploymentFit);
  }
  return base;
}

function toPublicProductMatch(
  match: HomeProductMatch,
  tier: ApiTier,
): PublicHomeProductMatch {
  const { product } = match;
  const entry: PublicHomeProductMatch = {
    productId: product.id,
    slug: product.slug,
    brand: product.brand,
    name: product.name,
    class: product.class,
    classLabel: CLASS_LABELS[product.class],
    priceBand: product.priceBand,
    priceBandLabel: PRICE_BAND_LABELS[product.priceBand],
    priceUsdApprox: product.priceUsdApprox,
    overallMatch: Math.round(match.score.overallMatch),
    reasons: match.reasons.slice(0, tier === 'pro' ? 5 : 3),
    shortDescription: product.shortDescription,
    clickUrl: getHomeVacuumOutboundUrl(product, 'api'),
    affiliate: Boolean(product.affiliateUrl),
  };

  if (tier === 'pro') {
    entry.score = toPublicScore(match.score, tier);
    entry.cautions = match.cautions.slice(0, 4);
  }

  return entry;
}

export function buildHomeVacuumApiShareUrl(
  baseUrl: string,
  answers: HomeVacuumRecommendation['answers'],
): string {
  const origin = baseUrl.replace(/\/$/, '');
  const token = encodeHomeVacuumSharePayload(buildHomeVacuumSharePayload(answers));
  return `${origin}${ROBOT_VACUUMS_RESULTS_PATH}?share=${token}`;
}

/** Map a home-vacuum recommendation to a tier-gated public API response. */
export function toPublicHomeMatchResponse(
  result: HomeVacuumRecommendation,
  tier: ApiTier,
  options: { matchId: string; baseUrl: string },
): PublicHomeMatchResponse {
  const limits = API_TIER_LIMITS[tier];
  const productMatches = result.matches
    .slice(0, limits.maxVendors)
    .map((m) => toPublicProductMatch(m, tier));

  return {
    matchId: options.matchId,
    tier,
    track: 'home_vacuum',
    matchConfidence: result.matchConfidence,
    bestClass: result.bestClass,
    bestClassLabel: CLASS_LABELS[result.bestClass],
    budgetLane: result.budgetLane,
    budgetLaneLabel: BUDGET_LANE_LABELS[result.budgetLane],
    summary: result.summary,
    classReasons: result.classReasons,
    cautions: result.cautions.slice(0, tier === 'pro' ? 6 : 3),
    affiliateDisclosure: result.affiliateDisclosure,
    productMatches,
    shareUrl: buildHomeVacuumApiShareUrl(options.baseUrl, result.answers),
    attribution: {
      required: limits.attributionRequired,
      link: options.baseUrl,
      text: 'Powered by PickTheRobot',
    },
  };
}

export function toPublicHomeProductCatalogEntry(
  product: HomeVacuumProduct,
  tier: ApiTier,
): PublicHomeProductCatalogEntry {
  const entry: PublicHomeProductCatalogEntry = {
    productId: product.id,
    slug: product.slug,
    brand: product.brand,
    name: product.name,
    class: product.class,
    classLabel: CLASS_LABELS[product.class],
    priceBand: product.priceBand,
    priceBandLabel: PRICE_BAND_LABELS[product.priceBand],
    priceUsdApprox: product.priceUsdApprox,
    shortDescription: product.shortDescription,
    clickUrl: getHomeVacuumOutboundUrl(product, 'api-catalog'),
    affiliate: Boolean(product.affiliateUrl),
  };

  if (tier === 'pro') {
    entry.strengths = product.strengths;
    entry.limitations = product.limitations;
  }

  return entry;
}
