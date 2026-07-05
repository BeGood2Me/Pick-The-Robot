import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { VendorMonogram } from '@/components/brand/VendorMonogram';
import { Badge } from '@/components/ui/Badge';
import { VendorOutboundButton } from '@/components/matching/VendorOutboundButton';
import { CATEGORY_CONTENT } from '@/lib/content/categories';
import { CATEGORY_COMPARISON_LINKS, CATEGORY_ROUTES } from '@/lib/content/navigation';
import { ROBOT_TYPE_LABELS } from '@/lib/matching';
import { VENDORS, getVendorBySlug, getVendorsByCategory } from '@/lib/matching/vendors';
import { breadcrumbJsonLd, vendorOrganizationJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export function generateStaticParams() {
  return VENDORS.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vendor = getVendorBySlug(slug);
  if (!vendor) return {};
  return siteMetadata({
    title: `${vendor.name} — robot vendor profile`,
    description: vendor.shortDescription,
    path: `/vendors/${slug}`,
  });
}

export default async function VendorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vendor = getVendorBySlug(slug);
  if (!vendor) notFound();

  const category = vendor.categories[0];
  const categoryPath = CATEGORY_ROUTES[category];
  const categoryLabel = CATEGORY_CONTENT[category].h1;
  const relatedVendors = getVendorsByCategory(category)
    .filter((v) => v.id !== vendor.id)
    .slice(0, 4);
  const relatedGuides = CATEGORY_COMPARISON_LINKS[category].slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: categoryLabel, path: categoryPath },
          { name: vendor.name, path: `/vendors/${slug}` },
        ])}
      />
      <JsonLd data={vendorOrganizationJsonLd(vendor)} />

      <div className="container-page py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: categoryLabel, href: categoryPath },
            { label: vendor.name },
          ]}
        />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-4">
            <VendorMonogram
              name={vendor.name}
              sponsored={vendor.sponsored}
              logoUrl={vendor.logoUrl}
            />
            <div>
              <h1 className="font-display text-4xl font-semibold">{vendor.name}</h1>
              {vendor.sponsored && (
                <Badge variant="sponsored" className="mt-2">
                  Sponsored listing
                </Badge>
              )}
              <p className="mt-4 max-w-2xl text-lg prose-muted">{vendor.shortDescription}</p>
            </div>
          </div>
          <VendorOutboundButton vendor={vendor} context="vendor-page" />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="card">
            <h2 className="text-lg font-semibold">Best for</h2>
            <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
              {vendor.bestFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="card">
            <h2 className="text-lg font-semibold">Strengths</h2>
            <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
              {vendor.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="card">
            <h2 className="text-lg font-semibold">Limitations</h2>
            <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
              {vendor.limitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="card">
            <h2 className="text-lg font-semibold">Details</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="font-semibold">Robot types</dt>
                <dd className="text-ink-muted">
                  {vendor.robotTypes.map((t) => ROBOT_TYPE_LABELS[t]).join(', ')}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Acquisition models</dt>
                <dd className="text-ink-muted">{vendor.acquisitionModelsSupported.join(', ')}</dd>
              </div>
              <div>
                <dt className="font-semibold">Regions</dt>
                <dd className="text-ink-muted">{vendor.regions.join(', ')}</dd>
              </div>
              <div>
                <dt className="font-semibold">Deployment complexity</dt>
                <dd className="text-ink-muted">{vendor.deploymentComplexity}</dd>
              </div>
            </dl>
          </section>
        </div>

        {relatedVendors.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold">Other {categoryLabel.toLowerCase()} vendors</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {relatedVendors.map((v) => (
                <li key={v.id}>
                  <Link href={`/vendors/${v.slug}`} className="font-medium text-accent hover:underline">
                    {v.name}
                  </Link>
                  <span className="ml-2 text-ink-muted">{v.shortDescription}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10 card">
          <h2 className="text-lg font-semibold">Related guides</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {relatedGuides.map((guide) => (
              <li key={guide.href}>
                <Link href={guide.href} className="font-medium text-accent hover:underline">
                  {guide.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={categoryPath} className="font-medium text-accent hover:underline">
                {categoryLabel} matcher
              </Link>
            </li>
          </ul>
        </section>

        <p className="mt-8 text-sm text-ink-muted">
          <Link href={categoryPath} className="font-medium text-accent hover:underline">
            Back to {categoryLabel}
          </Link>
          {' · '}
          <Link href="/" className="font-medium text-accent hover:underline">
            Run full matcher
          </Link>
        </p>
      </div>
    </>
  );
}
