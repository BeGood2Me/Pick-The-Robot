import type { RobotCategory } from '@/lib/matching';

/** Snippet-sized definitions — keep wording identical wherever reused (AEO). */
export interface CanonicalDefinition {
  id: string;
  term: string;
  answer: string;
}

export const ROBOT_TYPE_BEFORE_VENDOR: CanonicalDefinition = {
  id: 'robot-type-before-vendor',
  term: 'Why choose robot type before vendor brand?',
  answer:
    'Warehouse, cleaning, and restaurant robots are different categories with different layout, labor, and integration needs. Shortlisting vendors before confirming robot type leads to polished demos for the wrong workflow. Define the pain point and robot class first, then compare three to five vendors on the same type and acquisition model.',
};

export const BUY_LEASE_RAAS: CanonicalDefinition = {
  id: 'buy-lease-raas',
  term: 'When should you buy, lease, or use RaaS?',
  answer:
    'Buy when utilization is stable and you want the lowest long-term cost of ownership. Lease spreads capex when you need flexibility without full subscription pricing. RaaS (robotics-as-a-service) lowers upfront cash and is common for first pilots when daily utilization is unproven. Compare quotes on the same utilization assumptions — not sticker price alone.',
};

export const PICKTHEROBOT_RULES_BASED: CanonicalDefinition = {
  id: 'picktherobot-rules-based',
  term: 'How does PickTheRobot recommend robots?',
  answer:
    'PickTheRobot is a free, rules-based buyer-side matcher — not machine learning. You answer operational questions; each robot type gets use-case, economic, and deployment fit scores. Vendors rank against your top robot type and acquisition model. Sponsored listings are disclosed and receive a small boost only when already a reasonable fit. See the methodology page for weights and limits.',
};

export const AMR_DEFINITION: CanonicalDefinition = {
  id: 'amr',
  term: 'What is an AMR (autonomous mobile robot)?',
  answer:
    'An AMR (autonomous mobile robot) navigates with onboard sensors and a software map. It can reroute around people and obstacles and adapt when pick paths or staging zones change. AMRs fit dynamic transport, mixed tasks, and warehouses where layouts change frequently. They are less ideal when only fixed, heavy pallet lanes need automation.',
};

export const AGV_DEFINITION: CanonicalDefinition = {
  id: 'agv',
  term: 'What is an AGV (automated guided vehicle)?',
  answer:
    'An AGV (automated guided vehicle) follows fixed paths — tape, reflectors, wires, or marked lanes — rather than building a dynamic map. AGVs fit repetitive point-to-point moves on stable routes. They are often harder to justify when layouts change often or when flexible rerouting matters more than guide-path simplicity.',
};

export const PICK_ASSIST_DEFINITION: CanonicalDefinition = {
  id: 'picking-assist',
  term: 'What is warehouse pick-assist?',
  answer:
    'Pick-assist robots help human pickers by reducing walking — carts or units that follow pickers or meet them at pick faces. They fit high pick volume and labor pressure in fulfillment when a WMS or middleware path exists. Low pick counts or no integration path make pick-assist harder to justify.',
};

export const PALLET_MOVER_DEFINITION: CanonicalDefinition = {
  id: 'pallet-mover',
  term: 'What is a warehouse pallet mover robot?',
  answer:
    'A pallet mover robot automates dedicated pallet transport — often autonomous forklifts or pallet AMRs on fixed or semi-fixed lanes. They fit pallet-heavy workflows with wide aisles and stable dock-to-rack moves. They are a poor match when the primary pain is light-item picking or frequently changing pick paths.',
};

export const CLEANING_ROBOT_VS_STAFF: CanonicalDefinition = {
  id: 'cleaning-robot-vs-staff',
  term: 'Is a commercial cleaning robot a replacement for staff?',
  answer:
    'Usually no. Commercial cleaning robots are strongest on large, hard-floor plates with daily, repeatable vacuum or scrub routes. Staff still handle restrooms, detailing, furniture moves, and exceptions. Most sites use a hybrid model — robots on open floors, people on everything else.',
};

export const COMMERCIAL_CLEANING_ROBOT: CanonicalDefinition = {
  id: 'commercial-cleaning-robot',
  term: 'What is a commercial cleaning robot?',
  answer:
    'A commercial cleaning robot autonomously vacuums, scrubs, or sweeps large floor areas on scheduled routes. Classes range from compact office units to large scrubbers and industrial machines. Fit depends on floor area, cleaning frequency, obstacle density, and surface type — not headline price alone.',
};

export const SERVING_ROBOT_DEFINITION: CanonicalDefinition = {
  id: 'serving-robot',
  term: 'What is a restaurant serving robot?',
  answer:
    'A restaurant serving robot (food runner robot) carries trays or plates between kitchen and dining floor on mapped routes. It adds parallel carrying capacity during peak hours; it is not a full server replacement. Open aisles and high peak covers improve fit; narrow fine-dining layouts often reduce it.',
};

export const FOOD_RUNNER_VS_STAFF: CanonicalDefinition = {
  id: 'food-runner-vs-staff',
  term: 'When is a food runner robot better than extra staff?',
  answer:
    'A food runner robot helps when peak covers create a travel bottleneck, aisles are wide enough for mapped routes, and lease cost compares to loaded labor for those trips. It is weaker when daily volume is low, aisles are tight, or the goal is full table service rather than offloading kitchen-to-table travel.',
};

const WAREHOUSE_DEFINITIONS: CanonicalDefinition[] = [
  ROBOT_TYPE_BEFORE_VENDOR,
  AMR_DEFINITION,
  AGV_DEFINITION,
  PICK_ASSIST_DEFINITION,
  PALLET_MOVER_DEFINITION,
  BUY_LEASE_RAAS,
];

const CLEANING_DEFINITIONS: CanonicalDefinition[] = [
  COMMERCIAL_CLEANING_ROBOT,
  CLEANING_ROBOT_VS_STAFF,
  BUY_LEASE_RAAS,
];

const RESTAURANT_DEFINITIONS: CanonicalDefinition[] = [
  SERVING_ROBOT_DEFINITION,
  FOOD_RUNNER_VS_STAFF,
  BUY_LEASE_RAAS,
];

export const DEFINITIONS_BY_CATEGORY: Record<RobotCategory, CanonicalDefinition[]> = {
  warehouse: WAREHOUSE_DEFINITIONS,
  cleaning: CLEANING_DEFINITIONS,
  restaurant: RESTAURANT_DEFINITIONS,
};

const ALL_DEFINITIONS: CanonicalDefinition[] = [
  ...WAREHOUSE_DEFINITIONS,
  ...CLEANING_DEFINITIONS,
  ...RESTAURANT_DEFINITIONS,
  PICKTHEROBOT_RULES_BASED,
];

const BY_ID = new Map(ALL_DEFINITIONS.map((d) => [d.id, d]));

export function getCategoryDefinitions(category: RobotCategory): CanonicalDefinition[] {
  return DEFINITIONS_BY_CATEGORY[category];
}

export function getDefinitionsById(ids: string[]): CanonicalDefinition[] {
  return ids.map((id) => BY_ID.get(id)).filter((d): d is CanonicalDefinition => d !== undefined);
}

/** AMR vs AGV comparison page — core type definitions only. */
export const AMR_VS_AGV_DEFINITION_IDS = ['amr', 'agv', 'robot-type-before-vendor'] as const;

/** Comparison slug → canonical definition ids for repeated snippet blocks. */
export const COMPARISON_DEFINITION_IDS: Record<string, readonly string[]> = {
  'amr-vs-agv': AMR_VS_AGV_DEFINITION_IDS,
  'cleaning-robot-vs-cleaning-staff': ['commercial-cleaning-robot', 'cleaning-robot-vs-staff'],
  'restaurant-robot-vs-runner': ['serving-robot', 'food-runner-vs-staff'],
};
