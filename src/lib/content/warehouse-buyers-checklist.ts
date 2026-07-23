export interface BuyersChecklistItem {
  step: number;
  title: string;
  summary: string;
  href: string;
  linkLabel: string;
}

export const WAREHOUSE_BUYERS_CHECKLIST: BuyersChecklistItem[] = [
  {
    step: 1,
    title: 'Define the workflow problem',
    summary: 'Start from pain — transport vs picking vs pallet moves — not from a vendor catalog.',
    href: '/warehouse-robots#guide',
    linkLabel: 'Warehouse robot types guide',
  },
  {
    step: 2,
    title: 'Measure volume and floor size',
    summary: 'Orders per day, picks per day, and facility area drive ROI and fleet sizing.',
    href: '/blog/warehouse-robot-cost-2026',
    linkLabel: 'Warehouse robot cost ranges',
  },
  {
    step: 3,
    title: 'Shortlist robot types',
    summary: 'AMR, AGV, pick-assist, and pallet movers solve different layout and load profiles.',
    href: '/amr-vs-agv',
    linkLabel: 'AMR vs AGV comparison',
  },
  {
    step: 4,
    title: 'Check layout stability',
    summary: 'Changing pick paths favor AMRs; fixed pallet lanes may favor AGVs or pallet movers.',
    href: '/best/amr/ecommerce-warehouse',
    linkLabel: 'Best AMRs for e-commerce DCs',
  },
  {
    step: 5,
    title: 'Confirm WMS / integration readiness',
    summary: 'Pick-assist and fleet software need a clear WMS or middleware path before scale.',
    href: '/integrations',
    linkLabel: 'Robot integration guides',
  },
  {
    step: 6,
    title: 'Choose buy, lease, or RaaS',
    summary: 'Match acquisition model to capex appetite, utilization certainty, and pilot risk.',
    href: '/robot-leasing-vs-buying',
    linkLabel: 'Lease vs buy guide',
  },
  {
    step: 7,
    title: 'Budget beyond hardware',
    summary: 'Include mapping, charging, integration, training, and first-year software renewals.',
    href: '/warehouse-robot-cost',
    linkLabel: 'Warehouse robot cost guide',
  },
  {
    step: 8,
    title: 'Shortlist 3–5 vendors',
    summary: 'Compare vendors on the same robot type and acquisition model before demos.',
    href: '/vendors',
    linkLabel: 'Browse warehouse vendors',
  },
  {
    step: 9,
    title: 'Plan a 60–90 day pilot',
    summary: 'One workflow, measurable KPIs: travel time, picks per hour, uptime, and incident rate.',
    href: '/robotics-as-a-service',
    linkLabel: 'RaaS for lower-risk pilots',
  },
  {
    step: 10,
    title: 'Run the matcher',
    summary: 'Sanity-check fit scores and vendor matches from your operational inputs.',
    href: '/warehouse-robots#matcher',
    linkLabel: 'Warehouse matcher',
  },
];

export const VENDOR_FIRST_CALL_QUESTIONS = [
  'Which reference sites match our order volume, layout, and WMS stack?',
  'What robot type do you recommend for our primary pain point — and what would you rule out?',
  'What is the all-in first-year cost (hardware, software, integration, training)?',
  'What WMS or middleware integrations are included vs billable?',
  'What does a 60–90 day pilot include — fleet size, SLA, swap units, and success metrics?',
  'How do buy, lease, and RaaS quotes compare for our utilization profile?',
  'What aisle widths, Wi-Fi, and charging infrastructure do you require?',
  'Who owns safety sign-off, traffic rules, and operator training on our site?',
  'What uptime and response-time SLA applies after go-live?',
  'What happens at contract end — buyout, refresh, or fleet return terms?',
];

export const WAREHOUSE_ROBOT_POST_SLUG = 'how-to-buy-warehouse-robot';
