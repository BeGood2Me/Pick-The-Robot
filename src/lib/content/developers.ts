import { API_TIER_LIMITS, type ApiTier } from '@/lib/api/tierLimits';

export const DEVELOPERS_PATH = '/api';

export const API_REFERENCE_PATH = '/api/reference';

/** Machine-readable OpenAPI 3.1 JSON (for Postman, codegen, etc.). */
export const OPENAPI_JSON_PATH = '/api/v1/openapi.json';

/** @deprecated Use OPENAPI_JSON_PATH or API_REFERENCE_PATH */
export const OPENAPI_PATH = OPENAPI_JSON_PATH;

export interface ApiTierCard {
  tier: ApiTier;
  name: string;
  price: string;
  priceDetail: string;
  cta: string;
  highlighted?: boolean;
  features: string[];
}

function tierFeatures(tier: ApiTier): string[] {
  const limits = API_TIER_LIMITS[tier];
  const features = [
    `${limits.matchesPerMonth.toLocaleString()} match calls / month (business + home)`,
    `${limits.requestsPerMinute} requests / minute`,
    `Up to ${limits.maxVendors} vendors or home models per match`,
    `Up to ${limits.maxCatalogVendors} rows in catalog APIs`,
    'No attribution required',
  ];

  if (tier === 'pro') {
    features.push('Runner-up and alternate business robot matches');
    features.push('Vendor scores and extended explanations');
    features.push('Full cleaning ROI breakdown');
    features.push('Home vacuum score breakdowns');
    features.push('Extended vendor and home catalog fields');
  } else {
    features.push('Core business match results and ranked vendors');
    features.push('Home vacuum shortlist from floors, pets, mop, budget');
    features.push('Summary cleaning ROI on business match responses');
  }

  return features;
}

export const API_TIER_CARDS: ApiTierCard[] = [
  {
    tier: 'starter',
    name: 'Starter',
    price: '$49/mo',
    priceDetail: 'Billed monthly · cancel anytime',
    cta: 'Subscribe to Starter',
    features: tierFeatures('starter'),
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: '$149/mo',
    priceDetail: 'Billed monthly · cancel anytime',
    cta: 'Subscribe to Pro',
    highlighted: true,
    features: tierFeatures('pro'),
  },
];

export const API_ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/v1/match',
    summary: 'Business matcher (warehouse, cleaning, restaurant)',
  },
  {
    method: 'POST',
    path: '/api/v1/home/match',
    summary: 'Home robot vacuum matcher (floors, pets, mop, budget)',
  },
  {
    method: 'GET',
    path: '/api/v1/home/products',
    summary: 'Browse the home vacuum SKU catalog',
  },
  {
    method: 'GET',
    path: '/api/v1/vendors',
    summary: 'Browse the business vendor catalog by category and region',
  },
  {
    method: 'GET',
    path: OPENAPI_JSON_PATH,
    summary: 'Machine-readable OpenAPI 3.1 specification',
  },
] as const;

export const API_FAQS = [
  {
    question: 'Who is the API for?',
    answer:
      'Software teams embedding robot recommendations — business (warehouse, commercial cleaning, restaurant) or home robot vacuums — in apps, dealer sites, consulting portals, or internal workflows.',
  },
  {
    question: 'How is the API priced?',
    answer:
      'Starter ($49/mo) and Pro ($149/mo). Every request requires a valid API key from an active subscription.',
  },
  {
    question: 'Starter vs Pro?',
    answer:
      'Starter is for pilots and light embeds: lower volume and core match fields. Pro adds higher limits, runner-up business matches, vendor score breakdowns, full cleaning ROI, and home vacuum score detail.',
  },
  {
    question: 'Can I have more than one API key?',
    answer:
      'Yes. Each subscription is one API key with its own rate limits and monthly quota. Need separate keys for dev and production, or for different products? Subscribe once per key. Use the recovery link on each success page if you need to rotate a key without affecting your others.',
  },
  {
    question: 'Is ranking pay-to-win?',
    answer:
      'No. The same rules-based scoring engine powers the website. Sponsored vendors only receive a small boost when they already match the profile. Paid tiers unlock volume and data depth, not placement.',
  },
  {
    question: 'Home vacuums vs business robots?',
    answer:
      'They are separate endpoints and catalogs. Use POST /api/v1/home/match for home robot vacuums and POST /api/v1/match for warehouse, commercial cleaning, or restaurant. Both share the same monthly match quota.',
  },
  {
    question: 'How do vendor clicks work?',
    answer:
      'Business vendor links in API responses route through our tracked /out redirect with UTM parameters. Home product clickUrl values may be retailer affiliate links — use them as returned. Pass affiliateLocale (US or UK) on POST /home/match or locale on GET /home/products to pick Amazon.com / Amazon.co.uk; rankings do not change.',
  },
  {
    question: 'Do failed requests count against my quota?',
    answer:
      'No. Rate limits and monthly match quotas apply only to successful responses.',
  },
  {
    question: 'How do I authenticate?',
    answer:
      'Send your API key in the X-API-Key header or as a Bearer token on every request. Keys are issued on the success page after Stripe checkout.',
  },
  {
    question: 'Need more than Pro?',
    answer:
      'Email hello@picktherobot.com for high-volume or custom integration needs.',
  },
] as const;
