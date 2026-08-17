import type {
  AcquisitionModel,
  MoneyRange,
  WarehouseProfile,
  WarehouseRobotType,
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

const WAREHOUSE_ROBOT_TYPES = new Set(['amr', 'agv', 'picking_assist', 'pallet_mover']);

export function isWarehouseRobotType(type: string): type is WarehouseRobotType {
  return WAREHOUSE_ROBOT_TYPES.has(type);
}

/** Published cost bands (USD), aligned with warehouse cost content. */
export const WAREHOUSE_COST_BANDS: Record<
  WarehouseRobotType,
  {
    buyUnit: MoneyRange;
    raasMonthly: MoneyRange;
    leaseMonthly: MoneyRange;
  }
> = {
  amr: {
    buyUnit: { low: 25000, high: 80000 },
    raasMonthly: { low: 2000, high: 5000 },
    leaseMonthly: { low: 1500, high: 4000 },
  },
  agv: {
    buyUnit: { low: 50000, high: 150000 },
    raasMonthly: { low: 3500, high: 7000 },
    leaseMonthly: { low: 2500, high: 5500 },
  },
  picking_assist: {
    buyUnit: { low: 30000, high: 70000 },
    raasMonthly: { low: 2000, high: 5000 },
    leaseMonthly: { low: 1500, high: 4000 },
  },
  pallet_mover: {
    buyUnit: { low: 40000, high: 120000 },
    raasMonthly: { low: 2500, high: 6000 },
    leaseMonthly: { low: 2000, high: 5000 },
  },
};

export const WAREHOUSE_ROI_CONSTANTS = {
  manualPicksPerHour: 80,
  assistedPicksPerHour: 100,
  minutesPerPalletMove: 10,
  palletDisplacementShare: 0.45,
  supervisionHoursPerRobotPerDay: 0.5,
  maxRobots: 15,
  weeksPerMonth: 52 / 12,
  buyAmortizationMonths: 60,
  annualServiceRate: 0.12,
  minOrdersPerDay: 200,
  minPicksPerDay: 800,
  minPalletMovesPerDay: 30,
  minMinutesPerOrder: 4,
  maxFteEquivalent: {
    transport: 6,
    throughput: 8,
    pallet: 4,
  },
  transportDisplacementShare: {
    amr: 0.55,
    agv: 0.5,
    picking_assist: 0,
    pallet_mover: 0,
  } as Record<WarehouseRobotType, number>,
} as const;

function minutesPerOrderManual(profile: WarehouseProfile): number {
  let minutes = 5;
  if (profile.facilitySizeSqM > 10000) minutes = 7;
  else if (profile.facilitySizeSqM > 5000) minutes = 6;
  if (profile.aisleConstraints === 'tight') minutes *= 1.1;
  return minutes;
}

function transportPainShare(profile: WarehouseProfile): number {
  if (profile.mainPainPoint === 'transport') return 1;
  if (profile.mainPainPoint === 'labor_shortage') return 0.55;
  if (profile.mainPainPoint === 'inventory') return 0.35;
  return 0.15;
}

function palletMovesPerDay(profile: WarehouseProfile): number {
  if (profile.loadType === 'pallets') return Math.max(1, Math.round(profile.ordersPerDay / 2));
  if (profile.loadType === 'mixed_totes') return Math.max(1, Math.round(profile.ordersPerDay / 4));
  return Math.max(1, Math.round(profile.ordersPerDay / 10));
}

function robotCountFor(profile: WarehouseProfile, robotType: WarehouseRobotType): number {
  if (robotType === 'picking_assist') {
    return clamp(Math.ceil(profile.picksPerDay / 800), 3, WAREHOUSE_ROI_CONSTANTS.maxRobots);
  }
  if (robotType === 'pallet_mover') {
    return clamp(Math.ceil(palletMovesPerDay(profile) / 40), 1, 4);
  }
  if (profile.facilitySizeSqM < 3000) {
    return clamp(Math.ceil(profile.ordersPerDay / 500), 1, 2);
  }
  if (profile.ordersPerDay < 800) {
    return clamp(Math.ceil(profile.ordersPerDay / 350), 2, 3);
  }
  return clamp(Math.ceil(profile.ordersPerDay / 250), 3, 8);
}

function modelKindFor(robotType: WarehouseRobotType): RoiModelKind {
  if (robotType === 'picking_assist') return 'throughput';
  if (robotType === 'pallet_mover') return 'pallet_moves';
  return 'transport_labor_offset';
}

function capWeeklyHours(profile: WarehouseProfile, hours: number, maxFte: number): number {
  const cap = profile.hoursPerDay * profile.daysPerWeek * maxFte;
  return Math.min(hours, cap);
}

function weeklyActivityHours(
  profile: WarehouseProfile,
  robotType: WarehouseRobotType,
): number {
  if (robotType === 'picking_assist') {
    const uplift =
      WAREHOUSE_ROI_CONSTANTS.assistedPicksPerHour / WAREHOUSE_ROI_CONSTANTS.manualPicksPerHour - 1;
    const extraPicksPerDay = profile.picksPerDay * uplift;
    const hoursPerDay = extraPicksPerDay / WAREHOUSE_ROI_CONSTANTS.manualPicksPerHour;
    return capWeeklyHours(
      profile,
      hoursPerDay * profile.daysPerWeek,
      WAREHOUSE_ROI_CONSTANTS.maxFteEquivalent.throughput,
    );
  }
  if (robotType === 'pallet_mover') {
    const moves = palletMovesPerDay(profile);
    const hoursPerDay =
      (moves * WAREHOUSE_ROI_CONSTANTS.minutesPerPalletMove) / 60;
    return capWeeklyHours(
      profile,
      hoursPerDay * profile.daysPerWeek,
      WAREHOUSE_ROI_CONSTANTS.maxFteEquivalent.pallet,
    );
  }
  const minutes = minutesPerOrderManual(profile);
  const hoursPerDay =
    (profile.ordersPerDay * minutes * transportPainShare(profile)) / 60;
  return capWeeklyHours(
    profile,
    hoursPerDay * profile.daysPerWeek,
    WAREHOUSE_ROI_CONSTANTS.maxFteEquivalent.transport,
  );
}

function displacementShare(profile: WarehouseProfile, robotType: WarehouseRobotType): number {
  if (robotType === 'picking_assist') return 0.85;
  if (robotType === 'pallet_mover') return WAREHOUSE_ROI_CONSTANTS.palletDisplacementShare;
  let share = WAREHOUSE_ROI_CONSTANTS.transportDisplacementShare[robotType];
  if (profile.layoutStability === 'frequent_change' && robotType === 'amr') share *= 0.9;
  if (profile.wmsReadiness === 'none') share *= 0.85;
  return share;
}

function isWeakCase(
  profile: WarehouseProfile,
  robotType: WarehouseRobotType,
  weeklyActivityHours: number,
): boolean {
  if (robotType === 'picking_assist') {
    return profile.picksPerDay < WAREHOUSE_ROI_CONSTANTS.minPicksPerDay || weeklyActivityHours < 4;
  }
  if (robotType === 'pallet_mover') {
    return palletMovesPerDay(profile) < WAREHOUSE_ROI_CONSTANTS.minPalletMovesPerDay;
  }
  const trivialRoute =
    profile.facilitySizeSqM < 2000 &&
    profile.ordersPerDay < 400 &&
    minutesPerOrderManual(profile) < WAREHOUSE_ROI_CONSTANTS.minMinutesPerOrder;
  return profile.ordersPerDay < WAREHOUSE_ROI_CONSTANTS.minOrdersPerDay || trivialRoute;
}

/**
 * Indicative warehouse labor offset from volume, workflow type, and published cost bands.
 * Conservative: partial displacement, supervision time, no integration or infrastructure dollars.
 */
export function estimateWarehouseRoi(
  profile: WarehouseProfile,
  robotType: WarehouseRobotType,
  acquisitionModel: AcquisitionModel,
): RoiEstimate {
  const modelKind = modelKindFor(robotType);
  const robotCount = robotCountFor(profile, robotType);
  const wageUsed = profile.laborCostPerHour;
  const activityHours = weeklyActivityHours(profile, robotType);
  const displaceShare = displacementShare(profile, robotType);
  const supervision =
    robotCount * WAREHOUSE_ROI_CONSTANTS.supervisionHoursPerRobotPerDay * profile.daysPerWeek;
  const weeklyHoursDisplaced = Math.max(0, activityHours * displaceShare - supervision);

  const monthlyLaborSavings = roundMoney(
    weeklyHoursDisplaced * wageUsed * WAREHOUSE_ROI_CONSTANTS.weeksPerMonth,
  );
  const band = WAREHOUSE_COST_BANDS[robotType];
  const robotCost = monthlyRobotCostFromBands(
    robotCount,
    band,
    acquisitionModel,
    WAREHOUSE_ROI_CONSTANTS.buyAmortizationMonths,
    WAREHOUSE_ROI_CONSTANTS.annualServiceRate,
  );
  const monthlyNet: MoneyRange = {
    low: roundMoney(monthlyLaborSavings - robotCost.high),
    high: roundMoney(monthlyLaborSavings - robotCost.low),
  };
  const paybackMonths =
    acquisitionModel === 'buy' ? paybackForBuy(robotCount, band.buyUnit, monthlyLaborSavings) : null;

  const weakCase = isWeakCase(profile, robotType, activityHours);
  const viability = viabilityFromNet({
    monthlyNet,
    paybackMonths,
    acquisition: acquisitionModel,
    weakCase,
  });

  const activityLabel =
    modelKind === 'throughput'
      ? 'Productivity hours modeled'
      : modelKind === 'pallet_moves'
        ? 'Pallet-move hours modeled'
        : 'Transport hours modeled';

  const assumptions = [
    modelKind === 'throughput'
      ? `Pick-assist uplift modeled at ~${Math.round(
          (WAREHOUSE_ROI_CONSTANTS.assistedPicksPerHour / WAREHOUSE_ROI_CONSTANTS.manualPicksPerHour -
            1) *
            100,
        )}% vs ${WAREHOUSE_ROI_CONSTANTS.manualPicksPerHour} manual picks/hour.`
      : modelKind === 'pallet_moves'
        ? `About ${palletMovesPerDay(profile)} pallet moves/day from order volume and load type.`
        : `About ${minutesPerOrderManual(profile)} min/order internal transport, scaled by workflow share (${Math.round(
            transportPainShare(profile) * 100,
          )}%).`,
    'Modeled labor hours are capped at a conservative full-time equivalent — not sequential minutes stacked as one worker.',
    `Robots displace roughly ${Math.round(displaceShare * 100)}% of modeled hours after supervision.`,
    'Integration, mapping, WMS work, and AGV infrastructure are not included in robot cost.',
    `Robot cost uses published ${acquisitionModel === 'raas' ? 'RaaS' : acquisitionModel} bands, not a vendor quote.`,
  ];

  const notes: string[] = [
    'This is a labor-offset sketch — not a throughput guarantee or headcount reduction plan.',
    'WMS integration, safety review, and facility changes are often quoted separately from the robot.',
  ];

  if (robotType === 'agv') {
    notes.push(
      'AGV projects often add guide paths, charging layout, and civil work. Those costs are not in this model.',
    );
  }
  if (profile.wmsReadiness === 'none') {
    notes.push('Low WMS readiness reduces realized displacement — confirm integration scope before budgeting.');
  }
  if (weakCase && modelKind === 'transport_labor_offset') {
    notes.push(
      'Low volume or short internal routes rarely justify transport automation alone — validate that moves are high-volume and meaningful.',
    );
  }
  if (profile.staffingPressure === 'high') {
    notes.push('Hiring difficulty is real, but vacancy cost is not included in these dollars.');
  }
  if (monthlyNet.high <= 0) {
    notes.push(
      'On published cost bands, labor offset does not cover typical robot cost. A pilot can still make sense when labor is the constraint.',
    );
  }

  return {
    unitCount: robotCount,
    unitLabel: robotType === 'picking_assist' ? 'units' : 'robots',
    weeklyActivityHours: Math.round(activityHours * 10) / 10,
    activityHoursLabel: activityLabel,
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
    costGuideHref: '/warehouse-robot-cost',
    categoryLabel: 'Warehouse labor offset',
    secondaryStat:
      modelKind === 'pallet_moves'
        ? {
            label: 'Pallet moves / day',
            value: `${palletMovesPerDay(profile)}`,
            hint: `${robotCount} ${robotCount === 1 ? 'robot' : 'robots'} for this load.`,
          }
        : modelKind === 'throughput'
          ? {
              label: 'Picks / day',
              value: profile.picksPerDay.toLocaleString(),
              hint: `${robotCount} pick-assist units in this model.`,
            }
          : {
              label: 'Orders / day',
              value: profile.ordersPerDay.toLocaleString(),
              hint: `${robotCount} ${robotCount === 1 ? 'robot' : 'robots'} for transport coverage.`,
            },
  };
}
