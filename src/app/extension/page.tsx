import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import {
  CHROME_EXTENSION_NAME,
  CHROME_EXTENSION_STORE_URL,
  EXTENSION_SHORTCUTS,
} from '@/lib/content/extension';
import { breadcrumbJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'Chrome extension — robot matcher shortcut',
  description:
    'Install the free PickTheRobot Chrome extension to open warehouse, cleaning, and restaurant robot matchers and buyer checklists in one click. No tracking.',
  path: '/extension',
});

export default function ExtensionPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Chrome extension', path: '/extension' },
        ])}
      />

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Chrome extension' }]} />
        <p className="text-sm font-medium text-accent">Free browser shortcut</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">{CHROME_EXTENSION_NAME}</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">
          A simple launcher for PickTheRobot matchers and buyer checklists. Click the toolbar icon,
          pick a category or guide, and we open the page in a new tab — no account, no tracking, no
          host permissions.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={CHROME_EXTENSION_STORE_URL} variant="primary">
            Add to Chrome
          </ButtonLink>
          <ButtonLink href="/#tracks" variant="secondary">
            Use the web matcher
          </ButtonLink>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="card">
            <h2 className="text-lg font-semibold">What you can open</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              {EXTENSION_SHORTCUTS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-accent hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2 className="text-lg font-semibold">How it works</h2>
            <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-ink-muted">
              <li>Install the extension from the Chrome Web Store.</li>
              <li>Pin the icon from the extensions menu (puzzle piece).</li>
              <li>Click the icon and choose a matcher or checklist.</li>
              <li>PickTheRobot opens in a new tab on the page you selected.</li>
            </ol>
          </section>
        </div>

        <section className="mt-6 card">
          <h2 className="text-lg font-semibold">Privacy</h2>
          <p className="mt-3 text-sm text-ink-muted">
            The extension does not collect personal information, does not read your browsing history,
            does not use analytics SDKs, and does not request host or storage permissions beyond
            opening public picktherobot.com URLs you choose. See our{' '}
            <Link href="/privacy" className="text-accent hover:underline">
              privacy policy
            </Link>{' '}
            for the full Chrome extension section.
          </p>
        </section>

        <section className="mt-6 card border-accent/30 bg-accent-soft/20">
          <h2 className="text-lg font-semibold">Not a dealer or integrator</h2>
          <p className="mt-2 text-sm text-ink-muted">
            PickTheRobot is a buyer-side research tool. The extension is a convenience shortcut to
            our free matcher and guides — not a sales channel or data collection product.
          </p>
        </section>
      </div>
    </>
  );
}
