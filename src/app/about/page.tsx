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
          PickTheRobot is a buyer-side research product for warehouse, cleaning, and restaurant
          automation. We help teams structure a robot decision — type, acquisition model, and vendor
          shortlist — before talking to sales.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="card">
            <h2 className="text-lg font-semibold">What we are</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-ink-muted">
              <li>A rules-based matcher with documented scoring weights</li>
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
            The matcher is free. We may earn revenue from outbound vendor traffic in the future —
            through referral links or disclosed sponsored placements when partnerships exist.
            Sponsored vendors receive a small score boost only when they already match your profile;
            they cannot buy their way to the top of an irrelevant shortlist.
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Vendors can reach us at{' '}
            <Link href="/for-vendors" className="text-accent hover:underline">
              /for-vendors
            </Link>
            .
          </p>
        </section>

        <section className="mt-8 card">
          <h2 className="text-lg font-semibold">Try the matcher</h2>
          <p className="mt-2 text-sm text-ink-muted">
            The fastest way to see how PickTheRobot works is to run a match for your category —
            about two minutes of facility inputs, then ranked robot types, acquisition model, and
            vendors.
          </p>
          <p className="mt-4">
            <Link
              href="/#matcher"
              className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Run the matcher
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
