import { buildExplanation } from './explain';
import { emitMatchEvent } from './events';
import { getFleetSizingHint } from './sizing';
import {
  acquisitionForBudgetGoal,
  getRobotTypesForCategory,
  recommendAcquisition,
  scoreRobotType,
  scoreVendorForProfile,
} from './scoring';
import { getVendorsByCategory, compareVendorMatches, getVendorById } from './vendors';
import { MATCH_THRESHOLDS } from './types';
import type {
  AcquisitionModel,
  BudgetPreference,
  MatchConfidence,
  RecommendationResult,
  RobotMatch,
  ScoringTrace,
  UserProfile,
  VendorMatch,
} from './types';

function buildRobotMatch(
  profile: UserProfile,
  robotType: RobotMatch['robotType'],
  acquisitionModel: AcquisitionModel,
  score: RobotMatch['score'],
  trace: ScoringTrace,
): RobotMatch {
  return {
    category: profile.category,
    robotType,
    acquisitionModel,
    score,
    trace,
  };
}

function rankRobotMatches(profile: UserProfile, acquisition: AcquisitionModel): RobotMatch[] {
  const types = getRobotTypesForCategory(profile.category);
  return types
    .map((robotType) => {
      const { score, trace } = scoreRobotType(profile, robotType);
      return buildRobotMatch(profile, robotType, acquisition, score, trace);
    })
    .sort((a, b) => b.score.overallMatch - a.score.overallMatch);
}

function pickBest(matches: RobotMatch[], threshold: number): RobotMatch | undefined {
  const candidate = matches[0];
  if (candidate && candidate.score.overallMatch >= threshold) {
    return candidate;
  }
  return undefined;
}

function pickRunnerUp(matches: RobotMatch[], best: RobotMatch): RobotMatch | undefined {
  const runner = matches.find((m) => m.robotType !== best.robotType);
  if (runner && runner.score.overallMatch >= MATCH_THRESHOLDS.runnerUp) {
    return runner;
  }
  return undefined;
}

function pickBudgetVariant(
  profile: UserProfile,
  matches: RobotMatch[],
  budgetPreference: BudgetPreference,
): RobotMatch | undefined {
  const targetAcquisition = acquisitionForBudgetGoal(
    budgetPreference,
    recommendAcquisition(profile),
  );

  const sorted = [...matches].sort((a, b) => b.score.overallMatch - a.score.overallMatch);
  const withAcquisition = sorted.map((m) =>
    buildRobotMatch(profile, m.robotType, targetAcquisition, m.score, m.trace),
  );

  const candidate = withAcquisition[0];
  if (candidate && candidate.score.overallMatch >= MATCH_THRESHOLDS.runnerUp) {
    return candidate;
  }
  return undefined;
}

function getMatchConfidence(overallMatch: number): MatchConfidence {
  if (overallMatch >= MATCH_THRESHOLDS.best) return 'strong';
  if (overallMatch >= MATCH_THRESHOLDS.runnerUp) return 'moderate';
  return 'weak';
}

function shouldShowBudgetVariant(
  variant: RobotMatch | undefined,
  best: RobotMatch,
  acquisitionRecommendation: AcquisitionModel,
): variant is RobotMatch {
  if (!variant || variant.score.overallMatch < MATCH_THRESHOLDS.runnerUp) return false;
  const sameRobot = variant.robotType === best.robotType;
  const sameAcquisition = variant.acquisitionModel === acquisitionRecommendation;
  return !(sameRobot && sameAcquisition);
}

function withKnownVendorsOnly(matches: VendorMatch[]): VendorMatch[] {
  return matches.filter((m) => getVendorById(m.vendorId) !== undefined);
}

function rankVendors(
  profile: UserProfile,
  chosenRobotType: RobotMatch['robotType'],
  acquisition: AcquisitionModel,
): { matches: VendorMatch[]; lowConfidence: boolean; exclusionReasons: string[] } {
  const vendors = getVendorsByCategory(profile.category);

  const scored = vendors
    .map((vendor) => {
      const { score, overallMatch, tags, exclusionReason } = scoreVendorForProfile(
        profile,
        vendor,
        chosenRobotType,
        acquisition,
      );

      return {
        vendorId: vendor.id,
        vendorName: vendor.name,
        category: profile.category,
        robotTypes: vendor.robotTypes,
        acquisitionModels: vendor.acquisitionModelsSupported,
        score,
        overallMatch,
        tags,
        sponsored: vendor.sponsored ?? false,
        exclusionReason,
      };
    })
    .sort(compareVendorMatches);

  const qualified = scored.filter((v) => v.overallMatch >= MATCH_THRESHOLDS.vendorMin);
  if (qualified.length > 0) {
    return {
      matches: withKnownVendorsOnly(
        qualified.slice(0, MATCH_THRESHOLDS.maxVendors).map(({ exclusionReason: _, ...v }) => v),
      ),
      lowConfidence: false,
      exclusionReasons: [],
    };
  }

  const fallback = scored.filter((v) => v.overallMatch >= MATCH_THRESHOLDS.vendorFallbackMin);
  const pool = fallback.length > 0 ? fallback : scored;
  const exclusionReasons = [
    ...new Set(
      pool
        .map((v) => v.exclusionReason)
        .filter((r): r is string => r !== null)
        .slice(0, 3),
    ),
  ];

  return {
    matches: withKnownVendorsOnly(pool.slice(0, 3).map(({ exclusionReason: _, ...v }) => v)),
    lowConfidence: true,
    exclusionReasons,
  };
}

/**
 * Primary entry point — generates a full recommendation from a user profile.
 */
export function generateRecommendation(profile: UserProfile): RecommendationResult {
  const acquisitionRecommendation = recommendAcquisition(profile);
  const rankedMatches = rankRobotMatches(profile, acquisitionRecommendation);

  let bestRobotMatch = pickBest(rankedMatches, MATCH_THRESHOLDS.best);

  if (!bestRobotMatch && rankedMatches.length > 0) {
    bestRobotMatch = rankedMatches[0];
  }

  if (!bestRobotMatch) {
    throw new Error('No robot types available for category');
  }

  const runnerUpRobotMatch = pickRunnerUp(rankedMatches, bestRobotMatch);
  const lowUpfrontCandidate = pickBudgetVariant(profile, rankedMatches, 'low_upfront');
  const roiCandidate = pickBudgetVariant(profile, rankedMatches, 'maximize_long_term_roi');
  const bestLowUpfrontMatch = shouldShowBudgetVariant(
    lowUpfrontCandidate,
    bestRobotMatch,
    acquisitionRecommendation,
  )
    ? lowUpfrontCandidate
    : undefined;
  const bestLongTermRoiMatch = shouldShowBudgetVariant(
    roiCandidate,
    bestRobotMatch,
    acquisitionRecommendation,
  )
    ? roiCandidate
    : undefined;

  const { matches: vendorMatches, lowConfidence: vendorsLowConfidence, exclusionReasons: vendorExclusionReasons } =
    rankVendors(profile, bestRobotMatch.robotType, acquisitionRecommendation);

  const matchConfidence = getMatchConfidence(bestRobotMatch.score.overallMatch);

  const explanation = buildExplanation(
    profile,
    bestRobotMatch,
    acquisitionRecommendation,
    vendorMatches,
    runnerUpRobotMatch,
  );

  const fleetSizingHint = getFleetSizingHint(profile, bestRobotMatch.robotType);

  const result: RecommendationResult = {
    profile,
    bestRobotMatch,
    runnerUpRobotMatch,
    bestLowUpfrontMatch,
    bestLongTermRoiMatch,
    allRobotMatches: rankedMatches,
    acquisitionRecommendation,
    vendorMatches,
    vendorsLowConfidence,
    vendorExclusionReasons: vendorsLowConfidence ? vendorExclusionReasons : undefined,
    matchConfidence,
    explanation,
    fleetSizingHint,
  };

  emitMatchEvent({
    type: 'match_generated',
    payload: {
      category: profile.category,
      robotType: bestRobotMatch.robotType,
      acquisition: acquisitionRecommendation,
      overallMatch: bestRobotMatch.score.overallMatch,
      matchConfidence,
      vendorCount: vendorMatches.length,
      vendorsLowConfidence,
    },
  });

  return result;
}

/** Utility for UI vendor click tracking. */
export function trackVendorClick(vendorId: string, vendorName: string): void {
  emitMatchEvent({
    type: 'vendor_clicked',
    payload: { vendorId, vendorName },
  });
}

/** Utility for UI robot type click tracking. */
export function trackRobotClick(robotType: string, category: string): void {
  emitMatchEvent({
    type: 'robot_clicked',
    payload: { robotType, category },
  });
}

/** Utility when user changes category in the wizard. */
export function trackCategoryChanged(category: string): void {
  emitMatchEvent({
    type: 'category_changed',
    payload: { category },
  });
}

/** Utility when user saves or exports results. */
export function trackResultsSaved(payload: unknown): void {
  emitMatchEvent({
    type: 'results_saved',
    payload,
  });
}
