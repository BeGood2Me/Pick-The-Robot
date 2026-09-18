import { BUSINESS_HUB_PATH, HOME_HUB_PATH } from '@/lib/content/home-vacuums';

export const HOME_TRACKS_HREF = '/#tracks';

export const HOME_HERO = {
  h1: 'Pick a robot for home or for work',
  subhead:
    'Two equal tracks. Home robots (vacuums first, more categories later) and business robots (warehouse, commercial cleaning, restaurant) — each with its own matcher.',
  proof: 'Rules-based scoring. No black-box AI. Under two minutes.',
} as const;

export const HOME_TRACKS = [
  {
    id: 'home',
    eyebrow: 'Home',
    title: 'Find a home robot',
    body: 'Robot vacuums today — humanoids and other home categories later. Pick a type, then get ranked models from public specs.',
    href: HOME_HUB_PATH,
    cta: 'Start home matcher',
  },
  {
    id: 'business',
    eyebrow: 'Business',
    title: 'Find a business robot',
    body: 'Warehouse AMRs, commercial cleaning robots, or restaurant serving robots — robot type, buy vs lease vs RaaS, ranked vendors.',
    href: `${BUSINESS_HUB_PATH}#matcher`,
    cta: 'Start business matcher',
  },
] as const;

/** Static hero preview — illustrative output, not a live match. */
export const HOME_HERO_PREVIEW = {
  scenario: 'Mixed floors · dogs · mop wanted',
  bestMatch: {
    label: 'Roborock Qrevo S',
    acquisition: 'Vac + mop combo',
    fit: 86,
    reasons: ['Spinning mop for hard floors', 'Self-empty dock in a mid budget'],
  },
  vendors: [
    { name: 'Roborock Qrevo S', fit: 86 },
    { name: 'eufy X10 Pro Omni', fit: 81 },
    { name: 'Dreame L10s Ultra', fit: 78 },
  ],
  disclaimer: 'Example home-vacuum output — your match depends on your answers.',
} as const;

export const HOME_BENEFITS = [
  {
    title: 'Two jobs, two matchers',
    body: 'Home robots and business robots are scored separately so a Roomba never ranks next to a warehouse AMR.',
  },
  {
    title: 'Shortlist from your constraints',
    body: 'Floors, pets, and budget at home. Facility size, labor, and acquisition model at work.',
  },
  {
    title: 'See why it ranked',
    body: 'Rules and public specs, with why / why-not notes. Affiliate and sponsored links are disclosed.',
  },
] as const;

export const HOME_HOW_IT_WORKS = {
  title: 'How matching works',
  steps: [
    {
      title: 'Pick home or business',
      body: 'Home robots start with vacuums (more categories later). Business is warehouse, commercial cleaning, or restaurant — never mixed in one wizard.',
    },
    {
      title: 'Answer a few questions',
      body: 'Home: floors, pets, mop, budget. Business: pain point, labor, layout, and buy vs lease vs RaaS preference.',
    },
    {
      title: 'Get scored options',
      body: 'Use-case 45%, economic 35%, deployment 20%. Then ranked models (home) or robot types and vendors (business).',
    },
  ],
} as const;

export const HOME_TAGLINE_LINES = [
  'Shortlist robots that fit your space.',
  'Rules and specs — not vendor hype.',
] as const;

export const HOME_FINAL_CTA = {
  title: 'Ready to shortlist?',
  body: 'Free matchers. No account. Pick home or business first.',
  ctaLabel: 'Choose a track',
  ctaHref: HOME_TRACKS_HREF,
  secondaryLabel: 'Home robots',
  secondaryHref: HOME_HUB_PATH,
} as const;
