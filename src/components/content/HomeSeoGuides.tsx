import Link from 'next/link';
import { SEO_MONEY_PAGES } from '@/lib/content/seo-money-pages';

export function HomeSeoGuides() {
  return (
    <section aria-labelledby="home-seo-guides" className="mb-10 mt-12 sm:mt-16">
      <h2 id="home-seo-guides" className="text-lg font-semibold text-ink">
        Popular buying guides
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {SEO_MONEY_PAGES.map((page) => (
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
    </section>
  );
}
