import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { MethodologySection } from '@/components/content/MethodologySection';
import { breadcrumbJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';
import { getBlogBrand } from '@/lib/content/blog';

export const metadata = siteMetadata({
  title: 'About PickTheRobot',
  description:
    'PickTheRobot is a buyer-side robot research tool and rules-based matcher. Learn who built it, how scoring works, and what we do and do not claim.',
  path: '/about',
});

const CONTACT_EMAIL = 'hello@picktherobot.com';

export default function AboutPage() {
  const brand = getBlogBrand();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
        <h1 className="font-display text-4xl font-semibold">About PickTheRobot</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">
          PickTheRobot is a buyer-side research product with two tracks: home robot vacuums, and
          warehouse, commercial cleaning, and restaurant automation. We help you structure a robot
          decision — constraints, type or model, and a shortlist — before you buy or talk to sales.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="card">
            <h2 className="text-lg font-semibold">What we are</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-ink-muted">
              <li>A home robot-vacuum matcher that ranks models from public specs</li>
              <li>A business matcher with documented scoring weights</li>
              <li>Buyer guides, comparisons, and blog research by topic</li>
              <li>A vendor index with outbound links to official sites</li>
              <li>A shareable results flow for internal buy-in</li>
            </ul>
          </section>
          <section className="card">
            <h2 className="text-lg font-semibold">What we are not</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-ink-muted">
              <li>Robot dealers, integrators, or deployment consultants</li>
              <li>A source of binding quotes or ROI guarantees</li>
              <li>Pay-to-win rankings — sponsorship cannot override poor fit</li>
              <li>ML black box — scoring is explicit and rules-based</li>
            </ul>
          </section>
        </div>

        <section className="mt-6 card">
          <h2 className="text-lg font-semibold">Who we are</h2>
          <p className="mt-3 text-sm text-ink-muted">{brand.bio}</p>
          <p className="mt-3 text-sm text-ink-muted">
            Our expertise is in <strong className="font-medium text-ink">decision structure</strong>{' '}
            — mapping how buyers evaluate robots — not in claiming on-site deployment experience we
            do not have.
          </p>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <MethodologySection />
          <section className="card">
            <h2 className="text-lg font-semibold">Editorial standards</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-ink-muted">
              <li>
                Blog and guide price ranges are illustrative — useful for budgeting, not vendor
                quotes
              </li>
              <li>We cite common market discussions; you should confirm numbers on every deal</li>
              <li>Vendor profiles reflect public positioning — verify specs with the vendor</li>
              <li>We update content when categories or acquisition models shift materially</li>
            </ul>
            <p className="mt-4 text-sm">
              <Link href="/blog" className="font-medium text-accent hover:underline">
                Read the blog
              </Link>
              {' · '}
              <Link href="/privacy" className="font-medium text-accent hover:underline">
                Privacy policy
              </Link>
            </p>
          </section>
        </div>

        <section className="mt-6 card border-accent/30 bg-accent-soft/20">
          <h2 className="text-lg font-semibold">Monetization &amp; disclosure</h2>
          <p className="mt-2 text-sm text-ink-muted">
            The matchers are free. We may earn revenue from outbound vendor traffic or home-product
            retailer links — through affiliate or referral links, or disclosed sponsored placements when
            partnerships exist. Affiliate status does not change scores. Sponsored business vendors
            receive a small score boost only when they already match your profile; they cannot buy their
            way to the top of an irrelevant shortlist.
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Vendor or partnership questions:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
              {CONTACT_EMAIL}
            </a>
            . Developers can embed the matcher via the{' '}
            <Link href="/api" className="text-accent hover:underline">
              API
            </Link>
            .
          </p>
        </section>

        <section className="mt-8 card">
          <h2 className="text-lg font-semibold">Try the matcher</h2>
          <p className="mt-2 text-sm text-ink-muted">
            The fastest way to see how PickTheRobot works is to pick a track — home robot vacuums, or
            warehouse / commercial cleaning / restaurant — then answer a short wizard.
          </p>
          <p className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/#tracks"
              className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Choose a track
            </Link>
            <Link
              href="/robot-vacuums#matcher"
              className="inline-flex rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:border-accent/40"
            >
              Robot vacuums
            </Link>
          </p>
        </section>

        <p className="mt-8 text-sm text-ink-muted">
          Questions or corrections?{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </>
  );
}
