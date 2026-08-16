import type { BuyersChecklistItem } from '@/lib/content/buyers-checklist-types';
import type { FaqItem } from '@/lib/seo/schema';

export type { BuyersChecklistItem };

export const RESTAURANT_BUYERS_CHECKLIST_PATH = '/resources/restaurant-robot-buyer-checklist';

export const RESTAURANT_BUYERS_CHECKLIST_META = {
  title: 'Restaurant robot buyer\'s checklist',
  description:
    'Free 10-step checklist for restaurant operators before serving, bussing, or kitchen robot demos — covers, layout, peak hours, lease vs buy, and vendor questions.',
} as const;

export const RESTAURANT_BUYERS_CHECKLIST_LAST_UPDATED = 'August 2026';

export const RESTAURANT_BUYERS_CHECKLIST_WHEN_TO_USE = [
  'Before scheduling vendor demos or comparing lease quotes',
  'When food running, bussing, or kitchen throughput is the bottleneck — not full server replacement',
  'When evaluating buy, lease, or RaaS for a first front-of-house pilot',
] as const;

export const RESTAURANT_BUYERS_CHECKLIST_LIMITATIONS = [
  'Health department rules, fire egress, and local labor agreements for your venue',
  'Guest experience standards that require human touch at every table',
  'Vendor-specific SLAs, payload limits, and route constraints — validate in writing on every deal',
] as const;

export const RESTAURANT_BUYERS_CHECKLIST_FAQS: FaqItem[] = [
  {
    question: 'When is a restaurant serving robot worth it?',
    answer:
      'Often when peak covers create a food-running bottleneck, aisles are wide enough for mapped routes, and lease cost compares to loaded labor for those trips. Tight fine-dining rooms may still fit staff better until layout changes.',
  },
  {
    question: 'Do serving robots replace servers?',
    answer:
      'Usually no. Serving and bussing robots offload travel between kitchen and dining floor. Staff still handle guest interaction, exceptions, and tight table service.',
  },
  {
    question: 'Should I lease or buy a restaurant robot?',
    answer:
      'Lease or RaaS is common for first pilots when peak utilization is unproven. Purchase can win after covers and routes are proven across multiple busy periods — compare both with the same utilization assumptions.',
  },
  {
    question: 'How much does a restaurant serving robot cost?',
    answer:
      'Lease and RaaS often fall around $500–$1,500/month per unit; purchase is commonly mid five figures. See the serving robot cost guide for budgeting bands, then confirm quotes for your venue.',
  },
];

export const RESTAURANT_BUYERS_CHECKLIST_RELATED_LINKS = [
  { href: '/restaurant-robots', label: 'Restaurant robots hub' },
  { href: '/restaurant-robot-vs-runner', label: 'Food runner robot vs staff' },
  { href: '/blog/restaurant-serving-robot-cost', label: 'Serving robot cost guide' },
  { href: '/robot-leasing-vs-buying', label: 'Lease vs buy guide' },
  { href: '/robotics-as-a-service', label: 'Robotics-as-a-Service (RaaS)' },
  { href: '/restaurant-robots#matcher', label: 'Restaurant matcher' },
] as const;

export const RESTAURANT_BUYERS_CHECKLIST: BuyersChecklistItem[] = [
  {
    step: 1,
    title: 'Define the front-of-house problem',
    summary: 'Food running vs bussing vs kitchen bottleneck vs guest guidance — not “we need a robot.”',
    href: '/restaurant-robots#guide',
    linkLabel: 'Restaurant robot types guide',
  },
  {
    step: 2,
    title: 'Measure covers and peak intensity',
    summary: 'Daily covers and peak service hours drive whether a robot adds capacity or sits idle.',
    href: '/blog/restaurant-serving-robot-cost',
    linkLabel: 'Serving robot cost ranges',
  },
  {
    step: 3,
    title: 'Check aisle width and layout',
    summary: 'Open dining rooms map more easily; narrow fine-dining paths need a site walk before shortlisting.',
    href: '/best/serving_robot/full-service-restaurant',
    linkLabel: 'Best serving robots for full-service dining',
  },
  {
    step: 4,
    title: 'Shortlist robot types',
    summary: 'Serving, bussing, kitchen automation, and reception robots solve different workflows.',
    href: '/restaurant-robot-vs-runner',
    linkLabel: 'Food runner robot vs staff',
  },
  {
    step: 5,
    title: 'Robot vs staff vs hybrid',
    summary: 'Robots add peak carrying capacity; staff still own guest touchpoints and exceptions.',
    href: '/restaurant-robot-vs-runner',
    linkLabel: 'Runner comparison guide',
  },
  {
    step: 6,
    title: 'Choose buy, lease, or RaaS',
    summary: 'Match acquisition model to cash flow, pilot risk, and how proven your peak routes are.',
    href: '/robot-leasing-vs-buying',
    linkLabel: 'Lease vs buy guide',
  },
  {
    step: 7,
    title: 'Budget beyond the monthly fee',
    summary: 'Include mapping, charging space, floor markers, training, and first-year software renewals.',
    href: '/blog/restaurant-serving-robot-cost',
    linkLabel: 'Serving robot cost guide',
  },
  {
    step: 8,
    title: 'Shortlist 3–5 vendors',
    summary: 'Compare vendors on the same robot class and acquisition model before scheduling demos.',
    href: '/vendors',
    linkLabel: 'Browse restaurant vendors',
  },
  {
    step: 9,
    title: 'Plan a peak-shift pilot',
    summary: 'One busy daypart, measurable KPIs: trips per hour, table turnover, uptime, and guest feedback.',
    href: '/robotics-as-a-service',
    linkLabel: 'RaaS for lower-risk pilots',
  },
  {
    step: 10,
    title: 'Run the matcher',
    summary: 'Sanity-check fit scores and vendor matches from your venue inputs.',
    href: '/restaurant-robots#matcher',
    linkLabel: 'Restaurant matcher',
  },
];

export const RESTAURANT_VENDOR_FIRST_CALL_QUESTIONS = [
  'Which reference venues match our covers, venue type, and aisle layout?',
  'What robot type do you recommend for our primary pain point — and what would you rule out?',
  'What is the all-in first-year cost (hardware, software, training, and support)?',
  'What aisle width, slopes, and obstacles are supported or excluded?',
  'How long does initial mapping take, and what happens when we rearrange tables?',
  'What does a peak-shift pilot include — unit count, SLA, swap units, and success metrics?',
  'How do buy, lease, and RaaS quotes compare at our expected utilization?',
  'Who loads trays, handles exceptions, and trains floor staff on your system?',
  'What uptime and on-site response SLA applies during service hours?',
  'What happens at contract end — buyout, refresh, or return terms?',
];

export const RESTAURANT_CHECKLIST_COMPARISON_SLUG = 'restaurant-robot-vs-runner';
