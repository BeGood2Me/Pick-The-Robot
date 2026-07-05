import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ComparisonMatcherCta } from '@/components/matching/ComparisonMatcherCta';
import { ComparisonTable } from '@/components/content/ComparisonTable';
import { FaqBlock } from '@/components/content/FaqBlock';
import { COMPARISONS } from '@/lib/content/comparisons';
import { breadcrumbJsonLd, faqJsonLd, articleJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export function generateStaticParams() {
  return Object.keys(COMPARISONS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = COMPARISONS[slug];
  if (!page) return {};
  return siteMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/${slug}`,
    ogImage: `/${slug}/opengraph-image`,
  });
}

export default async function ComparisonPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = COMPARISONS[slug];
  if (!page) notFound();

  const labels =
    slug === 'amr-vs-agv'
      ? ['AMR', 'AGV']
      : slug === 'cleaning-robot-vs-cleaning-staff'
        ? ['Cleaning robot', 'Cleaning staff']
        : ['Serving robot', 'Runner staff'];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: page.h1, path: `/${slug}` },
        ])}
      />
      <JsonLd data={faqJsonLd(page.faqs)} />
      <JsonLd
        data={articleJsonLd({
          title: page.title,
          description: page.metaDescription,
          path: `/${slug}`,
        })}
      />

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: page.h1 }]} />
        <h1 className="font-display text-4xl font-semibold">{page.h1}</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">{page.intro}</p>

        <Suspense fallback={null}>
          <ComparisonMatcherCta category={page.matcherCategory} />
        </Suspense>

        <section className="mt-10">
          <ComparisonTable optionALabel={labels[0]} optionBLabel={labels[1]} rows={page.rows} />
        </section>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <section className="card">
            <h2 className="font-semibold">Choose {labels[0]} when</h2>
            <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
              {page.whenA.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="card">
            <h2 className="font-semibold">Choose {labels[1]} when</h2>
            <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
              {page.whenB.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-10 card">
          <h2 className="font-semibold">Related</h2>
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
          <FaqBlock items={page.faqs} />
        </div>
      </div>
    </>
  );
}
