import { API_TIER_LIMITS, type ApiTier } from '@/lib/api/tierLimits';

export const DEVELOPERS_PATH = '/developers';

export const API_REFERENCE_PATH = '/developers/reference';

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
    `${limits.matchesPerMonth.toLocaleString()} match calls / month`,
    `${limits.requestsPerMinute} requests / minute`,
    `Up to ${limits.maxVendors} vendors per match`,
    `Up to ${limits.maxCatalogVendors} vendors in catalog API`,
    'No attribution required',
  ];

  if (tier === 'pro') {
    features.push('Runner-up and alternate robot matches');
    features.push('Vendor scores and extended explanations');
    features.push('Full cleaning ROI breakdown');
    features.push('Extended vendor catalog fields');
  } else {
    features.push('Core match results and ranked vendors');
    features.push('Summary cleaning ROI on match responses');
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
    summary: 'Run the matcher from your app',
  },
  {
    method: 'GET',
    path: '/api/v1/vendors',
    summary: 'Browse the vendor catalog by category and region',
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
      'Software teams embedding robot recommendations in facility management tools, dealer sites, consulting portals, or internal sales workflows. If you need structured robot type, acquisition, and vendor shortlists from facility inputs, the API is for you.',
  },
  {
    question: 'How is the API priced?',
    answer:
      'Starter ($49/mo) and Pro ($149/mo). Every request requires a valid API key from an active subscription.',
  },
  {
    question: 'Starter vs Pro?',
    answer:
      'Starter is for pilots and light embeds: lower volume and core match fields. Pro adds higher limits, runner-up matches, vendor score breakdowns, and full cleaning ROI detail.',
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
    question: 'How do vendor clicks work?',
    answer:
      'Every vendor link in API responses routes through our tracked /out redirect with UTM parameters. Use the clickUrl values as returned.',
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
