import Link from 'next/link';
import { FaqBlock } from '@/components/content/FaqBlock';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  EDITORIAL_STANDARDS,
  MATCH_CONFIDENCE_EXPLAINER,
  METHODOLOGY_FAQS,
  METHODOLOGY_LAST_UPDATED,
  METHODOLOGY_META,
  METHODOLOGY_PATH,
  METHODOLOGY_SUMMARY,
  SCORING_DIMENSIONS,
  SPONSORSHIP_POLICY,
  VENDOR_RANKING_RULES,
  WHAT_WE_DO_NOT_CLAIM,
} from '@/lib/content/methodology';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: METHODOLOGY_META.title,
  description: METHODOLOGY_META.description,
  path: METHODOLOGY_PATH,
});

export default function MethodologyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: METHODOLOGY_META.title, path: METHODOLOGY_PATH },
        ])}
      />
      <JsonLd data={faqJsonLd(METHODOLOGY_FAQS)} />

      <div className="container-page py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'How matching works' },
          ]}
        />

        <h1 className="mt-4 font-display text-4xl font-semibold">How matching works</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">
          PickTheRobot uses a transparent, rules-based engine — not a black-box model — to score robot
          types and rank vendors from your facility inputs. This page explains what we optimize for, what
          we disclose, and what we do not guarantee.
        </p>
        <p className="mt-2 text-sm text-ink-faint">Last updated {METHODOLOGY_LAST_UPDATED}</p>

        <section className="mt-10 card">
          <h2 className="text-lg font-semibold text-ink">Summary</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-ink-muted">
            {METHODOLOGY_SUMMARY.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-6 card">
          <h2 className="text-lg font-semibold text-ink">Robot type scoring</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Each robot type in your category receives three dimension scores. Overall match is a weighted
            blend of these dimensions.
          </p>
          <dl className="mt-4 space-y-4">
            {SCORING_DIMENSIONS.map((dim) => (
              <div key={dim.name} className="rounded-lg border border-surface-border bg-surface-soft/50 p-4">
                <dt className="font-semibold text-ink">
                  {dim.name}{' '}
                  <span className="font-normal text-ink-muted">({dim.weight})</span>
                </dt>
                <dd className="mt-1 text-sm text-ink-muted">{dim.summary}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-6 card">
          <h2 className="text-lg font-semibold text-ink">{MATCH_CONFIDENCE_EXPLAINER.title}</h2>
          {MATCH_CONFIDENCE_EXPLAINER.paragraphs.map((p) => (
            <p key={p} className="mt-3 text-sm text-ink-muted">
              {p}
            </p>
          ))}
        </section>

        <section className="mt-6 card">
          <h2 className="text-lg font-semibold text-ink">Vendor ranking</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-ink-muted">
            {VENDOR_RANKING_RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="mt-6 card border-accent/30 bg-accent-soft/10">
          <h2 className="text-lg font-semibold text-ink">{SPONSORSHIP_POLICY.title}</h2>
          {SPONSORSHIP_POLICY.paragraphs.map((p) => (
            <p key={p} className="mt-3 text-sm text-ink-muted">
              {p}
            </p>
          ))}
          <p className="mt-4 text-sm">
            <Link href="/terms" className="font-medium text-accent hover:underline">
              Read terms of use
            </Link>
            {' · '}
            <Link href="/for-vendors" className="font-medium text-accent hover:underline">
              Vendor listings
            </Link>
          </p>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="card">
            <h2 className="text-lg font-semibold text-ink">What we do not claim</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-ink-muted">
              {WHAT_WE_DO_NOT_CLAIM.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="card">
            <h2 className="text-lg font-semibold text-ink">Editorial standards</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-ink-muted">
              {EDITORIAL_STANDARDS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-8 card">
          <h2 className="text-lg font-semibold text-ink">Try it</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Run the matcher for your category, then expand the score breakdown on results to see which
            criteria moved each recommendation.
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

        <div className="mt-10">
          <FaqBlock items={METHODOLOGY_FAQS} title="Methodology FAQs" />
        </div>
      </div>
    </>
  );
}
