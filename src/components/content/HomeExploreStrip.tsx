import Link from 'next/link';
import { BEST_HUB_PATH } from '@/lib/content/pseo';
import { INTEGRATIONS_HUB_PATH } from '@/lib/content/pseo-integrations';
import { CATEGORY_ROUTES } from '@/lib/content/navigation';
import { ROBOT_VACUUMS_PATH, HOME_HUB_PATH } from '@/lib/content/home-vacuums';

type ExploreLink = { href: string; label: string; title: string };

const HOME_EXPLORE_LINKS_HOME: ExploreLink[] = [
  { href: HOME_HUB_PATH, label: 'Home robots', title: 'Home robots hub' },
  { href: ROBOT_VACUUMS_PATH, label: 'Robot vacuums', title: 'Robot vacuum matcher' },
];

const HOME_EXPLORE_LINKS_BUSINESS: ExploreLink[] = [
  { href: '/business', label: 'Business', title: 'Business robots' },
  { href: CATEGORY_ROUTES.warehouse, label: 'Warehouse', title: 'Warehouse robots' },
  { href: CATEGORY_ROUTES.cleaning, label: 'Cleaning', title: 'Commercial cleaning robots' },
  { href: CATEGORY_ROUTES.restaurant, label: 'Restaurant', title: 'Restaurant robots' },
  { href: BEST_HUB_PATH, label: 'Best by facility', title: 'Best robots by facility type' },
  { href: INTEGRATIONS_HUB_PATH, label: 'Integrations', title: 'Robot WMS integrations' },
  { href: '/warehouse-robot-cost', label: 'Warehouse cost', title: 'Warehouse robot cost' },
  { href: '/amr-vs-agv', label: 'AGV vs AMR', title: 'AGV vs AMR comparison' },
  { href: '/about', label: 'About', title: 'About PickTheRobot' },
];

/** Compact homepage labels — full phrases live in title attributes and on destination pages. */
export const HOME_EXPLORE_LINKS = [...HOME_EXPLORE_LINKS_HOME, ...HOME_EXPLORE_LINKS_BUSINESS];

const pillClassName =
  'shrink-0 whitespace-nowrap rounded-full border border-surface-border bg-surface px-2.5 py-1 text-sm font-medium text-ink-muted transition hover:border-accent/40 hover:text-ink';

function ExplorePills({ links, label }: { links: ExploreLink[]; label: string }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</p>
      <div className="flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map((link) => (
          <Link key={link.href} href={link.href} title={link.title} className={pillClassName}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function HomeExploreStrip() {
  return (
    <section aria-label="Explore home and business robots" className="mb-10 mt-12 space-y-4 sm:mt-16">
      <ExplorePills links={HOME_EXPLORE_LINKS_HOME} label="Home" />
      <ExplorePills links={HOME_EXPLORE_LINKS_BUSINESS} label="Business" />
    </section>
  );
}
