import type { FaqItem } from '@/lib/seo/schema';

export const HOME_HUB_PATH = '/home-robots';
export const ROBOT_VACUUMS_PATH = '/robot-vacuums';
export const ROBOT_VACUUMS_RESULTS_PATH = '/robot-vacuums/results';
export const BUSINESS_HUB_PATH = '/business';

export const HOME_HUB_META = {
  title: 'Home robots: vacuums and more',
  h1: 'Find a home robot',
  description:
    'Pick a home robot category — robot vacuums today, more home robot types later. Each category has its own matcher and catalog.',
} as const;

export const HOME_HUB_FAQS: FaqItem[] = [
  {
    question: 'What home robot types do you support?',
    answer:
      'Robot vacuums and vac+mop combos are live now. Other home categories (for example humanoids) will get their own matchers as we add them — not mixed into one wizard.',
  },
  {
    question: 'Is this the business robot matcher?',
    answer:
      'No. Warehouse, commercial cleaning, and restaurant robots are on the business track with a separate vendor catalog.',
  },
];

export const HOME_VACUUM_AFFILIATE_DISCLOSURE =
  'Some product links are affiliate links. We may earn a commission if you buy through them, at no extra cost to you. Rankings are rules-based from your answers and public specs — not lab tests or paid placement.';

export const ROBOT_VACUUMS_META = {
  title: 'Robot vacuum matcher: pets, floors & budget',
  h1: 'Find a robot vacuum',
  description:
    'Free rules-based robot vacuum matcher. Answer questions about floors, pets, mopping, and budget — get ranked models from public specs, not lab tests.',
} as const;

export const ROBOT_VACUUMS_INTRO =
  'Match a robot vacuum (or vac+mop combo) to your floors, pets, and budget. Scoring uses public specs — we are not RTINGS or Vacuum Wars. Confirm price and features on the retailer or manufacturer page before you buy.';

export const BUSINESS_HUB_META = {
  title: 'Business robots: warehouse, cleaning & restaurant',
  h1: 'Business robots',
  description:
    'Rules-based matcher for warehouse AMRs, commercial cleaning robots, and restaurant serving robots — robot type, buy vs lease vs RaaS, and vendor shortlist.',
} as const;

export const CLASS_LABELS = {
  vacuum_only: 'Vacuum-only robot',
  mop_vac_combo: 'Vacuum + mop combo',
} as const;

export const BUDGET_LANE_LABELS = {
  budget: 'Budget lane',
  mid: 'Mid-range lane',
  premium: 'Premium lane',
} as const;

export const PRICE_BAND_LABELS = {
  under_300: 'Under $300',
  '300_600': '$300–$600',
  '600_1000': '$600–$1,000',
  over_1000: 'Over $1,000',
} as const;

export const ROBOT_VACUUMS_FAQS: FaqItem[] = [
  {
    question: 'Is this based on hands-on vacuum tests?',
    answer:
      'No. We score models from your answers and publicly listed specs (mopping, self-empty, pet-hair claims, obstacle avoidance class). Use it to shortlist — then verify reviews, firmware, and current pricing.',
  },
  {
    question: 'Do you earn money from robot vacuum links?',
    answer:
      'Sometimes. Retailer or manufacturer links may be affiliates. That does not change the score. A higher-commission product cannot outrank a better fit.',
  },
  {
    question: 'I need a commercial floor scrubber, not a Roomba.',
    answer:
      'Use the business track: commercial cleaning robots are scored separately for offices, retail, and industrial floors.',
  },
  {
    question: 'How often is the model list updated?',
    answer:
      'The catalog is a short list of widely sold current models, not every SKU on Amazon. Names and street prices change — treat prices as indicative.',
  },
];

export const BUSINESS_HUB_FAQS: FaqItem[] = [
  {
    question: 'Is this for home robot vacuums?',
    answer:
      'No — this hub is warehouse, commercial cleaning, and restaurant robots. Home robot vacuums have a separate matcher.',
  },
  {
    question: 'Do I need an account?',
    answer: 'No. The business matcher runs in your browser and can share results via a URL.',
  },
];
