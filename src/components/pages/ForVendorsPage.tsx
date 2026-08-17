import Link from 'next/link';
import { FaqBlock } from '@/components/content/FaqBlock';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { VendorSubscribeSection } from '@/components/vendor/VendorSubscribeSection';
import {
  FOR_VENDORS_LOGIN_PATH,
  FOR_VENDORS_PATH,
  FOR_VENDORS_PORTAL_PATH,
  VENDOR_FAQS,
  VENDOR_TIER_CARDS,
  VENDOR_VALUE_PROPS,
  VENDOR_VISIBILITY_SURFACES,
  type VendorTierCard,
} from '@/lib/content/for-vendors';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';

const PRIMARY_BUTTON_CLASS =
  'inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover';

function tierStatusBadge(tier: VendorTierCard) {
  if (tier.id === 'sponsored') return <Badge variant="default">Add-on</Badge>;
  return <Badge variant="success">Available</Badge>;
}

export function ForVendorsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'For vendors', path: FOR_VENDORS_PATH },
        ])}
      />
      <JsonLd data={faqJsonLd(VENDOR_FAQS)} />

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'For vendors' }]} />

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Vendor partnerships</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">
            Put your robots in front of buyers who are ready to shortlist
          </h1>
          <p className="mt-4 text-lg prose-muted">
            PickTheRobot sends warehouse, cleaning, and restaurant operators through a scored matcher
            — then ranks vendors that fit their robot type, region, and acquisition model. Subscribe
            for directory presence, matcher placement, click reporting, and a vendor portal.
          </p>
          <p className="mt-6 flex flex-wrap gap-4">
            <a href="#subscribe" className={PRIMARY_BUTTON_CLASS}>
              Subscribe
            </a>
            <Link href={FOR_VENDORS_LOGIN_PATH} className="text-sm font-semibold text-accent hover:underline self-center">
              Vendor login
            </Link>
            <Link href={FOR_VENDORS_PORTAL_PATH} className="text-sm font-semibold text-ink-muted hover:text-ink self-center">
              Portal
            </Link>
          </p>
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Why vendors partner with us</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {VENDOR_VALUE_PROPS.map((prop) => (
              <article key={prop.title} className="card">
                <h3 className="text-lg font-semibold">{prop.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{prop.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Where your brand shows up</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {VENDOR_VISIBILITY_SURFACES.map((surface) => (
              <article key={surface.title} className="card">
                <h3 className="text-lg font-semibold">{surface.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{surface.summary}</p>
                <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-ink-muted">
                  {surface.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm font-medium text-ink">{surface.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Partnership tiers</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {VENDOR_TIER_CARDS.map((tier) => (
              <article
                key={tier.id}
                className={`card flex flex-col ${
                  tier.highlighted ? 'border-accent/40 ring-1 ring-accent/20' : ''
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold">{tier.name}</h3>
                  {tierStatusBadge(tier)}
                </div>
                <p className="mt-2 font-display text-3xl font-semibold">{tier.price}</p>
                <p className="mt-1 text-sm text-ink-muted">{tier.priceDetail}</p>
                <ul className="mt-5 flex-1 space-y-2 text-sm text-ink-muted">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="text-accent" aria-hidden>
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <div id="subscribe" className="mt-12 scroll-mt-8">
          <VendorSubscribeSection />
        </div>

        <section className="mt-12">
          <FaqBlock items={VENDOR_FAQS} title="Partnership questions" defaultOpen={null} />
        </section>

        <p className="mt-8 text-sm text-ink-muted">
          Browse the{' '}
          <Link href="/vendors" className="text-accent hover:underline">
            vendor directory
          </Link>
          . Scoring rules:{' '}
          <Link href="/methodology" className="text-accent hover:underline">
            methodology
          </Link>
          .
        </p>
      </div>
    </>
  );
}
