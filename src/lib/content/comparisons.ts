import { DEPLOYABLE_MATCHER_HREF, DEPLOYABLE_MATCHER_LABEL } from '@/lib/content/humanoids';

export interface ComparisonPage {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  intro: string;
  matcherCategory?: 'warehouse' | 'cleaning' | 'restaurant';
  rows: { aspect: string; optionA: string; optionB: string }[];
  whenA: string[];
  whenB: string[];
  faqs: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
}

export const COMPARISONS: Record<string, ComparisonPage> = {
  'amr-vs-agv': {
    slug: 'amr-vs-agv',
    title: 'AMR vs AGV: pick the robot type first',
    h1: 'AMR vs AGV',
    metaDescription:
      'AMR vs AGV for warehouses: dynamic vs fixed paths. Choose robot type and layout fit before vendor demos — comparison table, not a spec sheet.',
    intro:
      'The core AMR vs AGV difference is navigation: AMRs (autonomous mobile robots) build and follow a map and reroute around people and obstacles, while AGVs (automated guided vehicles) stick to fixed paths — tape, reflectors, wires, or marked lanes. Layout stability and route predictability decide which fits your warehouse.',
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
        question: 'What is the difference between an AMR and an AGV?',
        answer:
          'AMRs navigate with onboard sensors and software maps, so they can change routes when the floor plan or traffic changes. AGVs follow predefined guided paths. Same job family (move materials), different flexibility and infrastructure cost.',
      },
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
      {
        question: 'Is an AMR more expensive than an AGV?',
        answer:
          'Per vehicle, AGVs can look cheaper, but fixed guides and facility work often raise total project cost. AMRs may cost more per unit or via RaaS, yet avoid guide infrastructure — compare all-in pilot cost, not sticker price alone. See the warehouse robot cost guide for typical bands.',
      },
      {
        question: 'Can AMRs and AGVs work in the same warehouse?',
        answer:
          'Yes. Many sites run AGVs on stable high-volume lanes and AMRs in dynamic pick or transport zones. Clear traffic rules and fleet ownership keep paths from conflicting.',
      },
      {
        question: 'AMR or AGV for e-commerce fulfillment?',
        answer:
          'E-commerce DCs with changing slotting and dense picks usually lean AMR or pick-assist fleets. AGVs fit better when routes stay fixed year-round. Use the best AMRs for e-commerce fulfillment page and the warehouse matcher to shortlist.',
      },
    ],
    relatedLinks: [
      { href: '/warehouse-robots', label: 'Warehouse robot matcher' },
      { href: '/best/amr/ecommerce-warehouse', label: 'Best AMRs for e-commerce fulfillment' },
      { href: '/warehouse-robot-cost', label: 'Warehouse robot cost guide' },
      { href: '/robotics-as-a-service', label: 'Robotics-as-a-Service' },
    ],
  },
  'cleaning-robot-vs-cleaning-staff': {
    slug: 'cleaning-robot-vs-cleaning-staff',
    title: 'Cleaning robot vs cleaning staff: key differences',
    h1: 'Cleaning robot vs cleaning staff',
    metaDescription:
      'Cleaning robot vs staff: robots win on large, repetitive floors; people win on detail work. Compare cost, coverage, RaaS vs hiring — plus a free buyer checklist.',
    intro:
      'The core difference: cleaning robots automate routine vacuum and scrub coverage on large, repeatable floor plates, while cleaning staff handle restrooms, edges, exceptions, and irregular tasks. Robots are not a straight headcount swap — they fit best when floors are large, cleaning is frequent, and labor is expensive or hard to hire. Use the free buyer checklist before demos, then compare fit below.',
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
        question: 'What is the difference between a cleaning robot and hiring staff?',
        answer:
          'Robots deliver scheduled, consistent floor coverage with predictable routes. Staff remain better for restrooms, detailing, furniture moves, and one-off jobs. Most sites use both: robots for open floors, people for everything else.',
      },
      {
        question: 'Will a cleaning robot replace my entire team?',
        answer:
          'Usually no. Robots handle routine floor coverage; staff still manage details, restrooms, and edge cases.',
      },
      {
        question: 'Is RaaS cheaper than hiring?',
        answer:
          'Depends on frequency, area, and local wages. Subscription cleaning robots can undercut loaded labor on large nightly routes, but not on small weekly sites. Use the matcher with your floor area and labor cost to compare fit.',
      },
      {
        question: 'When does a cleaning robot beat hiring another cleaner?',
        answer:
          'When you need more consistent coverage on large hard floors, struggle to staff nights/weekends, or labor cost per hour makes subscription or lease competitive for the square footage cleaned.',
      },
      {
        question: 'How much does a commercial cleaning robot cost?',
        answer:
          'Compact office units often start in the low five figures; mid-size scrubbers commonly run tens of thousands to buy, or monthly RaaS. See the cleaning robot cost guide for bands before vendor quotes.',
      },
      {
        question: 'Can I print the cleaning robot buyer\'s checklist?',
        answer:
          'Yes. Open the free commercial cleaning robot buyer\'s checklist, then click Print checklist — it formats a one-page summary for facilities and procurement.',
      },
    ],
    relatedLinks: [
      { href: '/resources/commercial-cleaning-robot-buyer-checklist', label: 'Cleaning robot buyer\'s checklist' },
      { href: '/cleaning-robots#matcher', label: 'Cleaning robot matcher' },
      { href: '/cleaning-robot-cost', label: 'Cleaning robot cost guide' },
      { href: '/blog/cleaning-robot-cost-2026', label: 'Cleaning robot cost (2026)' },
      { href: '/cleaning-robots-as-a-service', label: 'Cleaning RaaS guide' },
      { href: '/robot-leasing-vs-buying', label: 'Lease vs buy' },
    ],
  },
  'restaurant-robot-vs-runner': {
    slug: 'restaurant-robot-vs-runner',
    title: 'Food runner robot vs human runner: key differences',
    h1: 'Food runner robot vs runner staff',
    metaDescription:
      'Food runner robot vs human runner: robots add peak carrying capacity in open layouts; staff win in tight rooms. Compare lease vs labor and when each fits.',
    intro:
      'The core difference: a food runner robot (serving robot) adds parallel tray-carrying capacity during peak hours, while human runners handle tight aisles, guest touchpoints, and exceptions. Robots are not a full server replacement — layout, covers, and peak intensity decide which wins.',
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
        question: 'What is the difference between a food runner robot and a human runner?',
        answer:
          'Robots carry food or buss trays on mapped routes and free staff from walking. Humans still own guest interaction, exceptions, and tight dining rooms. Compare trips automated — not full FOH headcount.',
      },
      {
        question: 'What is a food runner robot?',
        answer:
          'A food runner robot is a serving robot that carries trays or plates between kitchen and dining floor. It offloads travel; staff still handle guest interaction and exceptions.',
      },
      {
        question: 'Do serving robots slow down service?',
        answer:
          'In the right layout they can speed peak turnover by offloading travel. Tight layouts may require route changes first.',
      },
      {
        question: 'Should I lease or buy a serving robot?',
        answer:
          'Most operators pilot on lease or RaaS. Buying is for proven high utilization across multiple peak periods per week. See the serving robot cost guide for typical monthly and purchase ranges.',
      },
      {
        question: 'When is a robot food runner better than hiring?',
        answer:
          'When peak covers create a travel bottleneck, aisles are wide enough, and lease cost is competitive with loaded labor for those trips — not for full server replacement in tight fine-dining rooms.',
      },
      {
        question: 'How much does a restaurant serving robot cost?',
        answer:
          'Lease and RaaS often fall around $500–$1,500/month per unit; purchase is commonly mid five figures. Confirm quotes — see the serving robot cost guide for budgeting bands.',
      },
    ],
    relatedLinks: [
      { href: '/blog/restaurant-serving-robot-cost', label: 'Serving robot cost (buy vs lease)' },
      { href: '/restaurant-robots', label: 'Restaurant robot matcher' },
      { href: '/robot-leasing-vs-buying', label: 'Lease vs buy' },
      { href: '/robotics-as-a-service', label: 'Robotics-as-a-Service' },
    ],
  },
  'humanoid-vs-amr': {
    slug: 'humanoid-vs-amr',
    title: 'Humanoid vs AMR: key differences for warehouses',
    h1: 'Humanoid vs AMR',
    metaDescription:
      'Humanoid vs AMR difference: AMRs are deployable for transport and pick-assist today; humanoids are mostly pilot-stage. Compare readiness, cost, and when not to wait.',
    intro:
      'The core humanoid vs AMR difference is readiness: AMRs (autonomous mobile robots) already move totes and assist picking in commercial fleets, while humanoid robots are mostly enterprise pilots for general manipulation. For most distribution centers with a clear transport or picking bottleneck, AMRs are the practical choice until standard humanoid buyer programs mature.',
    rows: [
      { aspect: 'Buyer readiness', optionA: 'Pilot / enterprise programs', optionB: 'Commercial fleets available' },
      { aspect: 'Primary task today', optionA: 'General manipulation (emerging)', optionB: 'Transport, pick-assist' },
      { aspect: 'Deployment timeline', optionA: 'Long co-development cycles', optionB: 'Weeks to months for pilots' },
      { aspect: 'Layout fit', optionA: 'Human-scale aisles (theory)', optionB: 'Proven in dynamic DC layouts' },
      { aspect: 'Cost predictability', optionA: 'Custom quotes, few public prices', optionB: 'RaaS and lease ranges common' },
    ],
    whenA: [
      'Enterprise pilot with vendor engineering support',
      'Varied manipulation tasks not solved by AMRs',
      'Long horizon R&D budget — not urgent throughput',
    ],
    whenB: [
      'Need automation live within one or two quarters',
      'Transport or picking is the bottleneck',
      'Want reference sites and fleet software today',
    ],
    faqs: [
      {
        question: 'What is the difference between a humanoid robot and an AMR?',
        answer:
          'AMRs specialize in autonomous transport and pick-assist with mature fleet software. Humanoids aim at human-scale general labor but today ship mainly as co-development or pilot programs — not drop-in warehouse fleets for most buyers.',
      },
      {
        question: 'Should I wait for humanoids instead of buying AMRs?',
        answer:
          'Usually no if you have a clear transport or picking problem now. AMRs are deployable; humanoids are tracked on our research hub until standard buyer programs exist.',
      },
      {
        question: 'Are humanoids cheaper than AMRs?',
        answer:
          'Public list prices for humanoids are rare and often custom. AMR purchase and RaaS bands are easier to budget. Compare total cost of a deployable AMR pilot against multi-year humanoid co-development — not sticker claims alone.',
      },
      {
        question: 'Can humanoids replace AMRs in a warehouse?',
        answer:
          'Not as a near-term swap for most sites. AMRs already own many transport and pick-assist workflows. Humanoids may complement later for manipulation tasks AMRs do not solve — after buyer programs and safety cases mature.',
      },
      {
        question: 'Are humanoids in the PickTheRobot matcher?',
        answer:
          'Not yet. We profile Figure, Apptronik, and others under Track — separate from scored matcher results.',
      },
      {
        question: 'Where can I research humanoid platforms?',
        answer:
          'See our humanoid robots hub and company profiles for readiness labels and links to official sites. For AMR vs AGV navigation trade-offs, use the AMR vs AGV guide.',
      },
    ],
    relatedLinks: [
      { href: '/humanoid-robots', label: 'Humanoid robots hub' },
      { href: '/amr-vs-agv', label: 'AMR vs AGV' },
      { href: '/humanoids/figure-ai', label: 'Figure AI profile' },
      { href: '/humanoids/tesla-optimus', label: 'Tesla Optimus profile' },
      { href: DEPLOYABLE_MATCHER_HREF, label: DEPLOYABLE_MATCHER_LABEL },
    ],
  },
};

export const DECISION_PAGES = {
  'robot-leasing-vs-buying': {
    title: 'Lease vs buy a serving robot (when each wins)',
    h1: 'Lease vs buy a robot (serving, warehouse, cleaning)',
    metaDescription:
      'Lease vs buy a serving or business robot: cost, flexibility, and when RaaS is safer for a first restaurant or warehouse pilot.',
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
        question: 'Should I buy or lease a serving robot?',
        answer:
          'Lease or RaaS for a first restaurant pilot when peak utilization is unproven. Buy after covers justify the unit across multiple busy periods. See the serving robot cost guide for typical $500–$1,500/mo and purchase bands.',
      },
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
