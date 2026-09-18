import { HomePageContent } from '@/components/home/HomePageContent';
import { HOME_FAQS } from '@/lib/content/faqs';
import { faqJsonLd, organizationJsonLd, websiteJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'PickTheRobot — Home robot vacuums and business robots',
  description:
    'Free rules-based matchers: robot vacuums for home, and warehouse, commercial cleaning, and restaurant robots for work. Scored shortlists, not lab tests or sales calls.',
  path: '',
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={faqJsonLd(HOME_FAQS)} />

      <div className="container-page py-4 sm:py-10">
        <HomePageContent />
      </div>
    </>
  );
}
