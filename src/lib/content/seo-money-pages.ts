import type { RobotCategory } from '@/lib/matching';
import { HOME_HUB_PATH, ROBOT_VACUUMS_PATH } from '@/lib/content/home-vacuums';

export type BuyingGuideTrack = 'home' | 'business';

/** High-impression pages — titles/metas tuned in source files; use for internal links. */
export interface SeoMoneyPage {
  href: string;
  label: string;
  blurb: string;
  track: BuyingGuideTrack;
}

export const BUYING_GUIDE_PAGES: SeoMoneyPage[] = [
  {
    href: HOME_HUB_PATH,
    label: 'Home robots hub',
    blurb: 'Pick a home robot category — robot vacuums today, more types later.',
    track: 'home',
  },
  {
    href: ROBOT_VACUUMS_PATH,
    label: 'Robot vacuum matcher',
    blurb: 'Floors, pets, mopping, and budget — ranked models from public specs.',
    track: 'home',
  },
  {
    href: '/methodology',
    label: 'How home rankings work',
    blurb: 'Rules-based scoring for robot vacuums — not lab tests or paid placement.',
    track: 'home',
  },
  {
    href: '/amr-vs-agv',
    label: 'AGV vs AMR',
    blurb: 'Fixed paths vs dynamic maps — pick robot type before vendor demos.',
    track: 'business',
  },
  {
    href: '/warehouse-robot-cost',
    label: 'Warehouse robot cost',
    blurb: 'AMR, AGV, and RaaS bands plus first-year budget examples.',
    track: 'business',
  },
  {
    href: '/restaurant-robot-cost',
    label: 'Restaurant robot cost',
    blurb: 'Lease, RaaS, and purchase ranges for food runners.',
    track: 'business',
  },
  {
    href: '/cleaning-robots-as-a-service',
    label: 'RaaS cleaning robots',
    blurb: 'Monthly scrubber subscriptions and what is included.',
    track: 'business',
  },
  {
    href: '/robotics-as-a-service',
    label: 'Robotics as a service (RaaS)',
    blurb: 'When subscription beats buying across categories.',
    track: 'business',
  },
  {
    href: '/best/amr/ecommerce-warehouse',
    label: 'Best AMRs for e-commerce',
    blurb: 'Fulfillment AMR vendors and workflow fit.',
    track: 'business',
  },
];

export const HOME_BUYING_GUIDE_PAGES = BUYING_GUIDE_PAGES.filter((page) => page.track === 'home');
export const BUSINESS_BUYING_GUIDE_PAGES = BUYING_GUIDE_PAGES.filter(
  (page) => page.track === 'business',
);

/** @deprecated Prefer BUSINESS_BUYING_GUIDE_PAGES — business-only list for category hubs. */
export const SEO_MONEY_PAGES = BUSINESS_BUYING_GUIDE_PAGES;

function guideByHref(href: string): SeoMoneyPage {
  const page = BUYING_GUIDE_PAGES.find((p) => p.href === href);
  if (!page) throw new Error(`Missing buying guide: ${href}`);
  return page;
}

export const CATEGORY_SEO_GUIDE_LINKS: Record<RobotCategory, SeoMoneyPage[]> = {
  warehouse: [
    guideByHref('/amr-vs-agv'),
    guideByHref('/warehouse-robot-cost'),
    guideByHref('/robotics-as-a-service'),
    guideByHref('/best/amr/ecommerce-warehouse'),
  ],
  cleaning: [guideByHref('/cleaning-robots-as-a-service'), guideByHref('/robotics-as-a-service')],
  restaurant: [guideByHref('/restaurant-robot-cost'), guideByHref('/robotics-as-a-service')],
};
