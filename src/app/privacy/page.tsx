import { LegalDocument } from '@/components/pages/LegalDocument';
import { PRIVACY_LAST_UPDATED } from '@/lib/content/legal';
import { PrivacyPolicyContent } from '@/lib/content/privacy-policy';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata = siteMetadata({
  title: 'Privacy Policy',
  description: 'How PickTheRobot collects, uses, and protects information when you use the matcher and guides.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy" path="/privacy" lastUpdated={PRIVACY_LAST_UPDATED}>
      <PrivacyPolicyContent />
    </LegalDocument>
  );
}
