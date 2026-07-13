import type { RobotCategory } from '@/lib/matching';

export interface GuideSection {
  heading: string;
  bullets?: string[];
  paragraphs?: string[];
}

export interface GuidePageContent {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  intro: string;
  matcherCategory?: RobotCategory;
  sections: GuideSection[];
  faqs: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
}

export const GUIDE_PAGES: Record<string, GuidePageContent> = {
  'raas-pricing': {
    slug: 'raas-pricing',
    title: 'RaaS pricing for business robots',
    h1: 'RaaS pricing',
    metaDescription:
      'What does robotics-as-a-service cost for warehouse, cleaning, and restaurant robots? Typical subscription ranges and what affects RaaS pricing.',
    intro:
      'RaaS bundles hardware, software, and often maintenance into a monthly subscription. Pricing varies by robot type, utilization, and region — vendors rarely publish list prices, but ranges help you budget before talking to sales.',
    sections: [
      {
        heading: 'Warehouse AMR / pick-assist (monthly per robot)',
        bullets: [
          'Entry pilots: roughly $1,500–$3,500/month per robot',
          'Mid-size fulfillment fleets: often $2,500–$5,000/month depending on software tier',
          'Includes fleet management, updates, and sometimes on-site support',
          'Higher pick-assist utilization can justify upper range',
        ],
      },
      {
        heading: 'Commercial cleaning robots',
        bullets: [
          'Compact office units: roughly $800–$2,000/month',
          'Large autonomous scrubbers: roughly $2,000–$5,000/month',
          'Consumables (pads, solutions) may be extra',
          'Daily high-utilization sites often see better unit economics vs hiring',
        ],
      },
      {
        heading: 'Restaurant serving / bussing robots',
        bullets: [
          'Serving robots: roughly $500–$1,500/month per unit on lease or RaaS',
          'Multi-robot food halls may negotiate fleet pricing',
          'Peak-hour utilization drives ROI more than headline rate',
        ],
      },
      {
        heading: 'What changes the quote',
        bullets: [
          'Contract length (12 vs 36 months)',
          'Included service hours and swap units',
          'Software modules (WMS integration, analytics)',
          'Region, import duties, and installation scope',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is RaaS cheaper than buying?',
        answer:
          'Monthly RaaS often costs more over 3–5 years than buying, but it lowers upfront risk. It is strongest when utilization is unproven or layouts may change.',
      },
      {
        question: 'Does RaaS include maintenance?',
        answer:
          'Most RaaS contracts include maintenance and software updates. Confirm response times, spare units, and what counts as billable damage.',
      },
    ],
    relatedLinks: [
      { href: '/robotics-as-a-service', label: 'What is RaaS?' },
      { href: '/robot-leasing-vs-buying', label: 'Lease vs buy' },
      { href: '/cleaning-robots-as-a-service', label: 'Cleaning robots as a service' },
    ],
  },
  'warehouse-robot-cost': {
    slug: 'warehouse-robot-cost',
    title: 'Warehouse robot cost guide',
    h1: 'Warehouse robot cost',
    metaDescription:
      'How much do warehouse robots cost? Typical price ranges for AMRs, AGVs, pick-assist, and pallet movers — buy, lease, and RaaS.',
    intro:
      'Warehouse robot costs span a wide range by type and acquisition model. Use these benchmarks for budgeting; confirm quotes with vendors for your facility size and integration scope.',
    matcherCategory: 'warehouse',
    sections: [
      {
        heading: 'Typical capital purchase ranges (USD)',
        bullets: [
          'AMR (single unit): $25,000–$80,000+',
          'AGV / guided vehicle: $50,000–$150,000+ per vehicle',
          'Pick-assist fleet (per robot): $30,000–$70,000',
          'Autonomous forklift / pallet mover: $80,000–$200,000+',
        ],
      },
      {
        heading: 'Lease and RaaS',
        bullets: [
          'AMR RaaS: often $2,000–$5,000/month per robot',
          'Leases spread capex over 3–5 years with optional buyout',
          'Integration, mapping, and WMS work may be quoted separately',
        ],
      },
      {
        heading: 'Hidden costs to plan for',
        bullets: [
          'Facility mapping and safety review',
          'WMS / WES integration',
          'Training and change management',
          'Spare batteries and annual software fees (buy model)',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the cheapest warehouse robot to start with?',
        answer:
          'Single AMRs on RaaS are a common pilot path for transport use cases. AGVs cost more upfront but fit fixed high-volume routes.',
      },
      {
        question: 'How many robots do I need?',
        answer:
          'Depends on picks, travel distance, and shift length. The matcher gives a fleet sizing hint after you enter your operation details.',
      },
    ],
    relatedLinks: [
      { href: '/warehouse-robots', label: 'Warehouse robot matcher' },
      { href: '/amr-vs-agv', label: 'AMR vs AGV' },
      { href: '/raas-pricing', label: 'RaaS pricing' },
    ],
  },
  'cleaning-robot-cost': {
    slug: 'cleaning-robot-cost',
    title: 'Commercial cleaning robot cost guide',
    h1: 'Cleaning robot cost',
    metaDescription:
      'How much do commercial cleaning robots cost? Price ranges for office vacuums, scrubbers, and industrial cleaners — buy vs RaaS.',
    intro:
      'Cleaning robot pricing depends on floor area, frequency, and machine size. Small office units cost far less than industrial scrubbers built for daily heavy use.',
    matcherCategory: 'cleaning',
    sections: [
      {
        heading: 'Typical purchase ranges (USD)',
        bullets: [
          'Office / compact vacuum robots: $5,000–$20,000',
          'Mid-size autonomous scrubbers: $30,000–$80,000',
          'Industrial scrubbers: $50,000–$120,000+',
        ],
      },
      {
        heading: 'Subscription / RaaS',
        bullets: [
          'Office units: roughly $800–$2,000/month',
          'Large scrubbers: roughly $2,000–$5,000/month',
          'Service plans may include consumables and mapping support',
        ],
      },
      {
        heading: 'When the math works',
        bullets: [
          'Daily cleaning across 1,500+ m²',
          'Labor cost above ~$18–22/hour in your market',
          'Predictable routes with manageable obstacles',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is a cleaning robot cheaper than staff?',
        answer:
          'Not always. Robots win on large, frequent floor coverage where labor is expensive or hard to hire. Small weekly offices rarely justify capex.',
      },
      {
        question: 'Should I lease or buy a scrubber?',
        answer:
          'Lease or RaaS for first deployment; buy when daily utilization is proven across a stable footprint.',
      },
    ],
    relatedLinks: [
      { href: '/cleaning-robots', label: 'Cleaning robot matcher' },
      { href: '/cleaning-robot-vs-cleaning-staff', label: 'Robot vs cleaning staff' },
      { href: '/cleaning-robots-as-a-service', label: 'Cleaning robots as a service' },
    ],
  },
  'cleaning-robots-as-a-service': {
    slug: 'cleaning-robots-as-a-service',
    title: 'Cleaning robots as a service (RaaS)',
    h1: 'Cleaning robots as a service',
    metaDescription:
      'Robotics-as-a-service for commercial cleaning — when subscription scrubbers and vacuums beat buying, and what operators should ask vendors.',
    intro:
      'Cleaning RaaS is popular for first deployments: lower upfront cost, included maintenance, and easier pilots across one or two floors before scaling.',
    matcherCategory: 'cleaning',
    sections: [
      {
        heading: 'Good fit for cleaning RaaS',
        bullets: [
          'Piloting automation on one site or building wing',
          'Limited capex but daily cleaning need',
          'Want vendor-managed software updates and service',
          'Floor plan may change in the first year',
        ],
      },
      {
        heading: 'Ask vendors before signing',
        bullets: [
          'What floor types and obstacles are supported?',
          'Response time for breakdowns and swap units',
          'Are consumables included?',
          'Can you move the robot to another site mid-contract?',
        ],
      },
      {
        heading: 'Related pricing',
        paragraphs: [
          'See our RaaS pricing guide for typical monthly ranges by robot category.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Which cleaning vendors offer RaaS?',
        answer:
          'Several scrubber and vacuum vendors offer subscription models in the US and EU. Use the cleaning matcher to see vendors that support RaaS for your floor size.',
      },
      {
        question: 'How is cleaning RaaS different from equipment lease?',
        answer:
          'RaaS usually bundles software, updates, and service. A pure lease may be finance-only with separate maintenance contracts.',
      },
    ],
    relatedLinks: [
      { href: '/cleaning-robots', label: 'Cleaning robot matcher' },
      { href: '/raas-pricing', label: 'RaaS pricing ranges' },
      { href: '/robotics-as-a-service', label: 'General RaaS guide' },
    ],
  },
};

export const GUIDE_LINKS = Object.values(GUIDE_PAGES).map((page) => ({
  href: `/${page.slug}`,
  label: page.h1,
}));
