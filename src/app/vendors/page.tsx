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
import { CATEGORY_ROUTES } from '@/lib/content/navigation';
import { ROBOT_TYPE_LABELS, type RobotCategory } from '@/lib/matching';
import { getVendorsByCategory } from '@/lib/matching/vendors';
import { breadcrumbJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

const CATEGORIES: RobotCategory[] = ['warehouse', 'cleaning', 'restaurant'];

export const metadata = siteMetadata({
  title: 'Robot vendors — warehouse, cleaning, and restaurant',
  description:
    'Browse robot vendors for warehouse AMRs, cleaning scrubbers, and restaurant service robots. Profiles, acquisition models, and outbound links.',
  path: '/vendors',
});

export default function VendorsIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Vendors', path: '/vendors' },
        ])}
      />

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Vendors' }]} />
        <h1 className="font-display text-4xl font-semibold">Robot vendors</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">
          Profiles for vendors in our matcher dataset — warehouse, cleaning, and restaurant robotics.
          Run the matcher for ranked recommendations, or browse by category below.
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

          <section id="humanoids" className="scroll-mt-8 border-t border-surface-border pt-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">Humanoid robots (Track)</h2>
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
