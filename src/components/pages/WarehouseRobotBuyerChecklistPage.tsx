import Link from 'next/link';
import { WarehouseBuyersChecklist } from '@/components/content/WarehouseBuyersChecklist';
import { FaqBlock } from '@/components/content/FaqBlock';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  WAREHOUSE_BUYERS_CHECKLIST_FAQS,
  WAREHOUSE_BUYERS_CHECKLIST_LAST_UPDATED,
  WAREHOUSE_BUYERS_CHECKLIST_LIMITATIONS,
  WAREHOUSE_BUYERS_CHECKLIST_META,
  WAREHOUSE_BUYERS_CHECKLIST_PATH,
  WAREHOUSE_BUYERS_CHECKLIST_RELATED_LINKS,
  WAREHOUSE_BUYERS_CHECKLIST_WHEN_TO_USE,
} from '@/lib/content/warehouse-buyers-checklist';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: WAREHOUSE_BUYERS_CHECKLIST_META.title,
  description: WAREHOUSE_BUYERS_CHECKLIST_META.description,
  path: WAREHOUSE_BUYERS_CHECKLIST_PATH,
});

export function WarehouseRobotBuyerChecklistPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: WAREHOUSE_BUYERS_CHECKLIST_META.title, path: WAREHOUSE_BUYERS_CHECKLIST_PATH },
        ])}
      />
      <JsonLd data={faqJsonLd(WAREHOUSE_BUYERS_CHECKLIST_FAQS)} />

      <div className="container-page py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: WAREHOUSE_BUYERS_CHECKLIST_META.h1 },
          ]}
        />

        <h1 className="mt-4 font-display text-4xl font-semibold">
          {WAREHOUSE_BUYERS_CHECKLIST_META.h1}
        </h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">
          A free, printable guide for warehouse ops and procurement teams evaluating AMRs, AGVs,
          pick-assist, or pallet movers — before the first vendor demo.
        </p>
        <p className="mt-2 text-sm text-ink-faint">Last updated {WAREHOUSE_BUYERS_CHECKLIST_LAST_UPDATED}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/?category=warehouse#matcher"
            className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/20 transition hover:bg-accent-hover"
          >
            Run warehouse matcher
          </Link>
          <Link
            href="/amr-vs-agv"
            className="inline-flex items-center justify-center rounded-md border border-surface-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/40 hover:bg-accent-soft/40"
          >
            AMR vs AGV comparison
          </Link>
        </div>

        <section className="mt-10 card">
          <h2 className="text-lg font-semibold text-ink">When to use this checklist</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-ink-muted">
            {WAREHOUSE_BUYERS_CHECKLIST_WHEN_TO_USE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-muted">
            PickTheRobot is buyer-side research — not a dealer, integrator, or deployment consultant.
            We help you shortlist robot types and vendors; always confirm pricing, safety requirements,
            and deployment scope on site.
          </p>
        </section>

        <WarehouseBuyersChecklist />

        <section className="mt-10 card">
          <h2 className="text-lg font-semibold text-ink">What this checklist does not cover</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-ink-muted">
            {WAREHOUSE_BUYERS_CHECKLIST_LIMITATIONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 card">
          <h2 className="text-lg font-semibold text-ink">Related guides</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {WAREHOUSE_BUYERS_CHECKLIST_RELATED_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-medium text-accent hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <FaqBlock items={WAREHOUSE_BUYERS_CHECKLIST_FAQS} title="Warehouse robot checklist FAQs" />
        </div>
      </div>
    </>
  );
}
