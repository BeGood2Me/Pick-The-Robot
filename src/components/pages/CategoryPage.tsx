import { Suspense } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { StickyMatcherCta } from '@/components/layout/StickyMatcherCta';
import { FaqBlock } from '@/components/content/FaqBlock';
import { MatcherSkeleton } from '@/components/matching/MatcherSkeleton';
import { MatchingTool } from '@/components/matching/MatchingTool';
import { VendorMonogram } from '@/components/brand/VendorMonogram';
import { Badge } from '@/components/ui/Badge';
import { CATEGORY_CONTENT, ROBOT_TYPE_INFO } from '@/lib/content/categories';
import { CATEGORY_COMPARISON_LINKS, CATEGORY_ROUTES } from '@/lib/content/navigation';
import { ROBOT_TYPE_LABELS, type RobotCategory, type RobotType } from '@/lib/matching';
import { getVendorsByCategory } from '@/lib/matching/vendors';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

const ROBOT_TYPES_BY_CATEGORY: Record<RobotCategory, RobotType[]> = {
  warehouse: ['amr', 'agv', 'picking_assist', 'pallet_mover'],
  cleaning: ['office_cleaner', 'large_scrubber', 'industrial_cleaner'],
  restaurant: ['serving_robot', 'bussing_robot', 'kitchen_automation', 'reception_robot'],
};

export function CategoryPage({ category }: { category: RobotCategory }) {
  const content = CATEGORY_CONTENT[category];
  const path = CATEGORY_ROUTES[category];
  const vendors = getVendorsByCategory(category);
  const comparisons = CATEGORY_COMPARISON_LINKS[category];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: content.h1, path },
        ])}
      />
      <JsonLd data={faqJsonLd(content.faqs)} />

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: content.h1 }]} />
        <h1 className="font-display text-4xl font-semibold">{content.h1}</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">{content.intro}</p>

        <section id="matcher" className="mt-8 scroll-mt-8 border-y border-surface-border py-8">
          <h2 className="text-xl font-semibold">Match your operation</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Category-specific questions → robot type, acquisition model, ranked vendors.
          </p>
          <div className="mt-4">
            <Suspense fallback={<MatcherSkeleton />}>
              <MatchingTool initialCategory={category} />
            </Suspense>
          </div>
        </section>

        <StickyMatcherCta href="#matcher" />

        <div id="guide" className="scroll-mt-8">
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Robot types</h2>
          <p className="mt-2 prose-muted">{content.robotTypesIntro}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {ROBOT_TYPES_BY_CATEGORY[category].map((type) => {
              const info = ROBOT_TYPE_INFO[type];
              return (
                <article key={type} className="card">
                  <h3 className="font-semibold">{ROBOT_TYPE_LABELS[type]}</h3>
                  <p className="mt-2 text-sm font-medium text-ink">Best for</p>
                  <ul className="mt-1 list-inside list-disc text-sm text-ink-muted">
                    {info.bestFor.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm font-medium text-ink">Not ideal if</p>
                  <ul className="mt-1 list-inside list-disc text-sm text-ink-muted">
                    {info.notIdealIf.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12 card">
          <h2 className="text-xl font-semibold">Buy, lease, or RaaS?</h2>
          <p className="mt-2 prose-muted">{content.acquisitionIntro}</p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold">Related guides</h2>
          <ul className="mt-4 space-y-3">
            {comparisons.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-medium text-accent hover:underline">
                  {link.label}
                </Link>
                <span className="mt-0.5 block text-sm text-ink-muted">{link.blurb}</span>
              </li>
            ))}
            <li>
              <Link href="/" className="font-medium text-accent hover:underline">
                Full matcher (all categories)
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Vendors in this category</h2>
          <div className="mt-4 space-y-4">
            {vendors.map((vendor) => (
              <article key={vendor.id} className="card flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-3">
                  <VendorMonogram
                    name={vendor.name}
                    sponsored={vendor.sponsored}
                    logoUrl={vendor.logoUrl}
                    size="sm"
                  />
                  <div>
                    <Link href={`/vendors/${vendor.slug}`} className="text-lg font-semibold hover:text-accent">
                      {vendor.name}
                    </Link>
                  <p className="mt-1 text-sm text-ink-muted">{vendor.shortDescription}</p>
                  <p className="mt-1 text-xs text-ink-faint">
                    {vendor.acquisitionModelsSupported.join(' · ')} ·{' '}
                    {vendor.deploymentComplexity} deployment
                  </p>
                  {vendor.sponsored && (
                    <Badge variant="sponsored" className="mt-2">
                      Sponsored
                    </Badge>
                  )}
                  </div>
                </div>
                <Link
                  href={`/vendors/${vendor.slug}`}
                  className="text-sm font-semibold text-accent hover:underline"
                >
                  View profile
                </Link>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-12">
          <FaqBlock items={content.faqs} />
        </div>
        </div>
      </div>
    </>
  );
}

export function categoryMetadata(category: RobotCategory) {
  const content = CATEGORY_CONTENT[category];
  const path = CATEGORY_ROUTES[category];
  return siteMetadata({
    title: content.title,
    description: content.metaDescription,
    path,
    ogImage: `${path}/opengraph-image`,
  });
}
