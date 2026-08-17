import type { FaqItem } from '@/lib/seo/schema';
import { VENDOR_TIER_PRICES_USD } from '@/lib/vendor/tiers';

export const FOR_VENDORS_PATH = '/for-vendors';
export const FOR_VENDORS_LOGIN_PATH = '/for-vendors/login';
export const FOR_VENDORS_PORTAL_PATH = '/for-vendors/portal';

export const VENDOR_CONTACT_EMAIL = 'hello@picktherobot.com';

export const VENDOR_MAILTO_SUBJECT = 'PickTheRobot vendor partnership';

export const VENDOR_WAITLIST_SUBJECT = 'PickTheRobot verified partner waitlist';

export interface VendorValueProp {
  title: string;
  body: string;
}

/** Why robotics vendors partner with PickTheRobot. */
export const VENDOR_VALUE_PROPS: VendorValueProp[] = [
  {
    title: 'Buyers with intent',
    body: 'Visitors answer operational questions — floor size, labor, budget, acquisition preference — before they see vendors. You reach people past the awareness stage.',
  },
  {
    title: 'Category-fit placement',
    body: 'Your profile is scored against the buyer’s recommended robot type and acquisition model. You show up when your offering is relevant, not in every generic robotics list.',
  },
  {
    title: 'Tracked outbound traffic',
    body: 'Every profile and matcher card links to your site with UTM parameters so you can measure clicks from PickTheRobot in your analytics.',
  },
];

export interface VendorVisibilitySurface {
  title: string;
  summary: string;
  bullets: string[];
  note: string;
}

/** Distribution channels included in a vendor partnership. */
export const VENDOR_VISIBILITY_SURFACES: VendorVisibilitySurface[] = [
  {
    title: 'Vendor directory',
    summary:
      'Permanent discoverability on /vendors and category guides while buyers are still researching.',
    bullets: [
      'Dedicated profile page with robot types, regions, and acquisition models',
      'Listed alongside category peers buyers are already comparing',
      'Outbound link on every profile view',
    ],
    note: 'Every vendor listing includes directory placement once approved.',
  },
  {
    title: 'Matcher shortlists',
    summary:
      'Your brand inside scored match results — where buyers have already picked a robot type and acquisition path.',
    bullets: [
      'Ranked vendor card with fit score and explanation',
      'Shown when robot type, region, and acquisition model align',
      'Optional sponsored boost when you are already a strong fit',
    ],
    note: 'Matcher placement is fit-based. Vendors do not buy their way into the wrong category.',
  },
];

export type VendorTierStatus = 'available' | 'coming_soon' | 'contact';

export interface VendorTierCard {
  id: string;
  name: string;
  price: string;
  priceDetail: string;
  status: VendorTierStatus;
  highlighted?: boolean;
  features: string[];
  cta?: string;
  ctaSubject?: string;
}

/** Paid vendor tiers — verified partner is the primary product. */
export const VENDOR_TIER_CARDS: VendorTierCard[] = [
  {
    id: 'verified',
    name: 'Verified partner',
    price: `$${VENDOR_TIER_PRICES_USD.verified}/mo`,
    priceDetail: 'Monthly subscription · self-serve checkout',
    status: 'available',
    highlighted: true,
    features: [
      'Verified badge on directory and matcher cards',
      'Logo on profile and in match results',
      'Vendor portal with click reporting',
      'Eligible for matcher when buyer profile fits',
      'Manage billing in Stripe Customer Portal',
    ],
    cta: 'Subscribe below',
  },
  {
    id: 'sponsored',
    name: 'Sponsored boost',
    price: `+$${VENDOR_TIER_PRICES_USD.sponsored}/mo`,
    priceDetail: 'Requires Verified partner · disclosed on every placement',
    status: 'available',
    features: [
      '“Sponsored” badge on relevant matcher cards',
      'Modest score lift only when you already score ≥40% fit',
      'Custom affiliate URL in vendor portal',
      'Never shown for the wrong robot type or region',
    ],
    cta: 'Add after Verified',
  },
];

export const VENDOR_FAQS: FaqItem[] = [
  {
    question: 'Who will see our listing?',
    answer:
      'Operations and facilities teams researching warehouse, cleaning, and restaurant automation — primarily US, EU, and UK. They use the matcher to narrow robot type and acquisition model before contacting vendors.',
  },
  {
    question: 'Do we appear in every matcher result?',
    answer:
      'Only when your robot types, regions, acquisition models, and facility fit match that buyer’s answers. That is what makes the traffic qualified. A strong warehouse AMR profile will not appear in a restaurant serving-robot result.',
  },
  {
    question: 'Can we pay to outrank competitors?',
    answer:
      'No. Sponsored boost adds a small lift only when you already score at least 40% fit. Poor relevance still ranks below a better non-sponsored match. We disclose sponsorship everywhere it applies.',
  },
  {
    question: 'What do you need from us to go live?',
    answer:
      'Company name, website, categories, robot types, supported regions, acquisition models (buy, lease, RaaS), deployment complexity, ideal facility size, and a short positioning blurb. We map these to the same fields buyers answer in the wizard.',
  },
  {
    question: 'How do I manage billing?',
    answer:
      'Use the vendor portal after checkout. Manage payment method, invoices, and cancellation in the Stripe Customer Portal — no separate PickTheRobot billing login required.',
  },
];
