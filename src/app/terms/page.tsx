import { LegalDocument } from '@/components/pages/LegalDocument';
import { TERMS_LAST_UPDATED } from '@/lib/content/legal';
import { TermsOfUseContent } from '@/lib/content/terms-of-use';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'Terms of Use',
  description: 'Terms for using PickTheRobot’s matcher, guides, and vendor information.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <LegalDocument title="Terms of Use" path="/terms" lastUpdated={TERMS_LAST_UPDATED}>
      <TermsOfUseContent />
    </LegalDocument>
  );
}
