import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  BEST_HUB_PATH,
  getAllEnvironments,
  getHubEntries,
} from '@/lib/content/pseo';
import { breadcrumbJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'Best robots by facility type',
  description:
    'Research which robot types fit e-commerce warehouses, office floors, restaurants, and more—then run the matcher for a scored recommendation.',
  path: BEST_HUB_PATH,
});

export default function BestHubPage() {
  const pages = getHubEntries();
  const environments = getAllEnvironments();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Best robots', path: BEST_HUB_PATH },
        ])}
      />

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Best robots' }]} />

        <h1 className="mt-4 font-display text-4xl font-semibold">Best robots by facility type</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">
          Facility-focused shortlists built from our vendor data. These pages answer “what robot type
          fits this environment?”—then send you into the rules-based matcher for your own inputs.
          They are not a replacement for category overviews or vendor quotes.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Browse pages</h2>
          <ul className="mt-4 space-y-4">
            {pages.map((page) => (
              <li
                key={page.path}
                className="border-b border-surface-border pb-4 last:border-0 last:pb-0"
              >
                <Link href={page.path} className="text-lg font-medium text-accent hover:underline">
                  {page.h1}
                </Link>
                <p className="mt-1 text-sm text-ink-muted">{page.environment.pageIntro}</p>
                <p className="mt-1 text-xs text-ink-faint">
                  {page.robotTypeLabel} · {page.vendors.length} vendors · {page.environment.category}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 card">
          <h2 className="text-lg font-semibold">Environments we cover</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {environments.map((env) => (
              <li key={env.id}>
                <p className="font-medium text-ink">{env.name}</p>
                <p className="text-ink-muted">{env.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-8 text-sm text-ink-muted">
          Prefer a scored recommendation?{' '}
          <Link href="/#matcher" className="font-medium text-accent hover:underline">
            Run the matcher
          </Link>
          .
        </p>
      </div>
    </>
  );
}
