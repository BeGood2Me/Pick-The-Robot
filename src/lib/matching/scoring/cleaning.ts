import type { AcquisitionModel, CleaningProfile, CleaningRobotType, ScoredRobotResult } from '../types';
import { clamp, laborCostFactor, staffingPressureScore, techReadinessScore, withOverallMatch } from './shared';
import { applyDelta, createTrace, recordHit } from './trace';

export const CLEANING_ROBOT_TYPES: CleaningRobotType[] = [
  'office_cleaner',
  'large_scrubber',
  'industrial_cleaner',
];

function cleaningUseCaseFit(
  profile: CleaningProfile,
  robotType: CleaningRobotType,
): { score: number; trace: ReturnType<typeof createTrace> } {
  const trace = createTrace();
  let score = 50;

  if (profile.environmentType === 'industrial' && robotType === 'industrial_cleaner') {
    score = 92;
    recordHit(trace, {
      id: 'env_industrial',
      delta: 42,
      dimension: 'useCase',
      message: 'Industrial environments benefit from heavy-duty cleaning platforms.',
    });
  } else if (
    (profile.environmentType === 'office' || profile.environmentType === 'retail') &&
    robotType === 'office_cleaner'
  ) {
    score = 85;
    recordHit(trace, {
      id: 'env_office_retail',
      delta: 35,
      dimension: 'useCase',
      message: 'Office and retail spaces typically suit compact daily cleaning robots.',
    });
  } else if (
    (profile.environmentType === 'retail' ||
      profile.environmentType === 'warehouse' ||
      profile.environmentType === 'mixed') &&
    robotType === 'large_scrubber'
  ) {
    score = 80;
    recordHit(trace, {
      id: 'env_large_floor',
      delta: 30,
      dimension: 'useCase',
      message: 'Large open floors in retail, warehouse, or mixed sites suit scrubber robots.',
    });
  }

  if (profile.environmentType === 'mixed' && robotType === 'large_scrubber') {
    score = applyDelta(
      score,
      trace,
      'env_mixed_scrubber',
      5,
      'useCase',
      'Mixed environments with varied floor types often need versatile scrubbers.',
    );
  }

  if (profile.floorAreaSqM > 3000 && robotType === 'large_scrubber') {
    score = applyDelta(
      score,
      trace,
      'large_area_scrubber',
      12,
      'useCase',
      `Floor area (${profile.floorAreaSqM.toLocaleString()} m²) favors larger scrubber coverage.`,
    );
  }
  if (profile.floorAreaSqM < 800 && robotType === 'office_cleaner') {
    score = applyDelta(score, trace, 'small_area_office', 15, 'useCase', 'Compact floor plans suit office cleaning robots.');
  }
  if (profile.floorAreaSqM > 5000 && robotType === 'office_cleaner') {
    score = applyDelta(score, trace, 'large_area_office_penalty', -15, 'useCase', 'Very large areas exceed typical office robot coverage.');
  }

  const typeFit: Record<CleaningProfile['cleaningType'], Partial<Record<CleaningRobotType, number>>> = {
    vacuum: { office_cleaner: 15, large_scrubber: 0, industrial_cleaner: -5 },
    scrub: { large_scrubber: 15, industrial_cleaner: 10, office_cleaner: -10 },
    sweep: { industrial_cleaner: 12, large_scrubber: 8, office_cleaner: 0 },
    combo: { large_scrubber: 12, industrial_cleaner: 8, office_cleaner: 5 },
  };
  const typeDelta = typeFit[profile.cleaningType][robotType] ?? 0;
  if (typeDelta !== 0) {
    score = applyDelta(
      score,
      trace,
      `cleaning_type_${profile.cleaningType}`,
      typeDelta,
      'useCase',
      `Primary cleaning type (${profile.cleaningType}) influences robot fit.`,
    );
  }

  if (profile.floorSurface === 'carpet' && robotType === 'office_cleaner') {
    score = applyDelta(score, trace, 'surface_carpet_office', 10, 'useCase', 'Carpet-heavy sites favor vacuum-focused office robots.');
  }
  if (profile.floorSurface === 'carpet' && robotType === 'large_scrubber') {
    score = applyDelta(score, trace, 'surface_carpet_scrubber', -12, 'useCase', 'Scrubbers are a poor fit for carpet-dominant floors.');
  }
  if (profile.floorSurface === 'hard' && robotType === 'large_scrubber') {
    score = applyDelta(score, trace, 'surface_hard_scrubber', 8, 'useCase', 'Hard floors are ideal for autonomous scrubbers.');
  }

  if (profile.cleaningFrequencyPerDay < 1 || profile.floorAreaSqM < 400) {
    score = applyDelta(
      score,
      trace,
      'low_utilization',
      -20,
      'useCase',
      'Low cleaning frequency or very small area reduces automation viability.',
    );
  }

  if (profile.obstacleComplexity === 'high') {
    if (robotType === 'industrial_cleaner' || robotType === 'large_scrubber') {
      score = applyDelta(
        score,
        trace,
        'high_obstacle_nav',
        8,
        'useCase',
        'Higher obstacle complexity favors robots with stronger navigation.',
      );
    }
    if (robotType === 'office_cleaner') {
      score = applyDelta(
        score,
        trace,
        'high_obstacle_office_penalty',
        -12,
        'useCase',
        'Compact office robots struggle in high-obstacle environments.',
      );
    }
  }

  if (profile.messLevel === 'heavy' && robotType === 'industrial_cleaner') {
    score = applyDelta(score, trace, 'heavy_mess_industrial', 10, 'useCase', 'Heavy mess levels need industrial-grade cleaning capacity.');
  }
  if (profile.messLevel === 'light' && robotType === 'office_cleaner') {
    score = applyDelta(score, trace, 'light_mess_office', 8, 'useCase', 'Light daily mess suits compact office cleaners.');
  }

  return { score: clamp(score), trace };
}

function cleaningEconomicFit(
  profile: CleaningProfile,
  robotType: CleaningRobotType,
): { score: number; trace: ReturnType<typeof createTrace> } {
  const trace = createTrace();
  const laborRate = profile.cleaningLaborCostPerHour;
  const taskIntensity =
    profile.cleaningFrequencyPerDay * profile.floorAreaSqM * profile.daysPerWeek;
  const intensityFactor = clamp(35 + Math.log10(Math.max(taskIntensity, 1)) * 12);
  let score =
    laborCostFactor(laborRate) * 0.35 +
    intensityFactor * 0.4 +
    staffingPressureScore(profile.staffingPressure) * 0.25;

  if (profile.staffAssignedToCleaning >= 2) {
    score = applyDelta(
      score,
      trace,
      'staff_redeployment',
      10,
      'economic',
      'Multiple cleaning staff assigned — automation ROI depends on redeployment.',
    );
  }

  if (robotType === 'office_cleaner' && profile.floorAreaSqM > 2000) {
    score = applyDelta(
      score,
      trace,
      'office_large_area_economic',
      -12,
      'economic',
      'Office cleaners are less economical above ~2,000 m² — consider a large scrubber.',
    );
  }

  if (robotType === 'large_scrubber') {
    if (profile.cleaningFrequencyPerDay >= 1) {
      score = applyDelta(
        score,
        trace,
        'scrubber_frequency_ok',
        10,
        'economic',
        'Daily-or-more cleaning frequency supports scrubber utilization.',
      );
    } else {
      score = applyDelta(
        score,
        trace,
        'scrubber_low_frequency',
        -15,
        'economic',
        'Large scrubbers need regular cleaning cycles to justify cost.',
      );
    }
  }

  if (robotType === 'industrial_cleaner') {
    if (profile.messLevel === 'heavy' || profile.environmentType === 'industrial') {
      score = applyDelta(
        score,
        trace,
        'industrial_economic_fit',
        12,
        'economic',
        'Industrial workloads justify heavy-duty cleaner economics.',
      );
    } else {
      score = applyDelta(
        score,
        trace,
        'industrial_overkill',
        -10,
        'economic',
        'Industrial cleaners are costly for light commercial workloads.',
      );
    }
  }

  if (profile.cleaningFrequencyPerDay < 1 && robotType !== 'office_cleaner') {
    score = applyDelta(
      score,
      trace,
      'infrequent_cleaning',
      -15,
      'economic',
      'Infrequent cleaning reduces ROI for larger autonomous systems.',
    );
  }

  return { score: clamp(score), trace };
}

function cleaningDeploymentFit(
  profile: CleaningProfile,
  robotType: CleaningRobotType,
): { score: number; trace: ReturnType<typeof createTrace> } {
  const trace = createTrace();
  let score = techReadinessScore(profile.techReadiness);

  const complexityByType: Record<CleaningRobotType, number> = {
    office_cleaner: 5,
    large_scrubber: 15,
    industrial_cleaner: 25,
  };
  const penalty = complexityByType[robotType];
  score = applyDelta(
    score,
    trace,
    'deploy_complexity',
    -penalty,
    'deployment',
    'Deployment complexity varies by robot class.',
  );

  if (profile.obstacleComplexity === 'high') {
    score = applyDelta(score, trace, 'deploy_obstacle_high', -10, 'deployment', 'High obstacles increase deployment time.');
  }
  if (profile.obstacleComplexity === 'low') {
    score = applyDelta(score, trace, 'deploy_obstacle_low', 8, 'deployment', 'Low obstacle complexity speeds deployment.');
  }

  return { score: clamp(score), trace };
}

function mergeTraces(...traces: ReturnType<typeof createTrace>[]) {
  return { hits: traces.flatMap((t) => t.hits) };
}

export function scoreCleaningRobotType(
  profile: CleaningProfile,
  robotType: CleaningRobotType,
): ScoredRobotResult {
  const useCase = cleaningUseCaseFit(profile, robotType);
  const economic = cleaningEconomicFit(profile, robotType);
  const deployment = cleaningDeploymentFit(profile, robotType);
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

export function recommendCleaningAcquisition(profile: CleaningProfile): AcquisitionModel {
  if (profile.acquisitionPreference !== 'open') {
    return profile.acquisitionPreference;
  }

  const consistentUsage =
    profile.cleaningFrequencyPerDay >= 2 &&
    profile.daysPerWeek >= 5 &&
    profile.floorAreaSqM > 1500;

  if (profile.budgetPreference === 'low_upfront') return 'raas';

  if (
    profile.budgetPreference === 'maximize_long_term_roi' &&
    consistentUsage &&
    profile.techReadiness === 'high'
  ) {
    return 'buy';
  }

  if (consistentUsage && profile.techReadiness === 'high') return 'buy';

  if (profile.cleaningFrequencyPerDay < 2 || profile.techReadiness === 'low') {
    return 'raas';
  }

  return 'lease';
}
