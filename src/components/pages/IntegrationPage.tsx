import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { FaqBlock } from '@/components/content/FaqBlock';
import { ButtonLink } from '@/components/ui/Button';
import {
  INTEGRATIONS_HUB_PATH,
  SOFTWARE_CATEGORY_LABELS,
  type ResolvedIntegrationPage,
} from '@/lib/content/pseo-integrations';
import { BEST_HUB_PATH } from '@/lib/content/pseo';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export function integrationMetadata(page: ResolvedIntegrationPage) {
  return siteMetadata({
    title: page.title,
    description: page.metaDescription,
    path: page.path,
  });
}

export function IntegrationPage({ page }: { page: ResolvedIntegrationPage }) {
  const { vendor, software, combo, environments } = page;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Integrations', path: INTEGRATIONS_HUB_PATH },
          { name: page.h1, path: page.path },
        ])}
      />
      <JsonLd data={faqJsonLd(combo.faqs)} />

      <div className="container-page py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Integrations', href: INTEGRATIONS_HUB_PATH },
            { label: `${vendor.name} · ${software.name}` },
          ]}
        />

        <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">{page.h1}</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {SOFTWARE_CATEGORY_LABELS[software.category]} · Research guide — not vendor API
          documentation
        </p>
        <p className="mt-4 max-w-3xl text-lg prose-muted">{combo.summary}</p>

        {environments.length > 0 && (
          <p className="mt-3 max-w-3xl text-sm text-ink-muted">
            Facility context:{' '}
            {environments.map((env) => env.name).join('; ')}.
          </p>
        )}

        <p className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={page.matcherHref}>Run matcher</ButtonLink>
          <ButtonLink href={page.vendorHref} variant="secondary">
            {vendor.name} profile
          </ButtonLink>
          {page.showAffiliateCta && page.affiliateHref && (
            <ButtonLink href={page.affiliateHref} variant="secondary">
              {page.affiliateLabel ?? `Learn more about ${software.name}`}
            </ButtonLink>
          )}
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Architecture (conceptual)</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            High-level data flow for planning discussions. Confirm exact connectors, versions, and
            security with {vendor.name} and your {software.name} team.
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink">
            {combo.architectureNotes.map((note) => (
              <li key={note} className="pl-1">
                {note}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Setup steps</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-ink">
            {combo.setupSteps.map((step) => (
              <li key={step} className="pl-1">
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10 card">
          <h2 className="font-semibold">About {software.name}</h2>
          <p className="mt-2 text-sm text-ink-muted">{software.description}</p>
          <p className="mt-2 text-sm text-ink-muted">
            <span className="font-medium text-ink">Pricing hint: </span>
            {software.pricingHint}
          </p>
          <p className="mt-3 text-sm">
            <a
              href={software.websiteUrl}
              className="font-medium text-accent hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Vendor / product site
            </a>
          </p>
        </section>

        {(page.relatedBestPages.length > 0 || environments.length > 0) && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold">Related best-for pages</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {page.relatedBestPages.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-accent hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
              {page.relatedBestPages.length === 0 && (
                <li>
                  <Link href={BEST_HUB_PATH} className="text-accent hover:underline">
                    Browse best robots by facility
                  </Link>
                </li>
              )}
            </ul>
          </section>
        )}

        <div className="mt-10">
          <FaqBlock items={combo.faqs} title="Frequently asked questions" defaultOpen={null} />
        </div>

        <section className="mt-10 card">
          <h2 className="font-semibold">Next steps</h2>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <Link href={INTEGRATIONS_HUB_PATH} className="text-accent hover:underline">
                All integration guides
              </Link>
            </li>
            <li>
              <Link href={page.vendorHref} className="text-accent hover:underline">
                {vendor.name} vendor profile
              </Link>
            </li>
            <li>
              <Link href={page.matcherHref} className="text-accent hover:underline">
                Run the matcher
              </Link>
            </li>
            <li>
              <Link href={BEST_HUB_PATH} className="text-accent hover:underline">
                Best robots by facility
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
