import Link from 'next/link';
import { getBlogBrand } from '@/lib/content/blog';
import {
  BUYER_CHECKLIST_LINKS,
  CATEGORY_LINKS,
  COMPARISON_LINKS,
  HOME_TRACKS_HREF,
  VENDORS_INDEX_HREF,
} from '@/lib/content/navigation';
import { DEVELOPERS_PATH } from '@/lib/content/developers';
import { EXTENSION_PAGE_PATH } from '@/lib/content/extension';
import { HOME_BUYING_GUIDE_PAGES } from '@/lib/content/seo-money-pages';
import { BUSINESS_HUB_PATH } from '@/lib/content/home-vacuums';

type FooterLink = { href: string; label: string };

function FooterLinkList({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-ink-muted">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-ink">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const HOME_LINKS: FooterLink[] = HOME_BUYING_GUIDE_PAGES.map((page) => ({
  href: page.href,
  label: page.label,
}));

const BUSINESS_LINKS: FooterLink[] = [
  { href: BUSINESS_HUB_PATH, label: 'Business matcher' },
  { href: VENDORS_INDEX_HREF, label: 'All vendors' },
  ...CATEGORY_LINKS.map((link) => ({ href: link.href, label: link.label })),
  { href: '/best', label: 'Best by facility' },
  { href: '/integrations', label: 'Integrations' },
  ...BUYER_CHECKLIST_LINKS.map((link) => ({ href: link.href, label: link.label })),
];

const LEARN_LINKS: FooterLink[] = [
  { href: '/blog', label: 'Blog' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/robot-leasing-vs-buying', label: 'Lease vs buy' },
  { href: '/robotics-as-a-service', label: 'RaaS overview' },
  { href: '/raas-pricing', label: 'RaaS pricing' },
  ...COMPARISON_LINKS.map((link) => ({ href: link.href, label: link.label })),
];

export function SiteFooter() {
  const brand = getBlogBrand();

  return (
    <footer className="mt-16 border-t border-surface-border bg-surface">
      <div className="container-page py-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
          <div className="max-w-xs shrink-0 lg:max-w-[15rem]">
            <p className="font-display text-lg font-semibold tracking-tight text-ink">{brand.name}</p>
            <p className="mt-2 line-clamp-4 text-sm text-ink-muted">{brand.bio}</p>
            <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm">
              <Link href="/about" className="font-medium text-accent hover:underline">
                About
              </Link>
              <Link href={HOME_TRACKS_HREF} className="font-medium text-accent hover:underline">
                Choose a track
              </Link>
            </p>
            <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink-muted">
              <Link href={DEVELOPERS_PATH} className="hover:text-ink">
                API
              </Link>
              <Link href={EXTENSION_PAGE_PATH} className="hover:text-ink">
                Extension
              </Link>
            </p>
          </div>

          <div className="grid min-w-0 flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterLinkList title="Home" links={HOME_LINKS} />
            <FooterLinkList title="Business" links={BUSINESS_LINKS} />
            <FooterLinkList title="Learn" links={LEARN_LINKS} />
          </div>
        </div>
      </div>
      <div className="border-t border-surface-border py-4 text-center text-xs text-ink-faint">
        <p>Recommendations are informational. Verify pricing and fit with vendors or retailers directly.</p>
        <p className="mt-2">
          <Link href="/privacy" className="hover:text-ink-muted">
            Privacy
          </Link>
          {' · '}
          <Link href="/terms" className="hover:text-ink-muted">
            Terms
          </Link>
        </p>
      </div>
    </footer>
  );
}
