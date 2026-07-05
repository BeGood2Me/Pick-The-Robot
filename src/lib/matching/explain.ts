import { topHits } from './scoring/trace';
import { ROBOT_TYPE_LABELS, ACQUISITION_LABELS } from './explain-labels';
import type {
  AcquisitionModel,
  RobotMatch,
  RobotType,
  UserProfile,
  VendorMatch,
  WarehouseProfile,
  CleaningProfile,
  RestaurantProfile,
  RecommendationExplanation,
} from './types';

export { ROBOT_TYPE_LABELS, ACQUISITION_LABELS } from './explain-labels';

function robotLabel(type: RobotType): string {
  return ROBOT_TYPE_LABELS[type];
}

function reasonsFromTrace(match: RobotMatch, limit = 5): string[] {
  const hits = topHits(match.trace, limit);
  if (hits.length > 0) {
    return hits.map((h) => h.message);
  }
  return [`We recommended a ${robotLabel(match.robotType)} based on your profile inputs.`];
}

function buildRunnerUpComparison(best: RobotMatch, runnerUp: RobotMatch): string[] | undefined {
  const gap = best.score.overallMatch - runnerUp.score.overallMatch;
  if (gap > 10) return undefined;

  const comparisons: string[] = [
    `${robotLabel(runnerUp.robotType)} scored ${runnerUp.score.overallMatch} vs ${best.score.overallMatch} for ${robotLabel(best.robotType)}.`,
  ];

  const runnerHits = topHits(runnerUp.trace, 2);
  if (runnerHits.length > 0) {
    comparisons.push(`Runner-up strengths: ${runnerHits.map((h) => h.message).join(' ')}`);
  }

  if (gap <= 5) {
    comparisons.push('Scores are very close — a pilot comparing both types may be worthwhile.');
  }

  return comparisons;
}

function supplementalWarehouseReasons(profile: WarehouseProfile, robot: RobotMatch): string[] {
  const extra: string[] = [];
  if (profile.picksPerDay > 5000 && !robot.trace.hits.some((h) => h.id === 'high_pick_volume')) {
    extra.push(`Your pick volume (${profile.picksPerDay.toLocaleString()}/day) supports automation ROI.`);
  }
  return extra;
}

function supplementalCleaningReasons(profile: CleaningProfile, robot: RobotMatch): string[] {
  const extra: string[] = [];
  if (profile.cleaningFrequencyPerDay >= 2 && !robot.trace.hits.some((h) => h.id.includes('frequency'))) {
    extra.push(
      `Daily cleaning frequency (${profile.cleaningFrequencyPerDay}x) strengthens the automation case.`,
    );
  }
  return extra;
}

function supplementalRestaurantReasons(profile: RestaurantProfile, robot: RobotMatch): string[] {
  const extra: string[] = [];
  if (
    profile.seatsPerDay > 150 &&
    robot.robotType === 'serving_robot' &&
    !robot.trace.hits.some((h) => h.id === 'high_volume_serving')
  ) {
    extra.push(`Your seat volume (${profile.seatsPerDay}/day) supports serving automation.`);
  }
  return extra;
}

function robotReasonsForProfile(profile: UserProfile, robot: RobotMatch): string[] {
  const fromTrace = reasonsFromTrace(robot, 5);
  let supplemental: string[] = [];

  switch (profile.category) {
    case 'warehouse':
      supplemental = supplementalWarehouseReasons(profile, robot);
      break;
    case 'cleaning':
      supplemental = supplementalCleaningReasons(profile, robot);
      break;
    case 'restaurant':
      supplemental = supplementalRestaurantReasons(profile, robot);
      break;
  }

  const combined = [...fromTrace, ...supplemental];
  return combined.length >= 2 ? combined.slice(0, 6) : combined;
}

function acquisitionReasons(
  profile: UserProfile,
  acquisition: AcquisitionModel,
): string[] {
  const reasons: string[] = [];
  const label = ACQUISITION_LABELS[acquisition];

  if (profile.acquisitionPreference !== 'open' && profile.acquisitionPreference === acquisition) {
    reasons.push(`You indicated a preference for ${label}, which we aligned with.`);
  }

  if (profile.budgetPreference === 'low_upfront' && acquisition === 'raas') {
    reasons.push('RaaS fits your low-upfront budget preference and spreads cost over time.');
  }
  if (profile.budgetPreference === 'maximize_long_term_roi' && acquisition === 'buy') {
    reasons.push('Buying outright aligns with maximizing long-term ROI when utilization is consistent.');
  }
  if (acquisition === 'lease') {
    reasons.push(
      'Leasing offers a middle ground — lower upfront than buying with more flexibility than a multi-year commitment.',
    );
  }
  if (profile.techReadiness === 'low' && (acquisition === 'raas' || acquisition === 'lease')) {
    reasons.push(
      'Lower tech readiness favors subscription or lease models that include vendor support.',
    );
  }
  if (reasons.length === 0) {
    reasons.push(`We recommended ${label} based on your budget, utilization, and readiness.`);
  }

  return reasons;
}

function vendorReasons(vendorMatches: VendorMatch[]): string[] {
  if (vendorMatches.length === 0) {
    return ['No vendors met the minimum match threshold for your profile.'];
  }

  return vendorMatches.slice(0, 3).map((v) => {
    const parts: string[] = [`${v.vendorName} is a strong match`];
    if (v.tags.includes('robot_type_match')) {
      parts.push('supports your recommended robot type');
    }
    if (v.tags.includes('acquisition_supported')) {
      parts.push('offers your preferred acquisition model');
    }
    if (v.tags.includes('region_match')) {
      parts.push('operates in your region');
    }
    if (v.sponsored) {
      parts.push('(sponsored listing)');
    }
    return parts.join(' because it ') + '.';
  });
}

function buildCautions(profile: UserProfile, robot: RobotMatch): string[] {
  const cautions: string[] = [];

  if (profile.techReadiness === 'low') {
    cautions.push(
      'Your team has limited robotics experience — plan for training and a phased rollout.',
    );
  }

  switch (profile.category) {
    case 'warehouse':
      if (profile.wmsReadiness === 'none' && robot.robotType === 'picking_assist') {
        cautions.push(
          'Pick-assist solutions work best with WMS integration — expect integration effort.',
        );
      }
      if (profile.aisleConstraints === 'tight') {
        cautions.push('Tight aisles may require layout adjustments or smaller form-factor robots.');
      }
      if (profile.facilitySizeSqM < 3000 && profile.ordersPerDay < 500) {
        cautions.push(
          'Smaller facilities with low volume may see longer payback — validate ROI with a pilot.',
        );
      }
      if (profile.temperatureZone === 'cold') {
        cautions.push('Cold-chain deployments require rated hardware and may extend pilot timelines.');
      }
      break;
    case 'cleaning':
      if (profile.obstacleComplexity === 'high') {
        cautions.push(
          'High obstacle complexity increases deployment time — a site survey is recommended.',
        );
      }
      if (profile.cleaningFrequencyPerDay < 1) {
        cautions.push('Low cleaning frequency reduces automation ROI — confirm utilization.');
      }
      break;
    case 'restaurant':
      if (profile.layoutComplexity === 'tight' || profile.aisleWidth === 'narrow') {
        cautions.push(
          'Your layout is tight — deployment may require aisle adjustments or route planning.',
        );
      }
      if (profile.peakHoursPerDay / profile.hoursPerDay < 0.4) {
        cautions.push('Short peak periods with long idle time can reduce economic returns.');
      }
      break;
  }

  if (robot.score.overallMatch < 60) {
    cautions.push('Match confidence is moderate — consider a pilot before full deployment.');
  }

  return cautions;
}

function categoryLabel(category: UserProfile['category']): string {
  const labels: Record<UserProfile['category'], string> = {
    warehouse: 'warehouse',
    cleaning: 'cleaning',
    restaurant: 'restaurant',
  };
  return labels[category];
}

export function buildExplanation(
  profile: UserProfile,
  chosenRobot: RobotMatch,
  acquisitionRecommendation: AcquisitionModel,
  vendorMatches: VendorMatch[],
  runnerUp?: RobotMatch,
): RecommendationExplanation {
  const robotName = robotLabel(chosenRobot.robotType);
  const acqName = ACQUISITION_LABELS[acquisitionRecommendation];

  const robotChoiceReasons = robotReasonsForProfile(profile, chosenRobot);
  const runnerUpComparison =
    runnerUp && runnerUp.robotType !== chosenRobot.robotType
      ? buildRunnerUpComparison(chosenRobot, runnerUp)
      : undefined;

  return {
    summary: `For your ${categoryLabel(profile.category)} use case, we recommend a ${robotName} with ${acqName}.`,
    robotChoiceReasons,
    acquisitionReasons: acquisitionReasons(profile, acquisitionRecommendation),
    vendorChoiceReasons: vendorReasons(vendorMatches),
    cautions: buildCautions(profile, chosenRobot),
    runnerUpComparison,
  };
}
