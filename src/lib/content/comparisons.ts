export interface ComparisonPage {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  intro: string;
  matcherCategory: 'warehouse' | 'cleaning' | 'restaurant';
  rows: { aspect: string; optionA: string; optionB: string }[];
  whenA: string[];
  whenB: string[];
  faqs: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
}

export const COMPARISONS: Record<string, ComparisonPage> = {
  'amr-vs-agv': {
    slug: 'amr-vs-agv',
    title: 'AMR vs AGV for warehouses',
    h1: 'AMR vs AGV',
    metaDescription:
      'Compare autonomous mobile robots (AMRs) and automated guided vehicles (AGVs) for warehouse transport — layout, cost, and deployment differences.',
    intro:
      'Both move materials autonomously, but AMRs navigate dynamically while AGVs follow fixed paths. Your layout stability and route predictability determine which is the better fit.',
    matcherCategory: 'warehouse',
    rows: [
      { aspect: 'Navigation', optionA: 'Dynamic, map-based', optionB: 'Fixed paths or guides' },
      { aspect: 'Layout changes', optionA: 'Easier to adapt', optionB: 'Costly to change' },
      { aspect: 'Best workflow', optionA: 'Ad-hoc transport, mixed tasks', optionB: 'Repetitive point-to-point' },
      { aspect: 'Typical deployment', optionA: 'Faster pilot, fleet software', optionB: 'Engineering-heavy install' },
      { aspect: 'Upfront cost', optionA: 'Varies; RaaS common', optionB: 'Often higher capex' },
    ],
    whenA: ['Layouts change frequently', 'Transport is the bottleneck', 'You need flexible rerouting'],
    whenB: ['Routes are fixed and repetitive', 'Heavy pallet moves on stable paths', 'Manufacturing line feed'],
    faqs: [
      {
        question: 'Can an AMR replace an AGV?',
        answer:
          'Sometimes for transport use cases, but not when you need heavy guided pallet lines with minimal software overhead. Match the tool to route predictability.',
      },
      {
        question: 'Which is easier to deploy?',
        answer:
          'AMRs often pilot faster in existing warehouses. AGVs need path design and infrastructure planning.',
      },
    ],
    relatedLinks: [
      { href: '/warehouse-robots', label: 'Warehouse robot matcher' },
      { href: '/robotics-as-a-service', label: 'Robotics-as-a-Service' },
    ],
  },
  'cleaning-robot-vs-cleaning-staff': {
    slug: 'cleaning-robot-vs-cleaning-staff',
    title: "Commercial cleaning robot buyer's checklist + vs staff",
    h1: 'Cleaning robot buyer\'s checklist',
    metaDescription:
      'Free cleaning robot buyer\'s checklist: floor area, robot vs staff, cost ranges, RaaS, and vendor questions — plus robot vs hiring comparison.',
    intro:
      'Use the checklist below before vendor demos — then compare robots and cleaning staff on cost, coverage, and deployment. Robots are not a straight headcount swap; they work best when floors are large, cleaning is frequent, and labor is expensive or hard to hire.',
    matcherCategory: 'cleaning',
    rows: [
      { aspect: 'Upfront cost', optionA: 'Robot capex or subscription', optionB: 'Recruiting + wages' },
      { aspect: 'Consistency', optionA: 'Scheduled, repeatable routes', optionB: 'Varies by shift' },
      { aspect: 'Flexibility', optionA: 'Fixed floor types', optionB: 'Handles odd tasks' },
      { aspect: 'Best scale', optionA: 'Large daily floor area', optionB: 'Small or irregular sites' },
      { aspect: 'Night/weekend', optionA: 'Runs without staffing gaps', optionB: 'Needs shift coverage' },
    ],
    whenA: ['Daily cleaning across 1,500+ m²', 'High labor cost', 'Repetitive vacuum/scrub routes'],
    whenB: ['Small offices cleaned weekly', 'Many one-off tasks', 'Very cluttered floors without mapping'],
    faqs: [
      {
        question: 'Will a cleaning robot replace my entire team?',
        answer:
          'Usually no. Robots handle routine floor coverage; staff still manage details, restrooms, and edge cases.',
      },
      {
        question: 'Is RaaS cheaper than hiring?',
        answer:
          'Depends on frequency, area, and local wages. Use the matcher with your floor area and labor cost to compare fit.',
      },
      {
        question: 'Can I print the cleaning robot buyer\'s checklist?',
        answer:
          'Yes. Click Print checklist (PDF) at the top of the checklist section — it formats a one-page summary for facilities and procurement.',
      },
    ],
    relatedLinks: [
      { href: '/cleaning-robots#matcher', label: 'Cleaning robot matcher' },
      { href: '/cleaning-robot-cost', label: 'Cleaning robot cost guide' },
      { href: '/blog/cleaning-robot-cost-2026', label: 'Cleaning robot cost (2026)' },
      { href: '/cleaning-robots-as-a-service', label: 'Cleaning RaaS guide' },
      { href: '/robot-leasing-vs-buying', label: 'Lease vs buy' },
    ],
  },
  'restaurant-robot-vs-runner': {
    slug: 'restaurant-robot-vs-runner',
    title: 'Restaurant serving robot vs runner',
    h1: 'Restaurant robot vs runner',
    metaDescription:
      'Compare serving robots and human runners for restaurants — volume, layout, peak hours, and acquisition models.',
    intro:
      'Serving robots reduce server travel during peak periods. They are not a universal replacement for runners — layout, covers, and peak intensity matter.',
    matcherCategory: 'restaurant',
    rows: [
      { aspect: 'Peak capacity', optionA: 'Adds parallel running capacity', optionB: 'Limited by staff count' },
      { aspect: 'Layout', optionA: 'Needs workable aisles', optionB: 'Handles tight spaces better' },
      { aspect: 'Guest interaction', optionA: 'Minimal', optionB: 'Full service touchpoints' },
      { aspect: 'Cost model', optionA: 'Lease/RaaS common', optionB: 'Hourly labor' },
      { aspect: 'Best venue', optionA: 'QSR, buffet, food hall', optionB: 'Fine dining, small rooms' },
    ],
    whenA: ['High covers during peak', 'Open layout', 'Food running is the bottleneck'],
    whenB: ['Low daily volume', 'Narrow aisles', 'Guest experience requires human touch'],
    faqs: [
      {
        question: 'Do serving robots slow down service?',
        answer:
          'In the right layout they can speed peak turnover by offloading travel. Tight layouts may require route changes first.',
      },
      {
        question: 'Should I lease or buy a serving robot?',
        answer:
          'Most operators pilot on lease or RaaS. Buying is for proven high utilization across multiple peak periods per week.',
      },
    ],
    relatedLinks: [
      { href: '/restaurant-robots', label: 'Restaurant robot matcher' },
      { href: '/robotics-as-a-service', label: 'Robotics-as-a-Service' },
    ],
  },
};

export const DECISION_PAGES = {
  'robot-leasing-vs-buying': {
    title: 'Robot leasing vs buying',
    h1: 'Robot leasing vs buying',
    metaDescription:
      'Should you lease or buy a business robot? Compare upfront cost, flexibility, utilization, and when each model makes sense.',
    intro:
      'Leasing spreads cost and often includes maintenance. Buying maximizes long-term control when utilization is proven. Neither is universally better.',
    sections: [
      {
        heading: 'When leasing makes sense',
        bullets: [
          'Low upfront budget or CFO prefers opex',
          'Piloting automation for the first time',
          'Uncertain utilization over the next 12–24 months',
          'Vendor bundles service and upgrades',
        ],
      },
      {
        heading: 'When buying makes sense',
        bullets: [
          'High, stable daily utilization',
          'Internal team can operate and maintain fleet',
          'Maximizing long-term ROI is the priority',
          'Multi-year deployment is already approved',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is leasing always more expensive long term?',
        answer:
          'Often yes on pure cost, but leasing can be cheaper than a failed buy if utilization is lower than expected.',
      },
      {
        question: 'Can I switch from lease to buy?',
        answer:
          'Some vendors offer buyout options. Confirm contract terms before piloting.',
      },
    ],
  },
  'robotics-as-a-service': {
    title: 'Robotics-as-a-Service (RaaS) for businesses',
    h1: 'Robotics-as-a-Service (RaaS)',
    metaDescription:
      'What is robotics-as-a-service? How RaaS pricing works for warehouse, cleaning, and restaurant robots — and when it is a good fit.',
    intro:
      'RaaS bundles hardware, software, and often maintenance into a subscription. It lowers upfront risk and is common for first deployments.',
    sections: [
      {
        heading: 'Good fit if',
        bullets: [
          'You want low upfront cost',
          'You are testing automation in one site',
          'Tech readiness is medium or low',
          'Workflow may change in the first year',
        ],
      },
      {
        heading: 'Harder if',
        bullets: [
          'You need full asset ownership for accounting',
          'Utilization is already very high and stable',
          'Vendor RaaS is not available in your region',
        ],
      },
    ],
    faqs: [
      {
        question: 'How is RaaS different from leasing?',
        answer:
          'RaaS usually includes software, updates, and service in one subscription. Leases may be finance-only with separate service contracts.',
      },
      {
        question: 'Which robot categories offer RaaS?',
        answer:
          'Common for AMRs, cleaning robots, and restaurant serving robots. Availability varies by vendor and region.',
      },
    ],
  },
} as const;
