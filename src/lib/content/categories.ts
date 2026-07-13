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
  howToChoose: { heading: string; paragraphs: string[] };
  priceRanges: { heading: string; items: { label: string; range: string; note: string }[] };
  deploymentTimeline: { heading: string; steps: string[] };
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
    howToChoose: {
      heading: 'How to choose a warehouse robot',
      paragraphs: [
        'Start with your primary pain point — transport, picking, or pallet movement — not the robot brand. Layout stability matters: frequent layout changes favor AMRs; fixed routes favor AGVs.',
        'Check WMS readiness and aisle constraints before shortlisting vendors. Cold-chain sites need cold-rated hardware and more deployment planning.',
        'Match acquisition model to utilization certainty: RaaS or lease for pilots, buy when daily volume is proven across shifts.',
      ],
    },
    priceRanges: {
      heading: 'Typical cost ranges (USD, indicative)',
      items: [
        { label: 'AMR (purchase)', range: '$25k–$80k+', note: 'Per robot; software tiers vary' },
        { label: 'AMR (RaaS)', range: '$2k–$5k/mo', note: 'Per robot, often includes support' },
        { label: 'AGV / pallet systems', range: '$50k–$200k+', note: 'Higher integration cost' },
      ],
    },
    deploymentTimeline: {
      heading: 'Typical deployment timeline',
      steps: [
        'Weeks 1–2: Site assessment, safety review, vendor shortlist',
        'Weeks 3–6: Mapping, pilot route design, WMS integration scoping',
        'Weeks 6–12: Pilot fleet live, operator training, KPI baseline',
        'Month 3+: Scale fleet if utilization and ROI targets are met',
      ],
    },
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
    howToChoose: {
      heading: 'How to choose a cleaning robot',
      paragraphs: [
        'Floor area and cleaning frequency drive the fit more than brand. Large daily scrubbing favors autonomous scrubbers; smaller offices may only need compact vacuums.',
        'Obstacle density affects mapping time and reliability — cluttered retail floors need stronger navigation than open warehouses.',
        'Compare subscription vs purchase using your labor cost per hour and hours spent on floors, not just robot sticker price.',
      ],
    },
    priceRanges: {
      heading: 'Typical cost ranges (USD, indicative)',
      items: [
        { label: 'Office vacuum robot', range: '$5k–$20k', note: 'Purchase; smaller footprint' },
        { label: 'Commercial scrubber', range: '$30k–$80k', note: 'Purchase; mid-large sites' },
        { label: 'Cleaning RaaS', range: '$800–$5k/mo', note: 'Depends on machine size' },
      ],
    },
    deploymentTimeline: {
      heading: 'Typical deployment timeline',
      steps: [
        'Week 1: Floor survey, obstacle audit, vendor demo on-site',
        'Weeks 2–3: Mapping and route programming',
        'Week 4: Staff training and parallel run with existing cleaning',
        'Month 2+: Optimize routes and expand coverage if utilization is high',
      ],
    },
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
    howToChoose: {
      heading: 'How to choose a restaurant robot',
      paragraphs: [
        'Match robot type to workflow: serving robots for food running, bussing robots for turnover, kitchen automation for prep bottlenecks.',
        'Peak covers per day and aisle width matter more than total seat count — narrow fine-dining layouts often block floor robots.',
        'Pilot during your busiest service period. If the robot cannot keep pace at peak, utilization will not justify the contract.',
      ],
    },
    priceRanges: {
      heading: 'Typical cost ranges (USD, indicative)',
      items: [
        { label: 'Serving robot (lease/RaaS)', range: '$500–$1.5k/mo', note: 'Per unit, region varies' },
        { label: 'Serving robot (purchase)', range: '$15k–$40k', note: 'Per unit; support plans extra' },
        { label: 'Kitchen automation', range: '$50k–$200k+', note: 'Highly workflow-dependent' },
      ],
    },
    deploymentTimeline: {
      heading: 'Typical deployment timeline',
      steps: [
        'Week 1: Layout review, aisle measurements, peak-hour workflow map',
        'Weeks 2–3: On-site mapping and staff training',
        'Week 4: Soft launch during off-peak, then peak-hour trial',
        'Month 2+: Expand units or adjust routes based on turnover data',
      ],
    },
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
