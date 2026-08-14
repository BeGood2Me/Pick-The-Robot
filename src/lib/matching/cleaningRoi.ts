import type {
  AcquisitionModel,
  CleaningProfile,
  CleaningRobotType,
  CleaningRoiEstimate,
  CleaningRoiViability,
  MoneyRange,
} from './types';

export type { CleaningRoiEstimate, CleaningRoiViability, MoneyRange } from './types';

const CLEANING_ROBOT_TYPES = new Set(['office_cleaner', 'large_scrubber', 'industrial_cleaner']);

export function isCleaningRobotType(type: string): type is CleaningRobotType {
  return CLEANING_ROBOT_TYPES.has(type);
}

/** Published cost bands (USD), aligned with the cleaning robot cost guide. */
export const CLEANING_COST_BANDS: Record<
  CleaningRobotType,
  {
    buyUnit: MoneyRange;
    raasMonthly: MoneyRange;
    leaseMonthly: MoneyRange;
  }
> = {
  office_cleaner: {
    buyUnit: { low: 5000, high: 20000 },
    raasMonthly: { low: 800, high: 2000 },
    leaseMonthly: { low: 400, high: 1200 },
  },
  large_scrubber: {
    buyUnit: { low: 30000, high: 80000 },
    raasMonthly: { low: 2000, high: 5000 },
    leaseMonthly: { low: 1200, high: 3500 },
  },
  industrial_cleaner: {
    buyUnit: { low: 50000, high: 120000 },
    raasMonthly: { low: 2500, high: 6000 },
    leaseMonthly: { low: 1500, high: 4000 },
  },
};

export const CLEANING_ROI_CONSTANTS = {
  coverageSqMPerOuting: {
    office_cleaner: 1000,
    large_scrubber: 2000,
    industrial_cleaner: 2500,
  } as Record<CleaningRobotType, number>,
  maxOutingsPerRobotPerDay: 2,
  manualSqMPerHour: 180,
  supervisionHoursPerRobotPerDay: 0.75,
  maxRobots: 12,
  buyAmortizationMonths: 60,
  annualServiceRate: 0.12,
  weeksPerMonth: 52 / 12,
  staffFloorShare: {
    vacuum: 0.55,
    scrub: 0.6,
    sweep: 0.55,
    combo: 0.5,
  } as Record<CleaningProfile['cleaningType'], number>,
  displaceShare: {
    low: 0.5,
    medium: 0.4,
    high: 0.3,
  } as Record<CleaningProfile['obstacleComplexity'], number>,
} as const;

function roundMoney(n: number): number {
  return Math.round(n);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function obstacleFactor(level: CleaningProfile['obstacleComplexity']): number {
  if (level === 'high') return 0.7;
  if (level === 'medium') return 0.85;
  return 1;
}

function messFactor(level: CleaningProfile['messLevel']): number {
  if (level === 'heavy') return 0.75;
  if (level === 'moderate') return 0.9;
  return 1;
}

function surfaceFactor(
  surface: CleaningProfile['floorSurface'],
  robotType: CleaningRobotType,
): number {
  if (surface === 'carpet' && robotType !== 'office_cleaner') return 0.55;
  if (surface === 'carpet') return 0.85;
  if (surface === 'mixed') return 0.9;
  return 1;
}

function effectiveCoverage(profile: CleaningProfile, robotType: CleaningRobotType): number {
  const base = CLEANING_ROI_CONSTANTS.coverageSqMPerOuting[robotType];
  return Math.max(
    200,
    base *
      obstacleFactor(profile.obstacleComplexity) *
      messFactor(profile.messLevel) *
      surfaceFactor(profile.floorSurface, robotType),
  );
}

function robotCountFor(profile: CleaningProfile, coverage: number): number {
  const area = profile.floorAreaSqM;
  const passes = profile.cleaningFrequencyPerDay;
  if (area <= 0 || passes <= 0 || coverage <= 0) return 0;
  const outings = Math.min(
    CLEANING_ROI_CONSTANTS.maxOutingsPerRobotPerDay,
    Math.max(1, passes),
  );
  return clamp(
    Math.ceil((area * passes) / (coverage * outings)),
    1,
    CLEANING_ROI_CONSTANTS.maxRobots,
  );
}

function inferredWeeklyFloorHours(profile: CleaningProfile): number {
  const dailyPasses = profile.floorAreaSqM * Math.max(profile.cleaningFrequencyPerDay, 0);
  if (dailyPasses <= 0) return 0;
  return (dailyPasses / CLEANING_ROI_CONSTANTS.manualSqMPerHour) * profile.daysPerWeek;
}

function staffWeeklyFloorHours(profile: CleaningProfile): number | null {
  if (profile.staffAssignedToCleaning <= 0) return null;
  const share = CLEANING_ROI_CONSTANTS.staffFloorShare[profile.cleaningType];
  return profile.staffAssignedToCleaning * profile.hoursPerDay * profile.daysPerWeek * share;
}

function monthlyRobotCost(
  robots: number,
  robotType: CleaningRobotType,
  acquisition: AcquisitionModel,
): MoneyRange {
  if (robots <= 0) return { low: 0, high: 0 };
  const band = CLEANING_COST_BANDS[robotType];
  if (acquisition === 'raas') {
    return {
      low: roundMoney(robots * band.raasMonthly.low),
      high: roundMoney(robots * band.raasMonthly.high),
    };
  }
  if (acquisition === 'lease') {
    return {
      low: roundMoney(robots * band.leaseMonthly.low),
      high: roundMoney(robots * band.leaseMonthly.high),
    };
  }
  const months = CLEANING_ROI_CONSTANTS.buyAmortizationMonths;
  const serviceMonthly = CLEANING_ROI_CONSTANTS.annualServiceRate / 12;
  return {
    low: roundMoney(robots * (band.buyUnit.low / months + band.buyUnit.low * serviceMonthly)),
    high: roundMoney(robots * (band.buyUnit.high / months + band.buyUnit.high * serviceMonthly)),
  };
}

function paybackForBuy(
  robots: number,
  robotType: CleaningRobotType,
  monthlyLaborSavings: number,
): MoneyRange | null {
  if (robots <= 0 || monthlyLaborSavings <= 0) return null;
  const band = CLEANING_COST_BANDS[robotType];
  const low = Math.ceil((robots * band.buyUnit.low) / monthlyLaborSavings);
  const high = Math.ceil((robots * band.buyUnit.high) / monthlyLaborSavings);
  return { low, high };
}

function viabilityFor(input: {
  robotCount: number;
  weeklyFloorHours: number;
  frequency: number;
  area: number;
  monthlyNet: MoneyRange;
  paybackMonths: MoneyRange | null;
  acquisition: AcquisitionModel;
}): CleaningRoiViability {
  if (
    input.robotCount <= 0 ||
    input.weeklyFloorHours < 4 ||
    input.frequency < 1 ||
    input.area < 400
  ) {
    return 'weak';
  }
  if (input.monthlyNet.high <= 0) return 'weak';
  if (input.monthlyNet.low > 0) {
    if (input.acquisition === 'buy') {
      return input.paybackMonths && input.paybackMonths.high <= 36 ? 'strong' : 'moderate';
    }
    return 'strong';
  }
  return 'moderate';
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUsdRange(range: MoneyRange): string {
  if (range.low === range.high) return formatUsd(range.low);
  return `${formatUsd(range.low)} to ${formatUsd(range.high)}`;
}

export function formatMonthRange(range: MoneyRange): string {
  if (range.high > 60) {
    return range.low > 60 ? 'longer than 5 years' : `${range.low} months to longer than 5 years`;
  }
  if (range.low === range.high) return `${range.low} months`;
  return `${range.low} to ${range.high} months`;
}

/**
 * Indicative cleaning labor offset from matcher inputs and published cost bands.
 * Conservative on purpose: does not eliminate headcount or invent workers' compensation dollars.
 */
export function estimateCleaningRoi(
  profile: CleaningProfile,
  robotType: CleaningRobotType,
  acquisitionModel: AcquisitionModel,
): CleaningRoiEstimate {
  const coverageSqMPerOuting = Math.round(effectiveCoverage(profile, robotType));
  const robotCount = robotCountFor(profile, coverageSqMPerOuting);
  const inferred = inferredWeeklyFloorHours(profile);
  const staffHours = staffWeeklyFloorHours(profile);
  const hoursSource: CleaningRoiEstimate['hoursSource'] = staffHours === null ? 'inferred' : 'staff';
  const weeklyFloorHours = staffHours === null ? inferred : Math.min(staffHours, inferred);

  const displaceShare = CLEANING_ROI_CONSTANTS.displaceShare[profile.obstacleComplexity];
  const supervision =
    robotCount * CLEANING_ROI_CONSTANTS.supervisionHoursPerRobotPerDay * profile.daysPerWeek;
  const weeklyHoursDisplaced = Math.max(0, weeklyFloorHours * displaceShare - supervision);

  const wageUsed = profile.cleaningLaborCostPerHour || profile.laborCostPerHour;
  const monthlyLaborSavings = roundMoney(
    weeklyHoursDisplaced * wageUsed * CLEANING_ROI_CONSTANTS.weeksPerMonth,
  );
  const robotCost = monthlyRobotCost(robotCount, robotType, acquisitionModel);
  const monthlyNet: MoneyRange = {
    low: roundMoney(monthlyLaborSavings - robotCost.high),
    high: roundMoney(monthlyLaborSavings - robotCost.low),
  };
  const paybackMonths =
    acquisitionModel === 'buy' ? paybackForBuy(robotCount, robotType, monthlyLaborSavings) : null;

  const viability = viabilityFor({
    robotCount,
    weeklyFloorHours,
    frequency: profile.cleaningFrequencyPerDay,
    area: profile.floorAreaSqM,
    monthlyNet,
    paybackMonths,
    acquisition: acquisitionModel,
  });

  const assumptions = [
    `About ${coverageSqMPerOuting.toLocaleString()} m² per outing for this robot class, after obstacle and floor adjustments.`,
    `Each robot can complete up to ${CLEANING_ROI_CONSTANTS.maxOutingsPerRobotPerDay} outings per day.`,
    hoursSource === 'staff'
      ? 'Floor hours are the lower of reported cleaning staff time (floor share only) and time inferred from area.'
      : 'No cleaning staff entered, so floor hours are inferred from area and frequency.',
    `Robots take roughly ${Math.round(displaceShare * 100)}% of floor hours. Edges, restrooms, and inspection stay with people.`,
    `Robot cost uses published ${acquisitionModel === 'raas' ? 'RaaS' : acquisitionModel} bands, not a vendor quote.`,
  ];

  const notes: string[] = [
    'Restrooms, stairs, edges, and dumping still need people. This is not a headcount elimination model.',
    'Workers compensation class can change when floor work drops, but the amount depends on your carrier. We do not estimate a dollar saving.',
  ];
  if (profile.staffingPressure === 'high') {
    notes.push('Hiring difficulty is real, but vacancy cost is not included in these dollars.');
  }
  if (monthlyNet.high <= 0) {
    notes.push(
      'On published cost bands, labor offset does not cover typical robot cost. A pilot can still make sense when you cannot staff the floor.',
    );
  }

  return {
    robotCount,
    coverageSqMPerOuting,
    weeklyFloorHours: Math.round(weeklyFloorHours * 10) / 10,
    weeklyHoursDisplaced: Math.round(weeklyHoursDisplaced * 10) / 10,
    monthlyLaborSavings,
    monthlyRobotCost: robotCost,
    monthlyNet,
    paybackMonths,
    viability,
    acquisitionModel,
    robotType,
    wageUsed,
    hoursSource,
    assumptions,
    notes,
  };
}
