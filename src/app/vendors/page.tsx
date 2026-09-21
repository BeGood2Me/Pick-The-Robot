import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { VendorMonogram } from '@/components/brand/VendorMonogram';
import { Badge } from '@/components/ui/Badge';
import { CATEGORY_CONTENT } from '@/lib/content/categories';
import {
  getAllHumanoids,
  HUMANOID_HUB_PATH,
  HUMANOID_READINESS_LABELS,
  humanoidProfilePath,
} from '@/lib/content/humanoids';
import { ROBOT_VACUUMS_PATH } from '@/lib/content/home-vacuums';
import { CATEGORY_ROUTES } from '@/lib/content/navigation';
import { getHomeVacuumBrands } from '@/lib/home-vacuums';
import { ROBOT_TYPE_LABELS, type RobotCategory } from '@/lib/matching';
import { getVendorsByCategory } from '@/lib/matching/vendors';
import { breadcrumbJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

const CATEGORIES: RobotCategory[] = ['warehouse', 'cleaning', 'restaurant'];

export const metadata = siteMetadata({
  title: 'Robot vendors: warehouse, cleaning, restaurants & home vacuums',
  description:
    'Compare deployable robot vendors — AMR, scrubbers, serving robots — plus robot vacuum brands in our home matcher. Profiles and shortlists; not fleet management software.',
  path: '/vendors',
});

export default function VendorsIndexPage() {
  const vacuumBrands = getHomeVacuumBrands();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Directory', path: '/vendors' },
        ])}
      />

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Directory' }]} />
        <h1 className="font-display text-4xl font-semibold">Robot vendor directory</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">
          Business vendors in our matcher dataset for warehouse, cleaning, and restaurant robotics,
          plus robot vacuum brands from the home matcher catalog. Run a matcher for ranked
          recommendations, or browse below.
        </p>

        <div className="mt-10 space-y-12">
          {CATEGORIES.map((category) => {
            const vendors = getVendorsByCategory(category);
            const content = CATEGORY_CONTENT[category];
            const categoryPath = CATEGORY_ROUTES[category];

            return (
              <section key={category} id={category} className="scroll-mt-8">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold">{content.h1}</h2>
                    <p className="mt-1 text-sm text-ink-muted">{vendors.length} vendors in dataset</p>
                  </div>
                  <Link
                    href={categoryPath}
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    Category guide & matcher
                  </Link>
                </div>

                <div className="mt-6 space-y-4">
                  {vendors.map((vendor) => (
                    <article
                      key={vendor.id}
                      className="card flex flex-wrap items-center justify-between gap-4"
                    >
                      <div className="flex min-w-0 gap-3">
                        <VendorMonogram
                          name={vendor.name}
                          sponsored={vendor.sponsored}
                          logoUrl={vendor.logoUrl}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/vendors/${vendor.slug}`}
                            className="text-lg font-semibold hover:text-accent"
                          >
                            {vendor.name}
                          </Link>
                          <p className="mt-1 text-sm text-ink-muted">{vendor.shortDescription}</p>
                          <p className="mt-1 text-xs text-ink-faint">
                            {vendor.robotTypes.map((t) => ROBOT_TYPE_LABELS[t]).join(' · ')}
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
                        className="shrink-0 text-sm font-semibold text-accent hover:underline"
                      >
                        View profile
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}

          <section id="robot-vacuums" className="scroll-mt-8 border-t border-surface-border pt-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">Robot vacuum brands</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  {vacuumBrands.length} brands in the home matcher catalog — product SKUs, not B2B
                  vendors
                </p>
              </div>
              <Link
                href={`${ROBOT_VACUUMS_PATH}#matcher`}
                className="text-sm font-medium text-accent hover:underline"
              >
                Robot vacuum matcher
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {vacuumBrands.map((brand) => (
                <article
                  key={brand.name}
                  className="card flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex min-w-0 gap-3">
                    <VendorMonogram name={brand.name} size="sm" />
                    <div className="min-w-0">
                      <a
                        href={brand.outboundUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold hover:text-accent"
                      >
                        {brand.name}
                      </a>
                      <p className="mt-1 text-sm text-ink-muted">
                        {brand.modelCount} model{brand.modelCount === 1 ? '' : 's'} in matcher:{' '}
                        {brand.modelNames.join(', ')}
                      </p>
                    </div>
                  </div>
                  <a
                    href={brand.outboundUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-sm font-semibold text-accent hover:underline"
                  >
                    Brand site
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section id="humanoids" className="scroll-mt-8 border-t border-surface-border pt-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">Humanoid robots</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Research profiles — not in matcher scoring
                </p>
              </div>
              <Link
                href={HUMANOID_HUB_PATH}
                className="text-sm font-medium text-accent hover:underline"
              >
                Humanoid hub
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {getAllHumanoids().map((company) => (
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
        </div>
      </div>
    </>
  );
}
