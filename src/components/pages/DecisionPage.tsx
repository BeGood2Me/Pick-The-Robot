import Link from 'next/link';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { StickyMatcherCta } from '@/components/layout/StickyMatcherCta';

import { FaqBlock } from '@/components/content/FaqBlock';

import { DECISION_PAGES } from '@/lib/content/comparisons';

import { DECISION_LINKS } from '@/lib/content/navigation';

import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/schema';

import { JsonLd } from '@/lib/seo/jsonld';

import { siteMetadata } from '@/lib/seo/metadata';



type DecisionKey = keyof typeof DECISION_PAGES;



function DecisionPageContent({ pageKey }: { pageKey: DecisionKey }) {

  const page = DECISION_PAGES[pageKey];

  const path = `/${pageKey}`;

  const otherDecision = DECISION_LINKS.find((l) => l.href !== path);



  return (

    <>

      <JsonLd

        data={breadcrumbJsonLd([

          { name: 'Home', path: '/' },

          { name: page.h1, path },

        ])}

      />

      <JsonLd data={faqJsonLd([...page.faqs])} />

      <JsonLd

        data={articleJsonLd({

          title: page.title,

          description: page.metaDescription,

          path,

        })}

      />



      <div className="container-page py-10">

        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: page.h1 }]} />

        <h1 className="font-display text-4xl font-semibold">{page.h1}</h1>

        <p className="mt-4 max-w-3xl text-lg prose-muted">{page.intro}</p>

        <section className="mt-8 card border-accent/30 bg-accent-soft/20">
          <h2 className="text-lg font-semibold">Get a recommendation for your operation</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Answer a few questions about your facility — we&apos;ll rank robot types, acquisition models,
            and vendors from your inputs.
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

        <StickyMatcherCta href="/#matcher" />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">

          {page.sections.map((section) => (

            <section key={section.heading} className="card">

              <h2 className="text-lg font-semibold">{section.heading}</h2>

              <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">

                {section.bullets.map((b) => (

                  <li key={b}>{b}</li>

                ))}

              </ul>

            </section>

          ))}

        </div>



        <section className="mt-10 card">

          <h2 className="font-semibold">Related guides</h2>

          <ul className="mt-3 space-y-1 text-sm">

            {otherDecision && (

              <li>

                <Link href={otherDecision.href} className="text-accent hover:underline">

                  {otherDecision.label}

                </Link>

              </li>

            )}

            <li>

              <Link href="/warehouse-robots" className="text-accent hover:underline">

                Warehouse robot matcher

              </Link>

            </li>

            <li>

              <Link href="/cleaning-robots" className="text-accent hover:underline">

                Cleaning robot matcher

              </Link>

            </li>

            <li>

              <Link href="/restaurant-robots" className="text-accent hover:underline">

                Restaurant robot matcher

              </Link>

            </li>

          </ul>

        </section>



        <p className="mt-8 text-sm">

          <Link href="/" className="text-accent hover:underline">

            Run the matcher with your numbers

          </Link>

        </p>



        <div className="mt-10">

          <FaqBlock items={[...page.faqs]} />

        </div>

      </div>

    </>

  );

}



export function decisionMetadata(pageKey: DecisionKey) {

  const page = DECISION_PAGES[pageKey];

  return siteMetadata({

    title: page.title,

    description: page.metaDescription,

    path: `/${pageKey}`,

    ogImage: `/${pageKey}/opengraph-image`,

  });

}



export function LeaseVsBuyPage() {

  return <DecisionPageContent pageKey="robot-leasing-vs-buying" />;

}



export function RaasPage() {

  return <DecisionPageContent pageKey="robotics-as-a-service" />;

}


