import type { BuyersChecklistItem } from '@/lib/content/buyers-checklist-types';
import type { FaqItem } from '@/lib/seo/schema';

export const CLEANING_BUYERS_CHECKLIST_PATH = '/resources/commercial-cleaning-robot-buyer-checklist';

export const CLEANING_BUYERS_CHECKLIST_META = {
  title: 'Commercial cleaning robot buyer\'s checklist',
  description:
    'Free 10-step checklist for facilities and procurement teams before autonomous scrubber or vacuum demos — floor area, labor cost, RaaS vs buy, and vendor questions.',
} as const;

export const CLEANING_BUYERS_CHECKLIST_LAST_UPDATED = 'July 2026';

export const CLEANING_BUYERS_CHECKLIST_WHEN_TO_USE = [
  'Before scheduling vendor demos or sending an RFP',
  'When comparing robot vs staff or a hybrid model',
  'When evaluating buy, lease, or cleaning RaaS for a first pilot',
] as const;

export const CLEANING_BUYERS_CHECKLIST_LIMITATIONS = [
  'Site-specific safety certification, union agreements, and local labor rules',
  'Detailed installation quotes and electrical or water hookup work',
  'Vendor-specific SLAs — use the first-call questions as a starting point, then validate in writing',
] as const;

export const CLEANING_BUYERS_CHECKLIST_FAQS: FaqItem[] = [
  {
    question: 'When is a commercial cleaning robot worth it?',
    answer:
      'Often when you clean large floor areas daily, labor is expensive or hard to hire, and routes are repetitive. Small offices cleaned weekly may still fit staff better until scale grows.',
  },
  {
    question: 'Scrubber vs vacuum for offices?',
    answer:
      'Hard floors with daily soil usually favor scrubbers or scrub-vac combos; carpet-heavy sites may start with autonomous vacuums. Match robot class to surface types before comparing vendors.',
  },
  {
    question: 'How much does commercial cleaning automation cost?',
    answer:
      'Hardware, subscriptions, and consumables vary by floor area and utilization. See our cleaning robot cost guide for typical ranges, then validate quotes for your site.',
  },
  {
    question: 'Is RaaS better for a first pilot?',
    answer:
      'RaaS or lease often lowers upfront risk when utilization is unproven. Purchase can win on high daily use over several years — compare both with the same utilization assumptions.',
  },
];

export const CLEANING_BUYERS_CHECKLIST_RELATED_LINKS = [
  { href: '/cleaning-robots', label: 'Cleaning robots hub' },
  { href: '/cleaning-robot-vs-cleaning-staff', label: 'Cleaning robot vs staff' },
  { href: '/cleaning-robot-cost', label: 'Cleaning robot cost guide' },
  { href: '/cleaning-robots-as-a-service', label: 'Cleaning RaaS guide' },
  { href: '/?category=cleaning#matcher', label: 'Cleaning matcher' },
] as const;

export const CLEANING_BUYERS_CHECKLIST: BuyersChecklistItem[] = [
  {
    step: 1,
    title: 'Measure floor area and cleaning frequency',
    summary: 'Daily m²/sq ft cleaned and shifts per week drive robot ROI more than headline price.',
    href: '/blog/cleaning-robot-cost-2026',
    linkLabel: 'Cleaning robot cost ranges',
  },
  {
    step: 2,
    title: 'Robot vs staff vs hybrid',
    summary: 'Robots cover routine floor passes; staff still handle restrooms, detailing, and exceptions.',
    href: '/cleaning-robot-vs-cleaning-staff',
    linkLabel: 'Cleaning robot vs staff comparison',
  },
  {
    step: 3,
    title: 'Pick the robot type',
    summary: 'Office vacuums, large scrubbers, and industrial units fit different floor plates and soil levels.',
    href: '/cleaning-robots',
    linkLabel: 'Cleaning robot types guide',
  },
  {
    step: 4,
    title: 'Check layout and mapping fit',
    summary: 'Open aisles after hours map easily; cluttered or frequently rearranged floors need a remapping plan.',
    href: '/best/office_cleaner/office-retail-floors',
    linkLabel: 'Best robots for office & retail floors',
  },
  {
    step: 5,
    title: 'Compare loaded labor cost',
    summary: 'Use your local wage, hours on floors, and hiring difficulty — not vendor ROI slides alone.',
    href: '/cleaning-robot-cost',
    linkLabel: 'Cleaning robot cost guide',
  },
  {
    step: 6,
    title: 'Hardware vs fleet software',
    summary: 'PickTheRobot helps you choose robots — fleet dashboards and CMMS are separate vendor decisions.',
    href: '/cleaning-robots',
    linkLabel: 'Cleaning robots hub',
  },
  {
    step: 7,
    title: 'Choose buy, lease, or RaaS',
    summary: 'Subscriptions lower pilot risk; purchase can win on high daily utilization over several years.',
    href: '/cleaning-robots-as-a-service',
    linkLabel: 'Cleaning robots as a service',
  },
  {
    step: 8,
    title: 'Budget consumables and support',
    summary: 'Pads, solutions, mapping updates, and response-time SLAs belong in year-one cost.',
    href: '/raas-pricing',
    linkLabel: 'RaaS pricing guide',
  },
  {
    step: 9,
    title: 'Shortlist 3–5 vendors',
    summary: 'Compare vendors on the same robot class and acquisition model before scheduling demos.',
    href: '/vendors',
    linkLabel: 'Browse cleaning vendors',
  },
  {
    step: 10,
    title: 'Run the matcher',
    summary: 'Score fit from your floor size, labor cost, and budget preference — then validate with vendors.',
    href: '/?category=cleaning#matcher',
    linkLabel: 'Cleaning matcher',
  },
];

export const CLEANING_VENDOR_FIRST_CALL_QUESTIONS = [
  'Which reference sites match our floor area, surface types, and cleaning frequency?',
  'What robot type do you recommend — and what would you rule out for our layout?',
  'What is the all-in first-year cost (machine, software, consumables, training)?',
  'How long does initial mapping take, and what triggers a remap?',
  'What floor types, slopes, and obstacles are supported or excluded?',
  'Can the robot run during our after-hours window without staff supervision?',
  'How do buy, lease, and RaaS quotes compare at our expected utilization?',
  'What fleet software is included vs optional — and is it required for operation?',
  'What uptime, swap-unit, and on-site response SLA applies?',
  'Who handles pads, solutions, and routine maintenance — us or the vendor?',
];

export const CLEANING_CHECKLIST_COMPARISON_SLUG = 'cleaning-robot-vs-cleaning-staff';
