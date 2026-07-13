import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { StickyMatcherCta } from '@/components/layout/StickyMatcherCta';
import { FaqBlock } from '@/components/content/FaqBlock';
import { GUIDE_PAGES, type GuidePageContent } from '@/lib/content/guides';
import { CATEGORY_ROUTES } from '@/lib/content/navigation';
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

type GuideKey = keyof typeof GUIDE_PAGES;

function GuidePageContent({ pageKey }: { pageKey: GuideKey }) {
  const page = GUIDE_PAGES[pageKey];
  const path = `/${pageKey}`;
  const matcherHref = page.matcherCategory
    ? `${CATEGORY_ROUTES[page.matcherCategory]}#matcher`
    : '/#matcher';

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: page.h1, path },
        ])}
      />
      <JsonLd data={faqJsonLd([...page.faqs])} />
      <JsonLd
        data={articleJsonLd({
          title: page.title,
          description: page.metaDescription,
          path,
        })}
      />

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: page.h1 }]} />
        <h1 className="font-display text-4xl font-semibold">{page.h1}</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">{page.intro}</p>

        <section className="mt-8 card border-accent/30 bg-accent-soft/20">
          <h2 className="text-lg font-semibold">Get a recommendation for your operation</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Answer a few questions about your facility — we&apos;ll rank robot types, acquisition
            models, and vendors from your inputs.
          </p>
          <p className="mt-4">
            <Link
              href={matcherHref}
              className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Run the matcher
            </Link>
          </p>
        </section>

        <StickyMatcherCta href={matcherHref} />

        <div className="mt-10 space-y-6">
          {page.sections.map((section) => (
            <section key={section.heading} className="card">
              <h2 className="text-lg font-semibold">{section.heading}</h2>
              {section.paragraphs?.map((p) => (
                <p key={p} className="mt-3 text-sm text-ink-muted">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="mt-10 card">
          <h2 className="font-semibold">Related guides</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {page.relatedLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-accent hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <FaqBlock items={[...page.faqs]} />
        </div>
      </div>
    </>
  );
}

export function guideMetadata(pageKey: GuideKey) {
  const page = GUIDE_PAGES[pageKey];
  return siteMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/${pageKey}`,
    ogImage: `/${pageKey}/opengraph-image`,
  });
}

export function RaasPricingPage() {
  return <GuidePageContent pageKey="raas-pricing" />;
}

export function WarehouseRobotCostPage() {
  return <GuidePageContent pageKey="warehouse-robot-cost" />;
}

export function CleaningRobotCostPage() {
  return <GuidePageContent pageKey="cleaning-robot-cost" />;
}

export function CleaningRobotsAsAServicePage() {
  return <GuidePageContent pageKey="cleaning-robots-as-a-service" />;
}

export function getGuidePage(slug: string): GuidePageContent | undefined {
  return GUIDE_PAGES[slug];
}
