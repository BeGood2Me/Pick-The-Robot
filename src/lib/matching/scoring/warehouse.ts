import type { AcquisitionModel, ScoredRobotResult, WarehouseProfile, WarehouseRobotType } from '../types';
import { clamp, laborCostFactor, staffingPressureScore, techReadinessScore, withOverallMatch } from './shared';
import { applyDelta, createTrace, recordHit } from './trace';

export const WAREHOUSE_ROBOT_TYPES: WarehouseRobotType[] = [
  'amr',
  'agv',
  'picking_assist',
  'pallet_mover',
];

function warehouseUseCaseFit(
  profile: WarehouseProfile,
  robotType: WarehouseRobotType,
): { score: number; trace: ReturnType<typeof createTrace> } {
  const trace = createTrace();
  let score = 45;

  const painBoost: Partial<
    Record<WarehouseProfile['mainPainPoint'], Partial<Record<WarehouseRobotType, number>>>
  > = {
    transport: { amr: 90, agv: 70, picking_assist: 45, pallet_mover: 50 },
    picking: { picking_assist: 92, amr: 55, agv: 35, pallet_mover: 30 },
    pallet_movement: { pallet_mover: 95, agv: 80, amr: 45, picking_assist: 25 },
    inventory: { amr: 78, picking_assist: 62, agv: 40, pallet_mover: 35 },
    labor_shortage: { picking_assist: 80, amr: 75, pallet_mover: 65, agv: 55 },
  };
  const painScore = painBoost[profile.mainPainPoint]?.[robotType];
  if (painScore !== undefined) {
    const delta = painScore - score;
    score = painScore;
    recordHit(trace, {
      id: `pain_${profile.mainPainPoint}`,
      delta,
      dimension: 'useCase',
      message: `Main pain point (${profile.mainPainPoint.replace('_', ' ')}) aligns with this robot type.`,
    });
  }

  if (profile.mainPainPoint === 'inventory') {
    if (robotType === 'amr') {
      score = applyDelta(
        score,
        trace,
        'inventory_amr_cycle',
        8,
        'useCase',
        'Inventory accuracy workflows benefit from flexible AMRs for cycle counts and replenishment.',
      );
    }
    if (robotType === 'picking_assist' && profile.picksPerDay > 5000) {
      score = applyDelta(
        score,
        trace,
        'inventory_high_picks',
        15,
        'useCase',
        'High pick volume supports pick-assist for inventory-linked picking workflows.',
      );
    } else if (robotType === 'picking_assist' && profile.picksPerDay <= 5000) {
      score = applyDelta(
        score,
        trace,
        'inventory_low_picks',
        -8,
        'useCase',
        'Pick-assist is less justified for inventory pain without high pick volume.',
      );
    }
  }

  if (profile.mainPainPoint === 'transport' && profile.layoutStability === 'frequent_change') {
    if (robotType === 'amr') {
      const boosted = Math.max(score, 92);
      const delta = boosted - score;
      score = boosted;
      if (delta > 0) {
        recordHit(trace, {
          id: 'layout_frequent_amr',
          delta,
          dimension: 'useCase',
          message: 'Frequent layout changes favor AMRs over fixed-path systems.',
        });
      }
    }
    if (robotType === 'agv') {
      score = applyDelta(
        score,
        trace,
        'layout_frequent_agv_penalty',
        -25,
        'useCase',
        'AGVs struggle when routes and pick faces change often.',
      );
    }
  }

  if (profile.layoutStability === 'stable' && robotType === 'agv') {
    score = applyDelta(
      score,
      trace,
      'layout_stable_agv',
      15,
      'useCase',
      'Stable, repetitive routes are a strong fit for guided AGV systems.',
    );
  }

  if (profile.loadType === 'pallets' && robotType === 'pallet_mover') {
    score = applyDelta(score, trace, 'load_pallets_mover', 10, 'useCase', 'Pallet-heavy workflows map to dedicated pallet movers.');
  }
  if (profile.loadType === 'light_items' && robotType === 'picking_assist') {
    score = applyDelta(score, trace, 'load_light_picking', 8, 'useCase', 'Light-item workflows suit pick-assist solutions.');
  }
  if (profile.loadType === 'pallets' && robotType === 'picking_assist') {
    score = applyDelta(score, trace, 'load_pallets_picking_penalty', -20, 'useCase', 'Pick-assist is a poor fit for pallet-primary workflows.');
  }

  if (profile.picksPerDay > 8000 && robotType === 'picking_assist') {
    score = applyDelta(
      score,
      trace,
      'high_pick_volume',
      12,
      'useCase',
      `High pick volume (${profile.picksPerDay.toLocaleString()}/day) supports pick-assist ROI.`,
    );
  }
  if (profile.picksPerDay < 2000 && robotType === 'picking_assist') {
    score = applyDelta(score, trace, 'low_pick_volume', -10, 'useCase', 'Low pick volume reduces the case for pick-assist automation.');
  }

  if (profile.temperatureZone === 'cold') {
    if (robotType === 'agv' || robotType === 'pallet_mover') {
      score = applyDelta(
        score,
        trace,
        'cold_zone_penalty',
        -12,
        'useCase',
        'Cold-chain environments add complexity for guided vehicles and pallet systems.',
      );
    }
    if (robotType === 'amr') {
      score = applyDelta(
        score,
        trace,
        'cold_zone_amr',
        5,
        'useCase',
        'AMRs with cold-rated variants handle variable cold-chain layouts better.',
      );
    }
  }

  const isSmallLowVolume =
    profile.facilitySizeSqM < 3000 && profile.ordersPerDay < 500;
  if (isSmallLowVolume) {
    const complexityPenalty: Record<WarehouseRobotType, number> = {
      amr: 5,
      agv: 20,
      picking_assist: 15,
      pallet_mover: 10,
    };
    const penalty = complexityPenalty[robotType];
    score = applyDelta(
      score,
      trace,
      'small_low_volume',
      -penalty,
      'useCase',
      'Small facility with low order volume — complex robotics may have longer payback.',
    );
  }

  return { score: clamp(score), trace };
}

function warehouseDeploymentFit(
  profile: WarehouseProfile,
  robotType: WarehouseRobotType,
): { score: number; trace: ReturnType<typeof createTrace> } {
  const trace = createTrace();
  let score = techReadinessScore(profile.techReadiness);

  const wmsPenalty: Record<WarehouseProfile['wmsReadiness'], number> = {
    none: 25,
    partial: 12,
    ready: 0,
  };
  const integrationHeavy = robotType === 'picking_assist' || robotType === 'agv';
  if (integrationHeavy) {
    const penalty = wmsPenalty[profile.wmsReadiness];
    if (penalty > 0) {
      score = applyDelta(
        score,
        trace,
        'wms_penalty',
        -penalty,
        'deployment',
        `WMS readiness (${profile.wmsReadiness}) affects integration-heavy robot types.`,
      );
    }
  }

  if (profile.aisleConstraints === 'tight') {
    if (robotType === 'pallet_mover' || robotType === 'agv') {
      score = applyDelta(score, trace, 'tight_aisle_heavy', -20, 'deployment', 'Tight aisles limit pallet movers and AGVs.');
    }
    if (robotType === 'amr') {
      score = applyDelta(score, trace, 'tight_aisle_amr', -5, 'deployment', 'Tight aisles require smaller AMR form factors.');
    }
  }
  if (profile.aisleConstraints === 'wide' && robotType === 'pallet_mover') {
    score = applyDelta(score, trace, 'wide_aisle_pallet', 10, 'deployment', 'Wide aisles suit pallet mover deployments.');
  }

  return { score: clamp(score), trace };
}

function warehouseEconomicFit(
  profile: WarehouseProfile,
  robotType: WarehouseRobotType,
): { score: number; trace: ReturnType<typeof createTrace> } {
  const trace = createTrace();
  const taskIntensity =
    profile.ordersPerDay * 0.3 + profile.picksPerDay * 0.5 + profile.hoursPerDay * 5;
  const intensityFactor = clamp(40 + Math.log10(Math.max(taskIntensity, 1)) * 18);
  let score =
    laborCostFactor(profile.laborCostPerHour) * 0.4 +
    intensityFactor * 0.35 +
    staffingPressureScore(profile.staffingPressure) * 0.25;

  if ((robotType === 'agv' || robotType === 'picking_assist') && profile.ordersPerDay < 300) {
    score = applyDelta(
      score,
      trace,
      'low_order_volume_economic',
      -15,
      'economic',
      'Complex systems need higher order volume to justify economics.',
    );
  }

  if (robotType === 'pallet_mover' && profile.loadType !== 'pallets' && profile.mainPainPoint !== 'pallet_movement') {
    score = applyDelta(
      score,
      trace,
      'pallet_mover_low_throughput',
      -12,
      'economic',
      'Pallet movers need consistent pallet throughput to pay back.',
    );
  }

  return { score: clamp(score), trace };
}

function mergeTraces(...traces: ReturnType<typeof createTrace>[]): ReturnType<typeof createTrace> {
  return { hits: traces.flatMap((t) => t.hits) };
}

export function scoreWarehouseRobotType(
  profile: WarehouseProfile,
  robotType: WarehouseRobotType,
): ScoredRobotResult {
  const useCase = warehouseUseCaseFit(profile, robotType);
  const economic = warehouseEconomicFit(profile, robotType);
  const deployment = warehouseDeploymentFit(profile, robotType);
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

export function recommendWarehouseAcquisition(profile: WarehouseProfile): AcquisitionModel {
  if (profile.acquisitionPreference !== 'open') {
    return profile.acquisitionPreference;
  }

  const uncertainWorkflow =
    profile.layoutStability === 'frequent_change' || profile.wmsReadiness === 'none';
  const highUtilization =
    profile.ordersPerDay > 1500 &&
    profile.layoutStability === 'stable' &&
    profile.daysPerWeek >= 5;

  if (
    profile.budgetPreference === 'low_upfront' ||
    (profile.techReadiness === 'medium' && uncertainWorkflow)
  ) {
    return 'raas';
  }

  if (
    profile.budgetPreference === 'maximize_long_term_roi' &&
    highUtilization &&
    profile.techReadiness === 'high'
  ) {
    return 'buy';
  }

  if (profile.techReadiness === 'high' && highUtilization) {
    return 'buy';
  }

  return 'lease';
}
