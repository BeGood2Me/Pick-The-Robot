import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { VendorMonogram } from '@/components/brand/VendorMonogram';
import {
  getAllHumanoids,
  getHumanoidBySlug,
  HUMANOID_HUB,
  HUMANOID_HUB_PATH,
  HUMANOID_READINESS_LABELS,
  humanoidProfilePath,
} from '@/lib/content/humanoids';
import { breadcrumbJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export function humanoidProfileMetadata(slug: string) {
  const company = getHumanoidBySlug(slug);
  if (!company) return {};
  return siteMetadata({
    title: `${company.name} humanoid — research profile`,
    description: company.shortDescription,
    path: humanoidProfilePath(slug),
  });
}

export function HumanoidProfilePage({ slug }: { slug: string }) {
  const company = getHumanoidBySlug(slug);
  if (!company) notFound();

  const others = getAllHumanoids().filter((h) => h.slug !== slug).slice(0, 4);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: HUMANOID_HUB.h1, path: HUMANOID_HUB_PATH },
          { name: company.name, path: humanoidProfilePath(slug) },
        ])}
      />

      <div className="container-page py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: HUMANOID_HUB.h1, href: HUMANOID_HUB_PATH },
            { label: company.name },
          ]}
        />

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-4">
            <VendorMonogram name={company.name} size="md" />
            <div>
              <p className="text-sm font-medium text-accent">Research profile — not in matcher</p>
              <h1 className="mt-1 font-display text-4xl font-semibold">{company.name}</h1>
              <p className="mt-1 text-lg text-ink-muted">{company.productName}</p>
              <Badge variant="default" className="mt-3">
                {HUMANOID_READINESS_LABELS[company.readiness]}
              </Badge>
              <p className="mt-4 max-w-2xl text-lg prose-muted">{company.shortDescription}</p>
            </div>
          </div>
          <a
            href={company.outboundUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            Official site
          </a>
        </div>

        <section className="mt-8 card border-accent/30 bg-accent-soft/20">
          <h2 className="text-lg font-semibold">What to use instead today</h2>
          <p className="mt-2 text-sm text-ink-muted">{company.matcherAlternative.reason}</p>
          <p className="mt-3">
            <Link
              href={company.matcherAlternative.href}
              className="text-sm font-semibold text-accent hover:underline"
            >
              → {company.matcherAlternative.label}
            </Link>
          </p>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="card">
            <h2 className="text-lg font-semibold">Target use cases</h2>
            <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
              {company.targetUseCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="card">
            <h2 className="text-lg font-semibold">Details</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="font-semibold">Readiness</dt>
                <dd className="text-ink-muted">{HUMANOID_READINESS_LABELS[company.readiness]}</dd>
              </div>
              <div>
                <dt className="font-semibold">Headquarters</dt>
                <dd className="text-ink-muted">{company.headquarters}</dd>
              </div>
              <div>
                <dt className="font-semibold">Regions</dt>
                <dd className="text-ink-muted">{company.regions.join(', ')}</dd>
              </div>
            </dl>
          </section>
          <section className="card">
            <h2 className="text-lg font-semibold">Strengths</h2>
            <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
              {company.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="card">
            <h2 className="text-lg font-semibold">Limitations</h2>
            <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
              {company.limitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        {others.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold">Other humanoids we track</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {others.map((h) => (
                <li key={h.id}>
                  <Link
                    href={humanoidProfilePath(h.slug)}
                    className="font-medium text-accent hover:underline"
                  >
                    {h.name}
                  </Link>
                  <span className="ml-2 text-ink-muted">{h.productName}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10 card">
          <h2 className="text-lg font-semibold">Related</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {HUMANOID_HUB.relatedLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-medium text-accent hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-8 text-sm text-ink-muted">
          Profiles are for research only. Verify programs, pricing, and safety requirements with
          vendors directly.
        </p>
      </div>
    </>
  );
}
