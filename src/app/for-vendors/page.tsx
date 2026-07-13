import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { breadcrumbJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'List your robot on PickTheRobot',
  description:
    'Reach warehouse, cleaning, and restaurant operators researching robots. Partner with PickTheRobot for outbound traffic and category-fit visibility.',
  path: '/for-vendors',
});

const CONTACT_EMAIL = 'hello@picktherobot.com';

export default function ForVendorsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'For vendors', path: '/for-vendors' },
        ])}
      />

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'For vendors' }]} />
        <h1 className="font-display text-4xl font-semibold">List your robot on PickTheRobot</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">
          PickTheRobot is a buyer-side matcher for warehouse, cleaning, and restaurant operators.
          We rank robot types and vendors from facility inputs — no pay-to-win placement.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <section className="card">
            <h2 className="text-lg font-semibold">Who visits</h2>
            <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
              <li>Operations and facilities teams researching automation</li>
              <li>Buyers comparing buy, lease, and RaaS models</li>
              <li>US, EU, and UK traffic (growing organic search)</li>
            </ul>
          </section>
          <section className="card">
            <h2 className="text-lg font-semibold">What we offer partners</h2>
            <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
              <li>Category-fit vendor profile with outbound tracking (UTM)</li>
              <li>Optional sponsored boost only when already relevant</li>
              <li>Affiliate URL support when partnerships are active</li>
            </ul>
          </section>
        </div>

        <section className="mt-8 card border-accent/30 bg-accent-soft/20">
          <h2 className="text-lg font-semibold">Get in touch</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Tell us your robot types, regions, and acquisition models. We&apos;ll review fit for the
            matcher and update your profile.
          </p>
          <p className="mt-4">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=PickTheRobot%20vendor%20listing`}
              className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Email {CONTACT_EMAIL}
            </a>
          </p>
        </section>

        <p className="mt-8 text-sm text-ink-muted">
          Browse current listings on the{' '}
          <Link href="/vendors" className="text-accent hover:underline">
            vendor index
          </Link>
          .
        </p>
      </div>
    </>
  );
}
