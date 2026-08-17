import Link from 'next/link';
import { CleaningBuyersChecklist } from '@/components/content/CleaningBuyersChecklist';
import { FaqBlock } from '@/components/content/FaqBlock';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  CLEANING_BUYERS_CHECKLIST_FAQS,
  CLEANING_BUYERS_CHECKLIST_LAST_UPDATED,
  CLEANING_BUYERS_CHECKLIST_LIMITATIONS,
  CLEANING_BUYERS_CHECKLIST_META,
  CLEANING_BUYERS_CHECKLIST_PATH,
  CLEANING_BUYERS_CHECKLIST_RELATED_LINKS,
  CLEANING_BUYERS_CHECKLIST_WHEN_TO_USE,
} from '@/lib/content/cleaning-buyers-checklist';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: CLEANING_BUYERS_CHECKLIST_META.title,
  description: CLEANING_BUYERS_CHECKLIST_META.description,
  path: CLEANING_BUYERS_CHECKLIST_PATH,
});

export function CleaningRobotBuyerChecklistPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: CLEANING_BUYERS_CHECKLIST_META.title, path: CLEANING_BUYERS_CHECKLIST_PATH },
        ])}
      />
      <JsonLd data={faqJsonLd(CLEANING_BUYERS_CHECKLIST_FAQS)} />

      <div className="container-page py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cleaning robot buyer\'s checklist' },
          ]}
        />

        <h1 className="mt-4 font-display text-4xl font-semibold">
          Commercial cleaning robot buyer&apos;s checklist
        </h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">
          A free, printable guide for facilities managers and procurement teams evaluating autonomous
          scrubbers, vacuums, or cleaning subscriptions — before the first vendor demo.
        </p>
        <p className="mt-2 text-sm text-ink-faint">Last updated {CLEANING_BUYERS_CHECKLIST_LAST_UPDATED}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/?category=cleaning#matcher"
            className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/20 transition hover:bg-accent-hover"
          >
            Run cleaning matcher
          </Link>
          <Link
            href="/cleaning-robot-vs-cleaning-staff"
            className="inline-flex items-center justify-center rounded-md border border-surface-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/40 hover:bg-accent-soft/40"
          >
            Robot vs staff comparison
          </Link>
        </div>

        <section className="mt-10 card">
          <h2 className="text-lg font-semibold text-ink">When to use this checklist</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-ink-muted">
            {CLEANING_BUYERS_CHECKLIST_WHEN_TO_USE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-muted">
            PickTheRobot is buyer-side research — not a dealer, integrator, or FM provider. We help you
            shortlist robot types and vendors; always confirm pricing and deployment scope on site.
          </p>
        </section>

        <CleaningBuyersChecklist />

        <section className="mt-10 card">
          <h2 className="text-lg font-semibold text-ink">What this checklist does not cover</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-ink-muted">
            {CLEANING_BUYERS_CHECKLIST_LIMITATIONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 card">
          <h2 className="text-lg font-semibold text-ink">Related guides</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {CLEANING_BUYERS_CHECKLIST_RELATED_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-medium text-accent hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <FaqBlock items={CLEANING_BUYERS_CHECKLIST_FAQS} title="Cleaning robot checklist FAQs" />
        </div>
      </div>
    </>
  );
}
