import type { RobotCategory } from '@/lib/matching';

/** High-impression pages — titles/metas tuned in source files; use for internal links. */
export interface SeoMoneyPage {
  href: string;
  label: string;
  blurb: string;
}

export const SEO_MONEY_PAGES: SeoMoneyPage[] = [
  {
    href: '/amr-vs-agv',
    label: 'AGV vs AMR',
    blurb: 'Fixed paths vs dynamic maps — pick robot type before vendor demos.',
  },
  {
    href: '/blog/warehouse-robot-cost-2026',
    label: 'Warehouse robot cost (2026)',
    blurb: 'AMR, AGV, and RaaS bands plus first-year budget examples.',
  },
  {
    href: '/blog/restaurant-serving-robot-cost',
    label: 'Serving robot cost',
    blurb: 'Lease, RaaS, and purchase ranges for food runners.',
  },
  {
    href: '/blog/raas-cleaning-robots-guide',
    label: 'RaaS cleaning robots',
    blurb: 'Monthly scrubber subscriptions and what is included.',
  },
  {
    href: '/robotics-as-a-service',
    label: 'Robotics as a service (RaaS)',
    blurb: 'When subscription beats buying across categories.',
  },
  {
    href: '/best/amr/ecommerce-warehouse',
    label: 'Best AMRs for e-commerce',
    blurb: 'Fulfillment AMR vendors and workflow fit.',
  },
];

export const CATEGORY_SEO_GUIDE_LINKS: Record<RobotCategory, SeoMoneyPage[]> = {
  warehouse: [
    SEO_MONEY_PAGES[0],
    SEO_MONEY_PAGES[1],
    SEO_MONEY_PAGES[4],
    SEO_MONEY_PAGES[5],
  ],
  cleaning: [SEO_MONEY_PAGES[3], SEO_MONEY_PAGES[4]],
  restaurant: [SEO_MONEY_PAGES[2], SEO_MONEY_PAGES[4]],
};
