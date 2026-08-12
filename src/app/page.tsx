import { HomePageContent } from '@/components/home/HomePageContent';
import { HOME_FAQS } from '@/lib/content/faqs';
import { faqJsonLd, organizationJsonLd, websiteJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'PickTheRobot — Pick the right robot for your business',
  description:
    'Free robot matcher for warehouse, cleaning, and restaurant teams. Get a scored robot type, buy vs lease vs RaaS, and ranked vendors in under two minutes.',
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
