import type {
  AcquisitionModel,
  RestaurantProfile,
  RestaurantRobotType,
  ScoredRobotResult,
} from '../types';
import { clamp, laborCostFactor, staffingPressureScore, techReadinessScore, withOverallMatch } from './shared';
import { applyDelta, createTrace, recordHit } from './trace';

export const RESTAURANT_ROBOT_TYPES: RestaurantRobotType[] = [
  'serving_robot',
  'bussing_robot',
  'kitchen_automation',
  'reception_robot',
];

const VENUE_BOOSTS: Partial<
  Record<RestaurantProfile['venueType'], Partial<Record<RestaurantRobotType, number>>>
> = {
  buffet: {
    bussing_robot: 12,
    serving_robot: 5,
    kitchen_automation: 8,
  },
  food_hall: {
    serving_robot: 10,
    bussing_robot: 8,
    reception_robot: 6,
  },
  qsr: {
    kitchen_automation: 10,
    serving_robot: 5,
  },
};

function restaurantUseCaseFit(
  profile: RestaurantProfile,
  robotType: RestaurantRobotType,
): { score: number; trace: ReturnType<typeof createTrace> } {
  const trace = createTrace();
  const painMap: Record<
    RestaurantProfile['mainPainPoint'],
    Partial<Record<RestaurantRobotType, number>>
  > = {
    food_running: { serving_robot: 92, bussing_robot: 50, kitchen_automation: 40, reception_robot: 30 },
    bussing: { bussing_robot: 92, serving_robot: 55, kitchen_automation: 35, reception_robot: 25 },
    kitchen_bottleneck: {
      kitchen_automation: 95,
      serving_robot: 35,
      bussing_robot: 30,
      reception_robot: 20,
    },
    staff_shortage: {
      serving_robot: 75,
      bussing_robot: 78,
      kitchen_automation: 65,
      reception_robot: 55,
    },
    guest_guidance: {
      reception_robot: 95,
      serving_robot: 30,
      bussing_robot: 25,
      kitchen_automation: 20,
    },
  };

  let score = painMap[profile.mainPainPoint][robotType] ?? 50;
  recordHit(trace, {
    id: `pain_${profile.mainPainPoint}`,
    delta: score - 50,
    dimension: 'useCase',
    message: `Main pain point (${profile.mainPainPoint.replace('_', ' ')}) drives robot type fit.`,
  });

  const venueBoost = VENUE_BOOSTS[profile.venueType]?.[robotType];
  if (venueBoost) {
    score = applyDelta(
      score,
      trace,
      `venue_${profile.venueType}`,
      venueBoost,
      'useCase',
      `${profile.venueType.replace('_', ' ')} venues commonly use this robot class.`,
    );
  }

  if (profile.venueType === 'buffet' && profile.mainPainPoint === 'staff_shortage' && robotType === 'bussing_robot') {
    score = applyDelta(
      score,
      trace,
      'buffet_staff_bussing',
      8,
      'useCase',
      'Buffets with staffing pressure benefit strongly from bussing automation.',
    );
  }

  if (
    profile.mainPainPoint === 'food_running' &&
    profile.seatsPerDay > 200 &&
    robotType === 'serving_robot'
  ) {
    score = applyDelta(
      score,
      trace,
      'high_volume_serving',
      10,
      'useCase',
      `Seat volume (${profile.seatsPerDay}/day) supports serving automation.`,
    );
  }

  const isFineDiningTight =
    profile.venueType === 'full_service' &&
    profile.layoutComplexity === 'tight' &&
    profile.aisleWidth === 'narrow';
  if (isFineDiningTight && (robotType === 'serving_robot' || robotType === 'bussing_robot')) {
    score = applyDelta(
      score,
      trace,
      'fine_dining_tight',
      -25,
      'useCase',
      'Tight fine-dining layouts limit front-of-house robot navigation.',
    );
  }

  if (profile.aisleWidth === 'wide' && robotType === 'serving_robot') {
    score = applyDelta(score, trace, 'wide_aisle_serving', 8, 'useCase', 'Wide aisles ease serving robot routes.');
  }
  if (profile.serviceIntensity === 'high' && robotType === 'serving_robot') {
    score = applyDelta(score, trace, 'high_intensity_serving', 8, 'useCase', 'High service intensity increases serving robot value.');
  }

  if (profile.tableCount && profile.tableCount > 30 && robotType === 'bussing_robot') {
    score = applyDelta(
      score,
      trace,
      'high_table_count_bussing',
      6,
      'useCase',
      'Higher table counts increase bussing automation value.',
    );
  }

  return { score: clamp(score), trace };
}

function restaurantEconomicFit(
  profile: RestaurantProfile,
  robotType: RestaurantRobotType,
): { score: number; trace: ReturnType<typeof createTrace> } {
  const trace = createTrace();
  const utilizationBase = profile.seatsPerDay * profile.peakHoursPerDay;
  const utilizationFactor = clamp(40 + Math.log10(Math.max(utilizationBase, 1)) * 15);

  const peakRatio = profile.peakHoursPerDay / Math.max(profile.hoursPerDay, 1);
  const idlePenalty = peakRatio < 0.35 ? 15 : peakRatio < 0.5 ? 8 : 0;

  let score =
    laborCostFactor(profile.laborCostPerHour) * 0.35 +
    utilizationFactor * 0.4 +
    staffingPressureScore(profile.staffingPressure) * 0.25 -
    idlePenalty;

  if (idlePenalty > 0) {
    recordHit(trace, {
      id: 'idle_penalty',
      delta: -idlePenalty,
      dimension: 'economic',
      message: 'Short peak periods with long idle time reduce economic returns.',
    });
  }

  if (robotType === 'serving_robot' || robotType === 'bussing_robot') {
    const frontOfHouseBoost = clamp(utilizationFactor * 0.15);
    score = applyDelta(
      score,
      trace,
      'foh_utilization',
      frontOfHouseBoost,
      'economic',
      'Front-of-house robots scale with covers and peak-hour intensity.',
    );
  }

  if (robotType === 'kitchen_automation') {
    let kitchenBoost = 0;
    if (profile.venueType === 'qsr') kitchenBoost += 10;
    if (profile.mainPainPoint === 'kitchen_bottleneck') kitchenBoost += 12;
    if (kitchenBoost > 0) {
      score = applyDelta(
        score,
        trace,
        'kitchen_automation_economic',
        kitchenBoost,
        'economic',
        'Kitchen automation economics improve with QSR throughput and kitchen bottlenecks.',
      );
    } else {
      score = applyDelta(
        score,
        trace,
        'kitchen_automation_mismatch',
        -8,
        'economic',
        'Kitchen automation has weaker ROI without high kitchen throughput.',
      );
    }
  }

  if (robotType === 'reception_robot') {
    if (profile.mainPainPoint === 'guest_guidance') {
      score = applyDelta(
        score,
        trace,
        'reception_guidance',
        12,
        'economic',
        'Guest guidance pain points justify reception robot economics.',
      );
    } else {
      score = applyDelta(
        score,
        trace,
        'reception_low_need',
        -10,
        'economic',
        'Reception robots have limited ROI without guest-guidance needs.',
      );
    }
  }

  return { score: clamp(score), trace };
}

function restaurantDeploymentFit(
  profile: RestaurantProfile,
  robotType: RestaurantRobotType,
): { score: number; trace: ReturnType<typeof createTrace> } {
  const trace = createTrace();
  let score = techReadinessScore(profile.techReadiness);

  const deployCost: Record<RestaurantRobotType, number> = {
    serving_robot: 10,
    bussing_robot: 8,
    kitchen_automation: 25,
    reception_robot: 5,
  };
  score = applyDelta(
    score,
    trace,
    'deploy_base_cost',
    -deployCost[robotType],
    'deployment',
    'Deployment effort varies by robot class.',
  );

  if (profile.layoutComplexity === 'tight') {
    if (robotType === 'kitchen_automation') {
      score = applyDelta(score, trace, 'tight_kitchen', -5, 'deployment', 'Tight kitchens add integration complexity.');
    }
    if (robotType === 'serving_robot' || robotType === 'bussing_robot') {
      score = applyDelta(
        score,
        trace,
        'tight_foh',
        -15,
        'deployment',
        'Tight dining layouts challenge front-of-house robot routes.',
      );
    }
  }

  if (profile.tableCount && profile.tableCount > 40 && robotType === 'serving_robot') {
    score = applyDelta(
      score,
      trace,
      'many_tables_serving',
      -8,
      'deployment',
      'High table counts in tight layouts increase serving robot deployment complexity.',
    );
  }

  return { score: clamp(score), trace };
}

function mergeTraces(...traces: ReturnType<typeof createTrace>[]) {
  return { hits: traces.flatMap((t) => t.hits) };
}

export function scoreRestaurantRobotType(
  profile: RestaurantProfile,
  robotType: RestaurantRobotType,
): ScoredRobotResult {
  const useCase = restaurantUseCaseFit(profile, robotType);
  const economic = restaurantEconomicFit(profile, robotType);
  const deployment = restaurantDeploymentFit(profile, robotType);
  const trace = mergeTraces(useCase.trace, economic.trace, deployment.trace);

  return {
    score: withOverallMatch({
      useCaseFit: useCase.score,
      economicFit: economic.score,
      deploymentFit: deployment.score,
    }),
    trace,
  };
}

export function recommendRestaurantAcquisition(profile: RestaurantProfile): AcquisitionModel {
  if (profile.acquisitionPreference !== 'open') {
    return profile.acquisitionPreference;
  }

  const highStableUtilization =
    profile.seatsPerDay > 250 &&
    profile.peakHoursPerDay >= 4 &&
    profile.daysPerWeek >= 6 &&
    profile.serviceIntensity === 'high';

  if (profile.budgetPreference === 'low_upfront' || profile.techReadiness === 'low') {
    return 'raas';
  }

  if (
    profile.budgetPreference === 'maximize_long_term_roi' &&
    highStableUtilization &&
    profile.techReadiness === 'high'
  ) {
    return 'buy';
  }

  if (highStableUtilization && profile.techReadiness === 'high') return 'buy';

  return 'lease';
}
