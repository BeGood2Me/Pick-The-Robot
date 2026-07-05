import type { RobotCategory, RobotType } from '@/lib/matching';

export interface RobotTypeInfo {
  label: string;
  bestFor: string[];
  notIdealIf: string[];
}

export const ROBOT_TYPE_INFO: Record<RobotType, RobotTypeInfo> = {
  amr: {
    label: 'AMR',
    bestFor: ['changing layouts', 'ad-hoc transport', 'mixed SKU flows'],
    notIdealIf: ['fixed heavy pallet lanes only', 'no Wi-Fi or fleet management capacity'],
  },
  agv: {
    label: 'AGV',
    bestFor: ['fixed routes', 'repetitive point-to-point moves', 'stable facility maps'],
    notIdealIf: ['frequent layout changes', 'tight aisles without guide paths'],
  },
  picking_assist: {
    label: 'Picking assist',
    bestFor: ['high pick counts', 'labor shortage in fulfillment', 'WMS-ready sites'],
    notIdealIf: ['very low pick volume', 'no WMS integration path'],
  },
  pallet_mover: {
    label: 'Pallet mover',
    bestFor: ['pallet-heavy workflows', 'dock-to-rack moves', 'wide aisles'],
    notIdealIf: ['light-item picking only', 'tight aisles'],
  },
  office_cleaner: {
    label: 'Office cleaner',
    bestFor: ['offices', 'daily light vacuuming', 'smaller floor plates'],
    notIdealIf: ['industrial debris', 'very large open retail floors'],
  },
  large_scrubber: {
    label: 'Large scrubber',
    bestFor: ['retail and commercial floors', 'combo scrub/vacuum', 'medium-large areas'],
    notIdealIf: ['tiny offices', 'once-a-week light cleaning only'],
  },
  industrial_cleaner: {
    label: 'Industrial cleaner',
    bestFor: ['factory and warehouse floors', 'heavy mess', 'rugged environments'],
    notIdealIf: ['small quiet offices', 'low deployment budget'],
  },
  serving_robot: {
    label: 'Serving robot',
    bestFor: ['food running', 'high seat turnover', 'open dining layouts'],
    notIdealIf: ['narrow fine-dining aisles', 'very low daily covers'],
  },
  bussing_robot: {
    label: 'Bussing robot',
    bestFor: ['table turnover', 'buffet bussing', 'staff shortage on floor'],
    notIdealIf: ['tight layouts', 'minimal bussing workflow'],
  },
  kitchen_automation: {
    label: 'Kitchen automation',
    bestFor: ['repetitive prep', 'QSR throughput', 'back-of-house bottlenecks'],
    notIdealIf: ['highly variable menus', 'limited kitchen space'],
  },
  reception_robot: {
    label: 'Reception robot',
    bestFor: ['guest guidance', 'seating coordination', 'lobby wayfinding'],
    notIdealIf: ['no front-of-house space', 'need full server replacement'],
  },
};

export interface CategoryPageContent {
  title: string;
  h1: string;
  intro: string;
  metaDescription: string;
  robotTypesIntro: string;
  acquisitionIntro: string;
  faqs: { question: string; answer: string }[];
}

export const CATEGORY_CONTENT: Record<RobotCategory, CategoryPageContent> = {
  warehouse: {
    title: 'Warehouse robots buying guide',
    h1: 'Warehouse robots',
    intro:
      'Match AMRs, AGVs, picking assist, and pallet movers to your facility size, workflow, and budget. Use the tool below to get a rules-based recommendation in under two minutes.',
    metaDescription:
      'Compare warehouse robots by fit, cost model, and deployment. Find AMR, AGV, picking assist, or pallet mover options for your operation.',
    robotTypesIntro:
      'Warehouse automation spans transport, picking, and pallet movement. The right type depends on layout stability, volume, and systems readiness.',
    acquisitionIntro:
      'Buying suits stable, high-utilization sites. Leasing balances flexibility and upfront cost. RaaS lowers capex and is common for pilots.',
    faqs: [
      {
        question: 'What is the best warehouse robot for a small fulfillment center?',
        answer:
          'Smaller sites with mixed totes and moderate picks often start with AMRs or pick-assist robots. Fixed-route AGVs are harder to justify unless volume is high and layouts are stable.',
      },
      {
        question: 'AMR or AGV for warehouse transport?',
        answer:
          'AMRs fit changing layouts and ad-hoc moves. AGVs fit fixed, repetitive routes. See our AMR vs AGV comparison for a detailed breakdown.',
      },
      {
        question: 'Is robotics-as-a-service available for warehouse robots?',
        answer:
          'Many vendors offer subscription or RaaS models, especially for AMRs and pick-assist fleets. It is a common entry path when upfront budget is limited.',
      },
    ],
  },
  cleaning: {
    title: 'Commercial cleaning robots guide',
    h1: 'Cleaning robots',
    intro:
      'Find office, commercial scrubber, or industrial cleaning robots based on floor area, mess level, and cleaning frequency. Automatic matching — no sales call required.',
    metaDescription:
      'Compare commercial cleaning robots for offices, retail, and industrial floors. Match scrubber or vacuum robots to your facility and budget.',
    robotTypesIntro:
      'Cleaning robots range from compact office units to large scrubbers and industrial machines. Floor area and obstacle density drive the fit.',
    acquisitionIntro:
      'RaaS and lease models are common for first deployments. Buying can make sense when cleaning runs daily across a large, stable footprint.',
    faqs: [
      {
        question: 'Are cleaning robots worth it vs hiring staff?',
        answer:
          'They are strongest when labor is expensive, cleaning is frequent, and floor area is large enough to keep units utilized. See our robot vs staff comparison.',
      },
      {
        question: 'What size floor needs a large scrubber robot?',
        answer:
          'Roughly 2,000 m² and above with regular scrubbing needs often favors larger autonomous scrubbers over compact office units.',
      },
      {
        question: 'Can cleaning robots handle obstacles?',
        answer:
          'Capability varies by model. High obstacle environments need stronger navigation and may take longer to map and deploy.',
      },
    ],
  },
  restaurant: {
    title: 'Restaurant robots buying guide',
    h1: 'Restaurant robots',
    intro:
      'Match serving, bussing, kitchen, or reception robots to your venue type, volume, and layout. Get buy, lease, or RaaS guidance and vendor options.',
    metaDescription:
      'Compare restaurant robots for serving, bussing, kitchen automation, and guest guidance. Find the right fit for QSR, full service, and food halls.',
    robotTypesIntro:
      'Front-of-house robots handle running and bussing. Kitchen automation targets prep bottlenecks. Reception robots help with guest flow.',
    acquisitionIntro:
      'Restaurants often pilot on lease or RaaS before buying. High-utilization QSR sites with stable layouts are better buy candidates.',
    faqs: [
      {
        question: 'Do serving robots work in fine dining?',
        answer:
          'Tight layouts and narrow aisles make floor robots harder. Open QSR and food hall formats are usually a better fit.',
      },
      {
        question: 'Serving robot or extra runner staff?',
        answer:
          'Robots help when peak hours are intense and running is repetitive. Low cover counts or tight aisles reduce the economic case.',
      },
      {
        question: 'What is the typical upfront cost model for restaurant robots?',
        answer:
          'Lease and RaaS are common for trials. Buying is usually considered after proving utilization across peak periods.',
      },
    ],
  },
};
