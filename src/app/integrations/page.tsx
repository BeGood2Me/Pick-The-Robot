import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  getIntegrationHubBySoftwareCategory,
  INTEGRATIONS_HUB_PATH,
} from '@/lib/content/pseo-integrations';
import { breadcrumbJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'Robot integrations with WMS, ERP & ops software',
  description:
    'Research how warehouse and cleaning robots pair with WMS, ERP, and facilities platforms—then open vendor profiles or run the matcher.',
  path: INTEGRATIONS_HUB_PATH,
});

export default function IntegrationsHubPage() {
  const groups = getIntegrationHubBySoftwareCategory();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Integrations', path: INTEGRATIONS_HUB_PATH },
        ])}
      />

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Integrations' }]} />

        <h1 className="mt-4 font-display text-4xl font-semibold">
          Robot software integrations
        </h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">
          High-intent guides for “how does this robot work with my WMS / ops stack?” Each page is an
          allowlisted vendor × software pair with conceptual architecture and setup steps—not a
          substitute for vendor API docs or SI statements of work.
        </p>

        {groups.map((group) => (
          <section key={group.category} className="mt-10">
            <h2 className="text-xl font-semibold">{group.label}</h2>
            <ul className="mt-4 space-y-4">
              {group.pages.map((page) => (
                <li
                  key={page.path}
                  className="border-b border-surface-border pb-4 last:border-0 last:pb-0"
                >
                  <Link
                    href={page.path}
                    className="text-lg font-medium text-accent hover:underline"
                  >
                    {page.vendor.name} + {page.software.name}
                  </Link>
                  <p className="mt-1 text-sm text-ink-muted">{page.combo.summary}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="mt-8 text-sm text-ink-muted">
          Need a scored robot-type fit first?{' '}
          <Link href="/#matcher" className="font-medium text-accent hover:underline">
            Run the matcher
          </Link>
          .
        </p>
      </div>
    </>
  );
}
