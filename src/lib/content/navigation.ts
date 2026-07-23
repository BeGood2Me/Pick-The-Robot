import type { RobotCategory } from '@/lib/matching';
import { CATEGORY_LABELS } from '@/lib/forms/questions';

import { GUIDE_LINKS } from '@/lib/content/guides';

export const SITE_NAME = 'PickTheRobot';

export const CATEGORY_ROUTES: Record<RobotCategory, string> = {
  warehouse: '/warehouse-robots',
  cleaning: '/cleaning-robots',
  restaurant: '/restaurant-robots',
};

/** In-page anchor for robot types, vendors, and FAQs below the matcher. */
export const CATEGORY_GUIDE_ANCHOR = 'guide';

export function categoryGuideHref(category: RobotCategory): string {
  return `${CATEGORY_ROUTES[category]}#${CATEGORY_GUIDE_ANCHOR}`;
}

/** Logo home — resets homepage matcher to category selection. */
export const HOME_MATCHER_RESET_HREF = '/?matcher=category';

export const VENDORS_INDEX_HREF = '/vendors';

/** Primary header nav — categories + vendors only; guides/comparisons live in footer and mobile menu. */
export const HEADER_NAV_LINKS = [
  { href: '/warehouse-robots', label: 'Warehouse' },
  { href: '/cleaning-robots', label: 'Cleaning' },
  { href: '/restaurant-robots', label: 'Restaurant' },
  { href: VENDORS_INDEX_HREF, label: 'Vendors' },
] as const;

export const NAV_LINKS = [
  { href: '/warehouse-robots', label: 'Warehouse' },
  { href: '/cleaning-robots', label: 'Cleaning' },
  { href: '/restaurant-robots', label: 'Restaurant' },
  { href: '/robot-leasing-vs-buying', label: 'Lease vs buy' },
  { href: '/robotics-as-a-service', label: 'RaaS' },
] as const;

export const DECISION_LINKS = [
  { href: '/robot-leasing-vs-buying', label: 'Lease vs buy' },
  { href: '/robotics-as-a-service', label: 'Robotics-as-a-Service (RaaS)' },
  { href: '/raas-pricing', label: 'RaaS pricing' },
] as const;

export { GUIDE_LINKS };

export const CATEGORY_LINKS = [
  { href: '/warehouse-robots', label: 'Warehouse robots' },
  { href: '/cleaning-robots', label: 'Cleaning robots' },
  { href: '/restaurant-robots', label: 'Restaurant robots' },
] as const;

const GUIDE_CATEGORIES: RobotCategory[] = ['warehouse', 'cleaning', 'restaurant'];

/** Links to robot types / guide content below the matcher (`#guide`). */
export const CATEGORY_GUIDE_LINKS = GUIDE_CATEGORIES.map((category) => ({
  href: categoryGuideHref(category),
  label: `${CATEGORY_LABELS[category]} guide`,
}));

export const COMPARISON_LINKS = [
  { href: '/amr-vs-agv', label: 'AMR vs AGV' },
  { href: '/humanoid-vs-amr', label: 'Humanoid vs AMR' },
  { href: '/cleaning-robot-vs-cleaning-staff', label: 'Robot vs staff' },
  { href: '/restaurant-robot-vs-runner', label: 'Robot vs runner' },
] as const;

/** Category-specific comparison guides for internal linking. */
export const CATEGORY_COMPARISON_LINKS: Record<
  RobotCategory,
  { href: string; label: string; blurb: string }[]
> = {
  warehouse: [
    {
      href: '/amr-vs-agv',
      label: 'AMR vs AGV',
      blurb: 'When dynamic transport beats fixed guided routes.',
    },
    {
      href: '/humanoid-vs-amr',
      label: 'Humanoid vs AMR',
      blurb: 'When deployable AMRs beat humanoid pilots.',
    },
    {
      href: '/warehouse-robot-cost',
      label: 'Warehouse robot cost',
      blurb: 'Typical price ranges for AMRs, AGVs, and pallet movers.',
    },
    {
      href: '/robot-leasing-vs-buying',
      label: 'Lease vs buy',
      blurb: 'Acquisition models for warehouse automation.',
    },
    {
      href: '/robotics-as-a-service',
      label: 'RaaS',
      blurb: 'Subscription models for AMR pilots.',
    },
    {
      href: '/raas-pricing',
      label: 'RaaS pricing',
      blurb: 'What robotics subscriptions typically cost.',
    },
  ],
  cleaning: [
    {
      href: '/cleaning-robot-vs-cleaning-staff',
      label: 'Robot vs cleaning staff',
      blurb: 'When autonomous cleaning beats hiring.',
    },
    {
      href: '/cleaning-robot-cost',
      label: 'Cleaning robot cost',
      blurb: 'Price ranges for scrubbers and vacuums.',
    },
    {
      href: '/cleaning-robots-as-a-service',
      label: 'Cleaning RaaS',
      blurb: 'Subscription cleaning robots for first deployments.',
    },
    {
      href: '/robot-leasing-vs-buying',
      label: 'Lease vs buy',
      blurb: 'Capex vs opex for scrubbers and vacuums.',
    },
    {
      href: '/raas-pricing',
      label: 'RaaS pricing',
      blurb: 'Monthly ranges by robot category.',
    },
  ],
  restaurant: [
    {
      href: '/restaurant-robot-vs-runner',
      label: 'Robot vs runner',
      blurb: 'Serving robots vs extra floor staff.',
    },
    {
      href: '/robotics-as-a-service',
      label: 'RaaS',
      blurb: 'Pilot serving robots without large upfront cost.',
    },
    {
      href: '/raas-pricing',
      label: 'RaaS pricing',
      blurb: 'Typical serving-robot subscription ranges.',
    },
  ],
};
