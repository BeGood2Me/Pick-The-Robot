import Link from 'next/link';
import { FaqBlock } from '@/components/content/FaqBlock';
import { HomeRobotCategoryPicker } from '@/components/home-robots/HomeRobotCategoryPicker';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { StickyMatcherCta } from '@/components/layout/StickyMatcherCta';
import { ButtonLink } from '@/components/ui/Button';
import {
  BUSINESS_HUB_PATH,
  HOME_HUB_FAQS,
  HOME_HUB_META,
  HOME_HUB_PATH,
} from '@/lib/content/home-vacuums';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: HOME_HUB_META.title,
  description: HOME_HUB_META.description,
  path: HOME_HUB_PATH,
});

export default function HomeRobotsHubPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: HOME_HUB_META.h1, path: HOME_HUB_PATH },
        ])}
      />
      <JsonLd data={faqJsonLd(HOME_HUB_FAQS)} />

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Home robots' }]} />
        <h1 className="font-display text-4xl font-semibold">{HOME_HUB_META.h1}</h1>
        <p className="mt-4 max-w-3xl text-lg prose-muted">
          Home robots are scored by category — robot vacuums today, more types later. Pick a category
          below; we never mix a Roomba-class vacuum with warehouse or restaurant robots.
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          Need warehouse, commercial cleaning, or restaurant automation?{' '}
          <Link href={BUSINESS_HUB_PATH} className="font-medium text-accent hover:underline">
            Use the business robot matcher
          </Link>
          .
        </p>

        <section id="matcher" className="mt-10 scroll-mt-8">
          <h2 className="text-xl font-semibold">Choose a home robot type</h2>
          <p className="mt-1 mb-4 text-sm text-ink-muted">
            Start with robot vacuums. Additional home categories will appear here as matchers ship.
          </p>
          <HomeRobotCategoryPicker />
        </section>

        <div className="mt-12">
          <FaqBlock items={HOME_HUB_FAQS} title="Home robots questions" />
        </div>

        <p className="mt-10">
          <ButtonLink href="/methodology" variant="secondary">
            How scoring works
          </ButtonLink>
        </p>

        <StickyMatcherCta href="#matcher" />
      </div>
    </>
  );
}
