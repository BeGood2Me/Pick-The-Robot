import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { API_TIER_LIMITS } from '@/lib/api/tierLimits';
import {
  API_REFERENCE_PATH,
  DEVELOPERS_PATH,
  OPENAPI_JSON_PATH,
} from '@/lib/content/developers';
import { breadcrumbJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';

function MethodBadge({ method }: { method: string }) {
  return (
    <span className="rounded bg-surface-soft px-2 py-0.5 font-mono text-xs font-semibold text-accent">
      {method}
    </span>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-lg bg-ink p-4 text-xs text-surface-soft">
      <code>{children}</code>
    </pre>
  );
}

export function DevelopersReferencePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Developers', path: DEVELOPERS_PATH },
          { name: 'API reference', path: API_REFERENCE_PATH },
        ])}
      />

      <div className="container-page py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Developers', href: DEVELOPERS_PATH },
            { label: 'API reference' },
          ]}
        />

        <div className="max-w-3xl">
          <h1 className="font-display text-4xl font-semibold">API reference</h1>
          <p className="mt-4 text-lg prose-muted">
            REST API for the PickTheRobot matcher. All endpoints require a valid API key from a
            Starter or Pro subscription.
          </p>
          <p className="mt-3 text-sm text-ink-muted">
            Base URL:{' '}
            <code className="rounded bg-surface-soft px-1.5 py-0.5 text-xs">/api/v1</code> ·{' '}
            <a href={OPENAPI_JSON_PATH} className="text-accent hover:underline">
              Download OpenAPI JSON
            </a>
          </p>
        </div>

        <section className="mt-12 card max-w-3xl">
          <h2 className="text-lg font-semibold">Authentication</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Send your API key on every request using{' '}
            <code className="rounded bg-surface-soft px-1 py-0.5 text-xs">X-API-Key</code> or{' '}
            <code className="rounded bg-surface-soft px-1 py-0.5 text-xs">
              Authorization: Bearer &lt;key&gt;
            </code>
            .
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Missing or invalid keys return <code className="text-xs">401</code>. Rate limits and
            monthly match quotas return <code className="text-xs">429</code> with{' '}
            <code className="text-xs">Retry-After</code> and usage headers.
          </p>
        </section>

        <section className="mt-8 card max-w-3xl">
          <h2 className="text-lg font-semibold">Tier limits</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-surface-border text-ink-muted">
                  <th className="pb-2 pr-4 font-medium">Limit</th>
                  <th className="pb-2 pr-4 font-medium">Starter</th>
                  <th className="pb-2 font-medium">Pro</th>
                </tr>
              </thead>
              <tbody className="text-ink-muted">
                <tr className="border-b border-surface-border/60">
                  <td className="py-2 pr-4">Match calls / month</td>
                  <td className="py-2 pr-4">{API_TIER_LIMITS.starter.matchesPerMonth.toLocaleString()}</td>
                  <td className="py-2">{API_TIER_LIMITS.pro.matchesPerMonth.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-surface-border/60">
                  <td className="py-2 pr-4">Requests / minute</td>
                  <td className="py-2 pr-4">{API_TIER_LIMITS.starter.requestsPerMinute}</td>
                  <td className="py-2">{API_TIER_LIMITS.pro.requestsPerMinute}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Vendors per match</td>
                  <td className="py-2 pr-4">{API_TIER_LIMITS.starter.maxVendors}</td>
                  <td className="py-2">{API_TIER_LIMITS.pro.maxVendors}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 max-w-3xl">
          <article className="card">
            <div className="flex flex-wrap items-center gap-2">
              <MethodBadge method="POST" />
              <code className="font-mono text-sm">/api/v1/match</code>
            </div>
            <p className="mt-3 text-sm text-ink-muted">
              Run the matcher. Send a flat JSON body with <code className="text-xs">category</code>{' '}
              plus category-specific wizard fields (warehouse, cleaning, or restaurant).
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Returns robot type fit, acquisition guidance, ranked vendors with tracked{' '}
              <code className="text-xs">clickUrl</code> values, and cleaning ROI on cleaning
              matches. Pro includes runner-up matches and extended vendor fields.
            </p>
            <CodeBlock>{`curl -X POST https://picktherobot.com/api/v1/match \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_KEY" \\
  --data-binary "@match-cleaning.json"`}</CodeBlock>
          </article>

          <article className="card mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <MethodBadge method="GET" />
              <code className="font-mono text-sm">/api/v1/vendors</code>
            </div>
            <p className="mt-3 text-sm text-ink-muted">
              Browse the vendor catalog. Requires <code className="text-xs">category</code> query
              param (<code className="text-xs">warehouse</code>,{' '}
              <code className="text-xs">cleaning</code>, or{' '}
              <code className="text-xs">restaurant</code>). Optional{' '}
              <code className="text-xs">region</code> (default <code className="text-xs">US</code>
              ).
            </p>
            <CodeBlock>{`curl "https://picktherobot.com/api/v1/vendors?category=cleaning&region=US" \\
  -H "X-API-Key: YOUR_KEY"`}</CodeBlock>
          </article>

          <article className="card mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <MethodBadge method="GET" />
              <code className="font-mono text-sm">{OPENAPI_JSON_PATH}</code>
            </div>
            <p className="mt-3 text-sm text-ink-muted">
              Machine-readable OpenAPI 3.1 spec. Import into Postman, Swagger UI, or your codegen
              tool. No API key required.
            </p>
          </article>
        </section>

        <div className="mt-10">
          <Link
            href={DEVELOPERS_PATH}
            className="text-sm font-medium text-accent hover:underline"
          >
            ← Back to Developers
          </Link>
        </div>
      </div>
    </>
  );
}
