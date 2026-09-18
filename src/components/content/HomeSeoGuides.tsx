import Link from 'next/link';
import {
  BUSINESS_BUYING_GUIDE_PAGES,
  HOME_BUYING_GUIDE_PAGES,
  type SeoMoneyPage,
} from '@/lib/content/seo-money-pages';

function BuyingGuideGrid({ pages }: { pages: SeoMoneyPage[] }) {
  return (
    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
      {pages.map((page) => (
        <li key={page.href}>
          <Link
            href={page.href}
            className="block rounded-lg border border-surface-border bg-surface px-4 py-3 transition hover:border-accent/40"
          >
            <span className="font-medium text-accent">{page.label}</span>
            <span className="mt-1 block text-sm text-ink-muted">{page.blurb}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function HomeSeoGuides() {
  return (
    <section aria-labelledby="home-seo-guides" className="mb-10 mt-12 sm:mt-16">
      <h2 id="home-seo-guides" className="text-lg font-semibold text-ink">Buying guides</h2>
      <p className="mt-1 max-w-2xl text-sm text-ink-muted">
        Home robot research and business automation research are separate — pick the track that matches
        your job.
      </p>

      <h3 className="mt-8 text-base font-semibold text-ink">Home</h3>
      <BuyingGuideGrid pages={HOME_BUYING_GUIDE_PAGES} />

      <h3 className="mt-10 text-base font-semibold text-ink">Business</h3>
      <BuyingGuideGrid pages={BUSINESS_BUYING_GUIDE_PAGES} />
    </section>
  );
}
