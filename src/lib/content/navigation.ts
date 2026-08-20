import { DEVELOPERS_PATH } from '@/lib/content/developers';
import type { RobotCategory } from '@/lib/matching';
import { CATEGORY_LABELS } from '@/lib/forms/questions';

import { GUIDE_LINKS } from '@/lib/content/guides';
import { CLEANING_BUYERS_CHECKLIST_PATH } from '@/lib/content/cleaning-buyers-checklist';
import { WAREHOUSE_BUYERS_CHECKLIST_PATH } from '@/lib/content/warehouse-buyers-checklist';
import { RESTAURANT_BUYERS_CHECKLIST_PATH } from '@/lib/content/restaurant-buyers-checklist';

export const SITE_NAME = 'PickTheRobot';

export const CATEGORY_ROUTES: Record<RobotCategory, string> = {
  warehouse: '/warehouse-robots',
  cleaning: '/cleaning-robots',
  restaurant: '/restaurant-robots',
};

/** Legacy in-page anchor — kept on category guide pages for old deep links. */
export const CATEGORY_GUIDE_ANCHOR = 'guide';

export function categoryGuideHref(category: RobotCategory): string {
  return CATEGORY_ROUTES[category];
}

/** Homepage matcher entry, optionally pre-selecting a category. */
export function homeMatcherHref(category?: RobotCategory | null): string {
  if (!category) return HOME_MATCHER_RESET_HREF;
  return `/?category=${category}#matcher`;
}

/** Homepage matcher entry — hash scrolls to wizard; avoids ?query URLs that GSC treats as redirects. */
export const HOME_MATCHER_RESET_HREF = '/#matcher';

/** Site logo / brand home link (plain homepage, not matcher hash). */
export const HOME_HREF = '/';

export const VENDORS_INDEX_HREF = '/vendors';

/** Primary header nav — categories + vendors + API; guides/comparisons live in footer and mobile menu. */
export const HEADER_NAV_LINKS = [
  { href: '/warehouse-robots', label: 'Warehouse' },
  { href: '/cleaning-robots', label: 'Cleaning' },
  { href: '/restaurant-robots', label: 'Restaurant' },
  { href: VENDORS_INDEX_HREF, label: 'Vendors' },
  { href: DEVELOPERS_PATH, label: 'API' },
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

/** Links to standalone category guide pages. */
export const CATEGORY_GUIDE_LINKS = GUIDE_CATEGORIES.map((category) => ({
  href: categoryGuideHref(category),
  label: `${CATEGORY_LABELS[category]} guide`,
}));

export const COMPARISON_LINKS = [
  { href: '/amr-vs-agv', label: 'AMR vs AGV' },
  { href: '/humanoid-vs-amr', label: 'Humanoid vs AMR' },
  { href: '/cleaning-robot-vs-cleaning-staff', label: 'Robot vs staff' },
  { href: '/restaurant-robot-vs-runner', label: 'Food runner robot vs staff' },
] as const;

export const BUYER_CHECKLIST_LINKS = [
  { href: WAREHOUSE_BUYERS_CHECKLIST_PATH, label: 'Warehouse robot checklist' },
  { href: CLEANING_BUYERS_CHECKLIST_PATH, label: 'Cleaning robot checklist' },
  { href: RESTAURANT_BUYERS_CHECKLIST_PATH, label: 'Restaurant robot checklist' },
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
      label: 'Food runner robot vs staff',
      blurb: 'Serving robots vs extra floor staff.',
    },
    {
      href: '/resources/restaurant-robot-buyer-checklist',
      label: 'Restaurant robot buyer checklist',
      blurb: 'Ten steps before vendor demos.',
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
