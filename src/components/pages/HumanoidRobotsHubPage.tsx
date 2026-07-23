import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { FaqBlock } from '@/components/content/FaqBlock';
import { Badge } from '@/components/ui/Badge';
import { VendorMonogram } from '@/components/brand/VendorMonogram';
import {
  getAllHumanoids,
  HUMANOID_HUB,
  HUMANOID_HUB_PATH,
  HUMANOID_READINESS_LABELS,
  humanoidProfilePath,
} from '@/lib/content/humanoids';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: HUMANOID_HUB.title,
  description: HUMANOID_HUB.metaDescription,
  path: HUMANOID_HUB_PATH,
});

export function HumanoidRobotsHubPage() {
  const companies = getAllHumanoids();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: HUMANOID_HUB.h1, path: HUMANOID_HUB_PATH },
        ])}
      />
      <JsonLd data={faqJsonLd([...HUMANOID_HUB.faqs])} />

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: HUMANOID_HUB.h1 }]} />

        <p className="text-sm font-medium text-accent">Track — not in matcher</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">{HUMANOID_HUB.h1}</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">{HUMANOID_HUB.intro}</p>

        <section className="mt-8 card border-amber-500/30 bg-amber-500/5">
          <h2 className="text-lg font-semibold text-ink">Need automation this year?</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Humanoids are mostly pilot-stage. For deployable robots, run the matcher for warehouse,
            cleaning, or restaurant operations.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/warehouse-robots#matcher"
              className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Warehouse matcher
            </Link>
            <Link
              href="/humanoid-vs-amr"
              className="inline-flex rounded-lg border border-surface-border px-4 py-2.5 text-sm font-semibold text-ink hover:border-accent/40"
            >
              Humanoid vs AMR
            </Link>
          </div>
        </section>

        {HUMANOID_HUB.sections.map((section) => (
          <section key={section.heading} className="mt-8 card">
            <h2 className="text-lg font-semibold">{section.heading}</h2>
            {'paragraphs' in section &&
              section.paragraphs.map((p) => (
                <p key={p} className="mt-3 text-sm text-ink-muted">
                  {p}
                </p>
              ))}
            {'bullets' in section && (
              <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Humanoid platforms we track</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Research profiles — not ranked in the matcher. Readiness labels reflect public buyer
            access as of 2026.
          </p>
          <div className="mt-6 space-y-4">
            {companies.map((company) => (
              <article
                key={company.id}
                className="card flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex min-w-0 gap-3">
                  <VendorMonogram name={company.name} size="sm" />
                  <div className="min-w-0">
                    <Link
                      href={humanoidProfilePath(company.slug)}
                      className="text-lg font-semibold hover:text-accent"
                    >
                      {company.name}
                    </Link>
                    <p className="text-sm text-ink-muted">{company.productName}</p>
                    <p className="mt-1 text-sm text-ink-muted">{company.shortDescription}</p>
                    <Badge variant="default" className="mt-2">
                      {HUMANOID_READINESS_LABELS[company.readiness]}
                    </Badge>
                  </div>
                </div>
                <Link
                  href={humanoidProfilePath(company.slug)}
                  className="shrink-0 text-sm font-semibold text-accent hover:underline"
                >
                  View profile
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 card">
          <h2 className="font-semibold">Related guides</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {HUMANOID_HUB.relatedLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-accent hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <FaqBlock items={[...HUMANOID_HUB.faqs]} title="Humanoid robot FAQs" />
        </div>
      </div>
    </>
  );
}
