import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { FaqBlock } from '@/components/content/FaqBlock';
import { ButtonLink } from '@/components/ui/Button';
import {
  BEST_HUB_PATH,
  formatAcquisitionModels,
  vendorCapacitySummary,
  vendorPrimaryTask,
  type ResolvedBestForPage,
} from '@/lib/content/pseo';
import {
  getRelatedIntegrationsForBestPage,
  INTEGRATIONS_HUB_PATH,
} from '@/lib/content/pseo-integrations';
import { CostBandSection } from '@/components/pages/CostBandSection';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export function bestForMetadata(page: ResolvedBestForPage) {
  return siteMetadata({
    title: page.title,
    description: page.metaDescription,
    path: page.path,
  });
}

export function BestForPage({ page }: { page: ResolvedBestForPage }) {
  const { environment, vendors, robotType, robotTypeLabel } = page;
  const relatedIntegrations = getRelatedIntegrationsForBestPage(
    environment.id,
    vendors.map((v) => v.slug),
  );

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Best robots', path: BEST_HUB_PATH },
          { name: page.h1, path: page.path },
        ])}
      />
      <JsonLd data={faqJsonLd(page.faqs)} />

      <div className="container-page py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Best robots', href: BEST_HUB_PATH },
            { label: `${robotTypeLabel} · ${environment.name}` },
          ]}
        />

        <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">{page.h1}</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">{environment.pageIntro}</p>

        <p className="mt-6">
          <ButtonLink href={page.matcherHref}>Run the matcher</ButtonLink>
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Top robots for {environment.name}</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            Shortlist from vendors that list {robotTypeLabel} for {environment.category}{' '}
            operations. Rankings here are research filters—not paid placement overrides of matcher
            fit scores.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.slice(0, 3).map((vendor) => (
              <li key={vendor.id} className="card flex flex-col">
                <h3 className="text-lg font-semibold text-ink">{vendor.name}</h3>
                <p className="mt-2 flex-1 text-sm text-ink-muted">{vendor.shortDescription}</p>
                <p className="mt-3 text-sm text-ink-muted">
                  <span className="font-medium text-ink">Primary focus: </span>
                  {vendorPrimaryTask(vendor, robotType)}
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  <span className="font-medium text-ink">Works best when: </span>
                  {vendor.bestFor.slice(0, 2).join('; ') ||
                    `You need ${robotTypeLabel.toLowerCase()} capacity.`}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <Link
                    href={`/vendors/${vendor.slug}`}
                    className="font-medium text-accent hover:underline"
                  >
                    View vendor profile
                  </Link>
                  <Link href={page.costGuide.href} className="font-medium text-accent hover:underline">
                    See cost guide
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <caption className="mb-3 text-left text-lg font-semibold text-ink">
              {robotTypeLabel} vendor comparison for {environment.name}
            </caption>
            <thead>
              <tr className="border-b border-surface-border">
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Robot / vendor
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Primary task
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Capacity summary
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Pricing model
                </th>
                <th scope="col" className="py-2 font-semibold">
                  Regions
                </th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="border-b border-surface-border/80 align-top">
                  <th scope="row" className="py-3 pr-3 font-medium text-ink">
                    <Link href={`/vendors/${vendor.slug}`} className="text-accent hover:underline">
                      {vendor.name}
                    </Link>
                  </th>
                  <td className="py-3 pr-3 text-ink-muted">{vendorPrimaryTask(vendor, robotType)}</td>
                  <td className="py-3 pr-3 text-ink-muted">{vendorCapacitySummary(vendor)}</td>
                  <td className="py-3 pr-3 text-ink-muted">{formatAcquisitionModels(vendor)}</td>
                  <td className="py-3 text-ink-muted">{vendor.regions.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {page.costBand && (
          <CostBandSection
            robotTypeLabel={robotTypeLabel}
            band={page.costBand}
            costGuide={page.costGuide}
            matcherHref={page.matcherHref}
            category={environment.category}
          />
        )}

        <section className="mt-10 card">
          <h2 className="text-lg font-semibold">How these robots fit {environment.name}</h2>
          <p className="mt-3 text-sm text-ink-muted">{environment.description}</p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-ink">Floor area band</dt>
              <dd className="text-ink-muted">{environment.floorAreaBand}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Traffic pattern</dt>
              <dd className="text-ink-muted">{environment.trafficPattern}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-semibold text-ink">Priority KPIs</dt>
              <dd className="text-ink-muted">{environment.priorityKpis.join(', ')}</dd>
            </div>
          </dl>
          {page.useCases.length > 0 && (
            <ul className="mt-6 space-y-4">
              {page.useCases.map((uc) => (
                <li key={uc.id}>
                  <h3 className="font-semibold text-ink">{uc.name}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{uc.summary}</p>
                  <p className="mt-1 text-xs text-ink-faint">KPIs: {uc.kpis.join(', ')}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-10 card border-accent/30 bg-accent-soft/20">
          <h2 className="text-lg font-semibold">Get a recommendation for your operation</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Answer a few questions—we&apos;ll rank robot types, acquisition models, and vendors from
            your inputs.
          </p>
          <p className="mt-4">
            <ButtonLink href={page.matcherHref}>Run the {environment.category} matcher</ButtonLink>
          </p>
        </section>

        {relatedIntegrations.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold">Related integrations</h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">
              WMS and ops pairing guides for vendors already on this shortlist.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {relatedIntegrations.map((integration) => (
                <li key={integration.path}>
                  <Link href={integration.path} className="text-accent hover:underline">
                    {integration.vendor.name} + {integration.software.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={INTEGRATIONS_HUB_PATH} className="text-accent hover:underline">
                  All integration guides
                </Link>
              </li>
            </ul>
          </section>
        )}

        <div className="mt-10">
          <FaqBlock items={page.faqs} title="Frequently asked questions" defaultOpen={null} />
        </div>

        <section className="mt-10 card">
          <h2 className="font-semibold">Guides &amp; tools</h2>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <Link href={BEST_HUB_PATH} className="text-accent hover:underline">
                All best-for facility pages
              </Link>
            </li>
            <li>
              <Link href={INTEGRATIONS_HUB_PATH} className="text-accent hover:underline">
                Robot software integrations
              </Link>
            </li>
            <li>
              <Link href={page.categoryGuideHref} className="text-accent hover:underline">
                {environment.category.charAt(0).toUpperCase() + environment.category.slice(1)} robot
                guide
              </Link>
            </li>
            <li>
              <Link href={page.costGuide.href} className="text-accent hover:underline">
                {page.costGuide.label}
              </Link>
            </li>
            <li>
              <Link href={page.matcherHref} className="text-accent hover:underline">
                Run the matcher
              </Link>
            </li>
            {vendors.slice(0, 3).map((vendor) => (
              <li key={vendor.id}>
                <Link href={`/vendors/${vendor.slug}`} className="text-accent hover:underline">
                  {vendor.name} profile
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
