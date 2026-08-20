import Link from 'next/link';
import { RestaurantBuyersChecklist } from '@/components/content/RestaurantBuyersChecklist';
import { FaqBlock } from '@/components/content/FaqBlock';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  RESTAURANT_BUYERS_CHECKLIST_FAQS,
  RESTAURANT_BUYERS_CHECKLIST_LAST_UPDATED,
  RESTAURANT_BUYERS_CHECKLIST_LIMITATIONS,
  RESTAURANT_BUYERS_CHECKLIST_META,
  RESTAURANT_BUYERS_CHECKLIST_PATH,
  RESTAURANT_BUYERS_CHECKLIST_RELATED_LINKS,
  RESTAURANT_BUYERS_CHECKLIST_WHEN_TO_USE,
} from '@/lib/content/restaurant-buyers-checklist';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: RESTAURANT_BUYERS_CHECKLIST_META.title,
  description: RESTAURANT_BUYERS_CHECKLIST_META.description,
  path: RESTAURANT_BUYERS_CHECKLIST_PATH,
});

export function RestaurantRobotBuyerChecklistPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: RESTAURANT_BUYERS_CHECKLIST_META.title, path: RESTAURANT_BUYERS_CHECKLIST_PATH },
        ])}
      />
      <JsonLd data={faqJsonLd(RESTAURANT_BUYERS_CHECKLIST_FAQS)} />

      <div className="container-page py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: RESTAURANT_BUYERS_CHECKLIST_META.title },
          ]}
        />

        <h1 className="mt-4 font-display text-4xl font-semibold">
          {RESTAURANT_BUYERS_CHECKLIST_META.title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">
          A free, printable guide for restaurant operators evaluating serving, bussing, kitchen, or
          reception robots — before the first vendor demo.
        </p>
        <p className="mt-2 text-sm text-ink-faint">Last updated {RESTAURANT_BUYERS_CHECKLIST_LAST_UPDATED}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/?category=restaurant#matcher"
            className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/20 transition hover:bg-accent-hover"
          >
            Run restaurant matcher
          </Link>
          <Link
            href="/restaurant-robot-vs-runner"
            className="inline-flex items-center justify-center rounded-md border border-surface-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/40 hover:bg-accent-soft/40"
          >
            Food runner vs staff comparison
          </Link>
        </div>

        <section className="mt-10 card">
          <h2 className="text-lg font-semibold text-ink">When to use this checklist</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-ink-muted">
            {RESTAURANT_BUYERS_CHECKLIST_WHEN_TO_USE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-muted">
            PickTheRobot is buyer-side research — not a dealer, integrator, or robotics operator. We
            help you shortlist robot types and vendors; always confirm pricing, guest experience, and
            deployment scope for your venue.
          </p>
        </section>

        <RestaurantBuyersChecklist />

        <section className="mt-10 card">
          <h2 className="text-lg font-semibold text-ink">What this checklist does not cover</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-ink-muted">
            {RESTAURANT_BUYERS_CHECKLIST_LIMITATIONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 card">
          <h2 className="text-lg font-semibold text-ink">Related guides</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {RESTAURANT_BUYERS_CHECKLIST_RELATED_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-medium text-accent hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <FaqBlock items={RESTAURANT_BUYERS_CHECKLIST_FAQS} title="Restaurant robot checklist FAQs" />
        </div>
      </div>
    </>
  );
}
