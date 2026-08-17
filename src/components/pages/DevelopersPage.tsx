import Link from 'next/link';
import { ApiCheckoutButton } from '@/components/developers/ApiCheckoutButton';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  API_ENDPOINTS,
  API_FAQS,
  API_REFERENCE_PATH,
  API_TIER_CARDS,
  DEVELOPERS_PATH,
  OPENAPI_JSON_PATH,
} from '@/lib/content/developers';
import { breadcrumbJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';

const PRIMARY_BUTTON_CLASS =
  'inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60';

function TierCta({ plan }: { plan: (typeof API_TIER_CARDS)[number] }) {
  const buttonClass = `w-full justify-center ${PRIMARY_BUTTON_CLASS}`;

  return (
    <div className="mt-6">
      <ApiCheckoutButton tier={plan.tier} className={buttonClass}>
        {plan.cta}
      </ApiCheckoutButton>
    </div>
  );
}

export function DevelopersPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Developers', path: DEVELOPERS_PATH },
        ])}
      />

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Developers' }]} />

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Developer API</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">
            Embed robot recommendations in your product
          </h1>
          <p className="mt-4 text-lg prose-muted">
            The same rules-based matcher that powers PickTheRobot.com — warehouse, cleaning, and
            restaurant categories. Send facility inputs, get robot type fit, acquisition guidance,
            ranked vendors, and tracked outbound links.
          </p>
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Pricing</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            Paid API access. Start with Starter for pilots, upgrade to Pro for higher volume and
            richer response fields. Each subscription includes one API key with its own monthly
            quota — subscribe again for separate keys (e.g. dev and production).
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {API_TIER_CARDS.map((plan) => (
              <article
                key={plan.tier}
                className={`card flex flex-col ${
                  plan.highlighted ? 'border-accent/40 ring-1 ring-accent/20' : ''
                }`}
              >
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-2 font-display text-3xl font-semibold">{plan.price}</p>
                  <p className="mt-1 text-sm text-ink-muted">{plan.priceDetail}</p>
                </div>
                <ul className="mt-5 flex-1 space-y-2 text-sm text-ink-muted">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="text-accent" aria-hidden>
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <TierCta plan={plan} />
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 card">
          <h2 className="text-lg font-semibold">Quick start</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Every request requires an API key. Subscribe, copy your key from the success page, then
            send a flat JSON body with category-specific wizard fields (see{' '}
            <code className="rounded bg-surface-soft px-1 py-0.5 text-xs">scripts/api-samples/</code>
            ).
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-ink p-4 text-xs text-surface-soft">
            <code>{`curl -X POST https://picktherobot.com/api/v1/match \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ptr_starter_your_key_here" \\
  --data-binary "@match-cleaning.json"`}</code>
          </pre>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Endpoints</h2>
          <div className="mt-4 grid gap-3">
            {API_ENDPOINTS.map((endpoint) => (
              <div
                key={endpoint.path}
                className="card flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-mono text-sm">
                    <span className="rounded bg-surface-soft px-2 py-0.5 font-semibold text-accent">
                      {endpoint.method}
                    </span>{' '}
                    <span className="text-ink">{endpoint.path}</span>
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">{endpoint.summary}</p>
                </div>
                {endpoint.path === OPENAPI_JSON_PATH && (
                  <Link
                    href={API_REFERENCE_PATH}
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    View reference
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">FAQ</h2>
          <dl className="mt-4 space-y-6">
            {API_FAQS.map((item) => (
              <div key={item.question} className="card">
                <dt className="font-semibold text-ink">{item.question}</dt>
                <dd className="mt-2 text-sm text-ink-muted">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12 card border-accent/30 bg-accent-soft/20">
          <h2 className="text-lg font-semibold">Ready to integrate?</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Pick a plan, get your API key, and explore the OpenAPI spec.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={API_REFERENCE_PATH} className={PRIMARY_BUTTON_CLASS}>
              Open API reference
            </Link>
            <ApiCheckoutButton tier="starter" className={PRIMARY_BUTTON_CLASS}>
              Starter — $49/mo
            </ApiCheckoutButton>
            <ApiCheckoutButton tier="pro" className={PRIMARY_BUTTON_CLASS}>
              Pro — $149/mo
            </ApiCheckoutButton>
          </div>
        </section>

        <p className="mt-8 text-sm text-ink-muted">
          Listing a robot on the matcher? See{' '}
          <Link href="/for-vendors" className="text-accent hover:underline">
            For vendors
          </Link>
          .
        </p>
      </div>
    </>
  );
}
