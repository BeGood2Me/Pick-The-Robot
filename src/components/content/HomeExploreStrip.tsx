import Link from 'next/link';
import { BEST_HUB_PATH } from '@/lib/content/pseo';
import { INTEGRATIONS_HUB_PATH } from '@/lib/content/pseo-integrations';
import { CATEGORY_ROUTES } from '@/lib/content/navigation';

/** Compact homepage labels — full phrases live in title attributes and on destination pages. */
export const HOME_EXPLORE_LINKS = [
  { href: CATEGORY_ROUTES.warehouse, label: 'Warehouse', title: 'Warehouse robots' },
  { href: CATEGORY_ROUTES.cleaning, label: 'Cleaning', title: 'Cleaning robots' },
  { href: CATEGORY_ROUTES.restaurant, label: 'Restaurant', title: 'Restaurant robots' },
  { href: BEST_HUB_PATH, label: 'Best by facility', title: 'Best robots by facility type' },
  { href: INTEGRATIONS_HUB_PATH, label: 'Integrations', title: 'Robot WMS integrations' },
  { href: '/blog', label: 'Buying guides', title: 'Robot buying guides' },
  { href: '/about', label: 'About', title: 'About PickTheRobot' },
] as const;

const pillClassName =
  'shrink-0 whitespace-nowrap rounded-full border border-surface-border bg-surface px-2.5 py-1 text-sm font-medium text-ink-muted transition hover:border-accent/40 hover:text-ink';

export function HomeExploreStrip() {
  return (
    <section aria-label="Robot category and buying guides" className="mb-10 mt-12 sm:mt-16">
      <nav className="flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {HOME_EXPLORE_LINKS.map((link) => (
          <Link key={link.href} href={link.href} title={link.title} className={pillClassName}>
            {link.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
