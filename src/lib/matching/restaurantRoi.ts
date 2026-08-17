import type {
  AcquisitionModel,
  MoneyRange,
  RestaurantProfile,
  RestaurantRobotType,
  RoiEstimate,
  RoiModelKind,
} from './types';
import {
  clamp,
  monthlyRobotCostFromBands,
  paybackForBuy,
  roundMoney,
  viabilityFromNet,
} from './roiShared';

export type { RoiEstimate } from './types';

const RESTAURANT_ROBOT_TYPES = new Set([
  'serving_robot',
  'bussing_robot',
  'kitchen_automation',
  'reception_robot',
]);

export function isRestaurantRobotType(type: string): type is RestaurantRobotType {
  return RESTAURANT_ROBOT_TYPES.has(type);
}

/** Published cost bands (USD), aligned with restaurant cost content. */
export const RESTAURANT_COST_BANDS: Record<
  RestaurantRobotType,
  {
    buyUnit: MoneyRange;
    raasMonthly: MoneyRange;
    leaseMonthly: MoneyRange;
  }
> = {
  serving_robot: {
    buyUnit: { low: 15000, high: 40000 },
    raasMonthly: { low: 500, high: 1500 },
    leaseMonthly: { low: 400, high: 1200 },
  },
  bussing_robot: {
    buyUnit: { low: 15000, high: 35000 },
    raasMonthly: { low: 500, high: 1400 },
    leaseMonthly: { low: 400, high: 1100 },
  },
  kitchen_automation: {
    buyUnit: { low: 50000, high: 200000 },
    raasMonthly: { low: 3000, high: 8000 },
    leaseMonthly: { low: 2000, high: 6000 },
  },
  reception_robot: {
    buyUnit: { low: 10000, high: 30000 },
    raasMonthly: { low: 400, high: 1200 },
    leaseMonthly: { low: 300, high: 900 },
  },
};

export const RESTAURANT_ROI_CONSTANTS = {
  peakCoverShare: 0.6,
  minutesPerCover: {
    serving_robot: 3.5,
    bussing_robot: 3,
    kitchen_automation: 0,
    reception_robot: 2,
  } as Record<RestaurantRobotType, number>,
  displaceShare: {
    serving_robot: 0.45,
    bussing_robot: 0.5,
    kitchen_automation: 0.25,
    reception_robot: 0.35,
  } as Record<RestaurantRobotType, number>,
  supervisionHoursPerUnitPerPeakDay: 0.35,
  coversPerUnitPerHour: 50,
  maxUnits: 6,
  weeksPerMonth: 52 / 12,
  buyAmortizationMonths: 60,
  annualServiceRate: 0.12,
} as const;

function layoutFactor(profile: RestaurantProfile): number {
  if (profile.layoutComplexity === 'tight' || profile.aisleWidth === 'narrow') return 1.15;
  if (profile.layoutComplexity === 'open' && profile.aisleWidth === 'wide') return 0.9;
  return 1;
}

function peakCoversPerHour(profile: RestaurantProfile): number {
  const peakCovers =
    profile.seatsPerDay * RESTAURANT_ROI_CONSTANTS.peakCoverShare / Math.max(profile.peakHoursPerDay, 1);
  return Math.max(1, Math.round(peakCovers));
}

function unitCountFor(profile: RestaurantProfile, peakCoversPerHour: number): number {
  const needed = Math.ceil(peakCoversPerHour / RESTAURANT_ROI_CONSTANTS.coversPerUnitPerHour);
  return clamp(needed, 1, RESTAURANT_ROI_CONSTANTS.maxUnits);
}

function modelKindFor(robotType: RestaurantRobotType): RoiModelKind {
  if (robotType === 'kitchen_automation') return 'throughput';
  if (robotType === 'reception_robot') return 'guest_service';
  return 'peak_labor_offset';
}

function weeklyPeakRunnerHours(profile: RestaurantProfile, robotType: RestaurantRobotType): number {
  const minutesPerCover = RESTAURANT_ROI_CONSTANTS.minutesPerCover[robotType];
  if (minutesPerCover <= 0) return 0;
  const coversPerHour = peakCoversPerHour(profile);
  const hoursPerPeakDay = (coversPerHour * minutesPerCover) / 60 * profile.peakHoursPerDay;
  return hoursPerPeakDay * profile.daysPerWeek * layoutFactor(profile);
}

function kitchenThroughputHours(profile: RestaurantProfile): number {
  const coversPerHour = profile.seatsPerDay / Math.max(profile.hoursPerDay, 1);
  const upliftShare = 0.12;
  const manualCoversPerHour = 40;
  const extraCoversPerHour = coversPerHour * upliftShare;
  const hoursPerDay = extraCoversPerHour / manualCoversPerHour;
  return hoursPerDay * profile.daysPerWeek;
}

/**
 * Indicative front-of-house labor offset from peak-hour runner work and published cost bands.
 * Conservative: peak hours only, partial trip displacement, no tip or guest-experience dollars.
 */
export function estimateRestaurantRoi(
  profile: RestaurantProfile,
  robotType: RestaurantRobotType,
  acquisitionModel: AcquisitionModel,
): RoiEstimate {
  const modelKind = modelKindFor(robotType);
  const coversPerHour = peakCoversPerHour(profile);
  const unitCount = unitCountFor(profile, coversPerHour);
  const wageUsed = profile.laborCostPerHour;

  let weeklyActivityHours = weeklyPeakRunnerHours(profile, robotType);
  if (modelKind === 'throughput') {
    weeklyActivityHours = kitchenThroughputHours(profile);
  }

  const displaceShare = RESTAURANT_ROI_CONSTANTS.displaceShare[robotType];
  const supervision =
    unitCount *
    RESTAURANT_ROI_CONSTANTS.supervisionHoursPerUnitPerPeakDay *
    profile.peakHoursPerDay *
    profile.daysPerWeek;
  const weeklyHoursDisplaced = Math.max(0, weeklyActivityHours * displaceShare - supervision);

  const monthlyLaborSavings = roundMoney(
    weeklyHoursDisplaced * wageUsed * RESTAURANT_ROI_CONSTANTS.weeksPerMonth,
  );
  const band = RESTAURANT_COST_BANDS[robotType];
  const robotCost = monthlyRobotCostFromBands(
    unitCount,
    band,
    acquisitionModel,
    RESTAURANT_ROI_CONSTANTS.buyAmortizationMonths,
    RESTAURANT_ROI_CONSTANTS.annualServiceRate,
  );
  const monthlyNet: MoneyRange = {
    low: roundMoney(monthlyLaborSavings - robotCost.high),
    high: roundMoney(monthlyLaborSavings - robotCost.low),
  };
  const paybackMonths =
    acquisitionModel === 'buy' ? paybackForBuy(unitCount, band.buyUnit, monthlyLaborSavings) : null;

  const weakCase =
    profile.seatsPerDay < 80 ||
    profile.peakHoursPerDay < 1 ||
    weeklyActivityHours < 3 ||
    (modelKind === 'peak_labor_offset' && coversPerHour < 25);

  const viability = viabilityFromNet({
    monthlyNet,
    paybackMonths,
    acquisition: acquisitionModel,
    weakCase,
  });

  const assumptions = [
    `About ${Math.round(RESTAURANT_ROI_CONSTANTS.peakCoverShare * 100)}% of daily covers assumed during ${profile.peakHoursPerDay} peak hour(s).`,
    `Peak load modeled at ~${coversPerHour} covers/hour.`,
    modelKind === 'throughput'
      ? 'Kitchen throughput uplift uses a conservative ~12% effective capacity gain on one bottleneck station.'
      : `Runner minutes per cover scaled for layout (${Math.round(layoutFactor(profile) * 100)}% of baseline).`,
    `Robots displace roughly ${Math.round(displaceShare * 100)}% of modeled hours. Loading, guest interaction, and off-peak trips stay with staff.`,
    `Robot cost uses published ${acquisitionModel === 'raas' ? 'RaaS' : acquisitionModel} bands, not a vendor quote.`,
  ];

  const notes: string[] = [
    'This models peak-hour runner or bussing work only — not full-shift labor replacement.',
    'Tip pools, guest experience, and brand lift are not converted to dollars here.',
  ];

  if (modelKind === 'throughput') {
    notes.push(
      'Kitchen automation ROI is station-specific. Treat these numbers as a budgeting sketch — validate output per hour with the vendor.',
    );
  }
  if (modelKind === 'guest_service') {
    notes.push(
      'Reception robots mainly offset greeting and wayfinding time. Dollar value varies by venue — confirm staffing impact on site.',
    );
  }
  if (profile.staffingPressure === 'high') {
    notes.push('Hiring difficulty is real, but vacancy cost is not included in these dollars.');
  }
  if (monthlyNet.high <= 0) {
    notes.push(
      'On published cost bands, labor offset does not cover typical robot cost. A pilot can still make sense when peak staffing is the bottleneck.',
    );
  }

  return {
    unitCount,
    unitLabel: modelKind === 'throughput' ? 'stations' : 'units',
    weeklyActivityHours: Math.round(weeklyActivityHours * 10) / 10,
    activityHoursLabel:
      modelKind === 'throughput' ? 'Throughput hours modeled' : 'Peak runner hours modeled',
    weeklyHoursDisplaced: Math.round(weeklyHoursDisplaced * 10) / 10,
    displacedHoursLabel: 'Hours robots could take',
    monthlyLaborSavings,
    monthlyRobotCost: robotCost,
    monthlyNet,
    paybackMonths,
    viability,
    acquisitionModel,
    robotType,
    wageUsed,
    modelKind,
    assumptions,
    notes,
    costGuideHref: '/blog/restaurant-serving-robot-cost',
    categoryLabel: 'Restaurant labor offset',
    secondaryStat:
      modelKind === 'peak_labor_offset'
        ? {
            label: 'Peak covers / hour',
            value: `${coversPerHour}`,
            hint: `About ${unitCount} ${unitCount === 1 ? 'unit' : 'units'} for this peak load.`,
          }
        : undefined,
  };
}
