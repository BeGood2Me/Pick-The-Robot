import type {
  CleaningRoiEstimate,
  RecommendationResult,
  RobotMatch,
  VendorMatch,
} from '@/lib/matching/types';
import { ACQUISITION_LABELS, ROBOT_TYPE_LABELS } from '@/lib/matching/explain-labels';
import { getVendorById } from '@/lib/matching/vendors';
import { buildApiClickUrl, buildVendorProfileUrl } from './clickUrl';
import type {
  PublicCleaningRoiFull,
  PublicCleaningRoiSummary,
  PublicMatchResponse,
  PublicMatchScore,
  PublicRobotMatch,
  PublicVendorMatch,
} from './types';
import { API_TIER_LIMITS, type ApiTier } from './tiers';

function toPublicScore(score: RobotMatch['score']): PublicMatchScore {
  return {
    overallMatch: Math.round(score.overallMatch),
    useCaseFit: Math.round(score.useCaseFit),
    economicFit: Math.round(score.economicFit),
    deploymentFit: Math.round(score.deploymentFit),
  };
}

function toPublicRobotMatch(match: RobotMatch): PublicRobotMatch {
  return {
    robotType: match.robotType,
    robotTypeLabel: ROBOT_TYPE_LABELS[match.robotType],
    acquisitionModel: match.acquisitionModel,
    acquisitionLabel: ACQUISITION_LABELS[match.acquisitionModel],
    score: toPublicScore(match.score),
  };
}

function toPublicVendorMatch(
  vm: VendorMatch,
  tier: ApiTier,
  baseUrl: string,
): PublicVendorMatch | null {
  const vendor = getVendorById(vm.vendorId);
  if (!vendor) return null;

  const entry: PublicVendorMatch = {
    vendorId: vm.vendorId,
    vendorName: vm.vendorName,
    slug: vendor.slug,
    overallMatch: Math.round(vm.overallMatch),
    sponsored: vm.sponsored,
    tags: vm.tags,
    clickUrl: buildApiClickUrl(baseUrl, vendor.slug),
    profileUrl: buildVendorProfileUrl(baseUrl, vendor.slug),
    shortDescription: vendor.shortDescription,
  };

  if (tier === 'pro') {
    entry.robotTypes = vm.robotTypes;
    entry.acquisitionModels = vm.acquisitionModels;
    entry.score = toPublicScore(vm.score);
  }

  if (vendor.sponsored && vendor.logoUrl) {
    entry.logoUrl = vendor.logoUrl.startsWith('http')
      ? vendor.logoUrl
      : `${baseUrl.replace(/\/$/, '')}${vendor.logoUrl}`;
  }

  return entry;
}

function toPublicCleaningRoi(
  roi: CleaningRoiEstimate,
  tier: ApiTier,
): PublicCleaningRoiSummary | PublicCleaningRoiFull {
  const summary: PublicCleaningRoiSummary = {
    viability: roi.viability,
    robotCount: roi.robotCount,
    monthlyNet: roi.monthlyNet,
  };
  if (tier === 'starter') return summary;

  return {
    ...summary,
    coverageSqMPerOuting: roi.coverageSqMPerOuting,
    weeklyFloorHours: roi.weeklyFloorHours,
    weeklyHoursDisplaced: roi.weeklyHoursDisplaced,
    monthlyLaborSavings: roi.monthlyLaborSavings,
    monthlyRobotCost: roi.monthlyRobotCost,
    paybackMonths: roi.paybackMonths,
    assumptions: roi.assumptions,
    notes: roi.notes,
  };
}

/** Map an internal recommendation to a tier-gated public API response. */
export function toPublicMatchResponse(
  result: RecommendationResult,
  tier: ApiTier,
  options: { matchId: string; baseUrl: string },
): PublicMatchResponse {
  const limits = API_TIER_LIMITS[tier];

  const vendorMatches = result.vendorMatches
    .slice(0, limits.maxVendors)
    .map((vm) => toPublicVendorMatch(vm, tier, options.baseUrl))
    .filter((v): v is PublicVendorMatch => v !== null);

  const explanation: PublicMatchResponse['explanation'] = {
    summary: result.explanation.summary,
    robotChoiceReasons: result.explanation.robotChoiceReasons,
    acquisitionReasons: result.explanation.acquisitionReasons,
    cautions: result.explanation.cautions,
  };

  if (tier === 'pro') {
    explanation.vendorChoiceReasons = result.explanation.vendorChoiceReasons;
    if (result.explanation.runnerUpComparison?.length) {
      explanation.runnerUpComparison = result.explanation.runnerUpComparison;
    }
  }

  const response: PublicMatchResponse = {
    matchId: options.matchId,
    tier,
    category: result.profile.category,
    matchConfidence: result.matchConfidence,
    acquisitionRecommendation: result.acquisitionRecommendation,
    bestRobotMatch: toPublicRobotMatch(result.bestRobotMatch),
    explanation,
    vendorMatches,
    vendorsLowConfidence: result.vendorsLowConfidence,
    attribution: {
      required: limits.attributionRequired,
      link: options.baseUrl,
      text: 'Powered by PickTheRobot',
    },
  };

  if (tier === 'pro') {
    if (result.runnerUpRobotMatch) {
      response.runnerUpRobotMatch = toPublicRobotMatch(result.runnerUpRobotMatch);
    }
    if (result.bestLowUpfrontMatch) {
      response.bestLowUpfrontMatch = toPublicRobotMatch(result.bestLowUpfrontMatch);
    }
    if (result.bestLongTermRoiMatch) {
      response.bestLongTermRoiMatch = toPublicRobotMatch(result.bestLongTermRoiMatch);
    }
  }

  if (result.cleaningRoi) {
    response.cleaningRoi = toPublicCleaningRoi(result.cleaningRoi, tier);
  } else if (result.fleetSizingHint) {
    response.fleetSizingHint = result.fleetSizingHint;
  }

  return response;
}
