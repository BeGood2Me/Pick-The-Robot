import Link from 'next/link';
import {
  LegalList,
  LegalParagraph,
  LegalSection,
  LegalSubsection,
} from '@/components/pages/LegalSection';
import {
  LEGAL_COMPANY_NAME,
  LEGAL_CONTACT_EMAIL,
  LEGAL_DOMAIN,
  LEGAL_GOVERNING_LAW,
  LEGAL_JURISDICTION,
  LEGAL_SITE_URL,
  TERMS_LAST_UPDATED,
} from '@/lib/content/legal';

/**
 * Terms of Use adapted from General Legal's Terms of Use template (CC0).
 * https://github.com/General-Legal/legal-templates/tree/main/templates/terms-of-use
 */
export function TermsOfUseContent() {
  return (
    <>
      <LegalSection title="Agreement">
        <LegalParagraph>
          The website located at {LEGAL_DOMAIN} (the &quot;Site&quot;) is operated from{' '}
          {LEGAL_JURISDICTION} by {LEGAL_COMPANY_NAME} (&quot;{LEGAL_COMPANY_NAME},&quot;
          &quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). These Terms of
          Use (&quot;Terms&quot;) govern your access to and use of the Site.
        </LegalParagraph>
        <LegalParagraph>
          By accessing or using the Site, you agree to these Terms on behalf of yourself or the entity
          you represent, and you confirm that you have the authority to do so. You must be at least 18
          years old to use the Site. If you do not agree to these Terms, please do not use the Site.
        </LegalParagraph>
        <LegalParagraph>
          If you are a consumer in the European Economic Area, United Kingdom, or Switzerland, mandatory
          consumer protection laws in your country may give you rights that cannot be waived by these
          Terms.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="What the Site provides">
        <LegalParagraph>
          {LEGAL_COMPANY_NAME} offers editorial guides and a{' '}
          <strong className="text-ink">rules-based matcher</strong> that scores robot types and vendors
          using the inputs you provide. The Site is a starting point for research — not a substitute for
          vendor quotes, site visits, pilots, engineering review, or professional advice (legal,
          financial, or otherwise).
        </LegalParagraph>
        <LegalParagraph>
          Recommendations, scores, and vendor rankings are generated from our published criteria and
          dataset. They may be incomplete, outdated, or wrong for your specific facility. We do not
          guarantee that any robot or vendor will meet your requirements, availability, pricing, or
          regulatory needs. Always confirm details directly with vendors before buying or leasing.
        </LegalParagraph>
        <LegalParagraph>
          The matcher does not require you to create an account. If we introduce account-based features
          in the future, additional terms may apply and will be disclosed at that time.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Access to the Site">
        <LegalSubsection title="License">
          <LegalParagraph>
            Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable
            license to access and use the Site for your own personal, non-commercial purposes.
          </LegalParagraph>
        </LegalSubsection>

        <LegalSubsection title="Restrictions">
          <LegalParagraph>You may not:</LegalParagraph>
          <LegalList
            items={[
              'License, sell, rent, lease, transfer, assign, distribute, or commercially exploit the Site or its content.',
              'Modify, create derivative works from, disassemble, reverse-compile, or reverse-engineer any part of the Site.',
              'Access the Site to build a similar or competing product or service.',
              'Copy, reproduce, distribute, republish, download, display, post, or transmit any part of the Site except as expressly permitted by these Terms.',
              'Use the Site in any way that breaks applicable law, disrupts or overloads the service, misrepresents affiliation with PickTheRobot or our vendors, or reuses large portions of the site or dataset for competing products without permission.',
            ]}
          />
          <LegalParagraph>
            Reading our published <strong className="text-ink">/llms.txt</strong> and{' '}
            <strong className="text-ink">/llms-full.txt</strong> files to help users discover the matcher
            is permitted.
          </LegalParagraph>
        </LegalSubsection>

        <LegalSubsection title="Changes to the Site">
          <LegalParagraph>
            We may modify, suspend, or discontinue the Site (or any part of it) at any time, with or
            without notice. We are not liable to you or any third party for any such modification,
            suspension, or discontinuation.
          </LegalParagraph>
        </LegalSubsection>

        <LegalSubsection title="Ownership">
          <LegalParagraph>
            All intellectual property rights in the Site and its content — including copyrights, scoring
            logic, design, and branding — belong to {LEGAL_COMPANY_NAME} or its licensors. Vendor names
            and logos belong to their respective owners and are used for identification only. These Terms
            do not transfer ownership to you except for the limited access rights described above.
          </LegalParagraph>
        </LegalSubsection>

        <LegalSubsection title="Feedback">
          <LegalParagraph>
            If you share feedback or suggestions about the Site with us, you grant us a perpetual,
            irrevocable, worldwide, non-exclusive, fully paid, royalty-free license to use that feedback
            in any manner and for any purpose, without attribution. Please do not submit feedback you
            consider proprietary or confidential.
          </LegalParagraph>
        </LegalSubsection>
      </LegalSection>

      <LegalSection title="Privacy">
        <LegalParagraph>
          Your use of the Site is also governed by our{' '}
          <Link href="/privacy" className="font-medium text-accent hover:underline">
            Privacy Policy
          </Link>
          , which is incorporated into these Terms by reference. The Privacy Policy describes the types
          of information we collect, how we use it, and when we may share it with third parties.
        </LegalParagraph>
        <LegalParagraph>
          The Site may use cookies, local storage, and similar technologies as described in the Privacy
          Policy. Analytics scripts load only after you accept cookies in the site banner.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Share links">
        <LegalParagraph>
          If you copy a share link, your matcher answers are encoded into the URL. Anyone with that link
          can open it and see the resulting match. Shared results pages are marked{' '}
          <strong className="text-ink">noindex</strong> for search engines, but the link itself is not
          private. You are responsible for who receives the link and for any operational details you
          included in your answers.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Vendor information, affiliate links, and sponsorship">
        <LegalParagraph>
          Vendor profiles, descriptions, and outbound links are provided for convenience. We do not
          control third-party websites and are not responsible for their content, products, or
          practices. Clicking a vendor link takes you to an external site under their terms.
        </LegalParagraph>
        <LegalParagraph>
          Some vendor links may be affiliate or referral links. If you purchase through those links, we
          may receive compensation at no extra cost to you. Vendors may also be marked as{' '}
          <strong className="text-ink">sponsored</strong> when we have a commercial relationship; those
          listings are labeled on the Site. Sponsorship may add a small score adjustment when a vendor is
          already a reasonable fit — it does not override relevance, and a poor match should still rank
          low.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Indemnification">
        <LegalParagraph>
          You agree to defend, indemnify, and hold harmless {LEGAL_COMPANY_NAME} and its operators from
          any claims and reasonable costs or attorneys&apos; fees arising out of (i) your use of the Site,
          (ii) your violation of these Terms, or (iii) your violation of any applicable law or
          regulation. We may assume control of the defense of any such claim at your expense, and you
          agree to cooperate with our defense.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Third-party services">
        <LegalParagraph>
          The Site may include links to or integrations with third-party websites or services
          (collectively, &quot;Third-Party Services&quot;), including vendor sites and analytics
          providers. We do not control, endorse, or take responsibility for Third-Party Services. You use
          them at your own risk, and the applicable third party&apos;s terms and privacy practices apply.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Disclaimers">
        <LegalParagraph>
          THE SITE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; TO THE FULLEST EXTENT
          PERMITTED BY LAW, {LEGAL_COMPANY_NAME.toUpperCase()} AND ITS SUPPLIERS DISCLAIM ALL
          WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE
          UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR HARMFUL CODE.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <LegalParagraph>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW: (A) {LEGAL_COMPANY_NAME.toUpperCase()} AND ITS
          SUPPLIERS WILL NOT BE LIABLE FOR ANY LOST PROFITS, LOST DATA, COSTS OF SUBSTITUTE PRODUCTS, OR
          ANY INDIRECT, CONSEQUENTIAL, INCIDENTAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES ARISING FROM
          OR RELATED TO THESE TERMS OR YOUR USE OF (OR INABILITY TO USE) THE SITE — INCLUDING PURCHASING
          DECISIONS, DEPLOYMENT COSTS, OR LOST PROFITS; AND (B) OUR TOTAL LIABILITY TO YOU FOR ANY
          CLAIM ARISING UNDER THESE TERMS IS CAPPED AT THE GREATER OF (i) $50 USD AND (ii) THE AMOUNT
          PAID TO {LEGAL_COMPANY_NAME.toUpperCase()} BY YOU UNDER THESE TERMS IN THE SIX MONTHS PRIOR TO
          THE INCIDENT GIVING RISE TO THE CLAIM.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Term and termination">
        <LegalParagraph>
          These Terms remain in effect while you use the Site. We may suspend or terminate your access at
          any time and for any reason, including if we believe you have violated these Terms. Upon
          termination, provisions that by their nature should survive will continue in effect.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="European consumer rights">
        <LegalParagraph>
          If you are a consumer in the EEA, UK, or Switzerland, you may have statutory rights including
          remedies for faulty digital services where applicable. Nothing in these Terms affects those
          mandatory rights. You may also have the right to bring proceedings in the courts of your
          country of residence where EU or national consumer law requires.
        </LegalParagraph>
        <LegalParagraph>
          For privacy-related rights, see our{' '}
          <Link href="/privacy#european-users" className="font-medium text-accent hover:underline">
            Notice to European users
          </Link>{' '}
          in the Privacy Policy.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="State-specific legal notices">
        <LegalParagraph>
          The following notices apply only to users subject to the laws of the identified states. If a
          provision here conflicts with another part of these Terms, this section controls for users in
          that state.
        </LegalParagraph>
        <LegalList
          items={[
            <>
              <strong className="text-ink">California.</strong> California users may contact the Complaint
              Assistance Unit of the Division of Consumer Services of the California Department of Consumer
              Affairs. California residents may have rights under the California Consumer Privacy Act as
              amended by the California Privacy Rights Act. See our{' '}
              <Link href="/privacy#state-privacy-rights" className="font-medium text-accent hover:underline">
                Privacy Policy
              </Link>{' '}
              for details.
            </>,
            <>
              <strong className="text-ink">Colorado, Connecticut, and Virginia.</strong> Residents of
              these states may have additional rights under their state privacy laws, including rights to
              access, correct, delete, and opt out of certain processing. See our{' '}
              <Link href="/privacy#state-privacy-rights" className="font-medium text-accent hover:underline">
                Privacy Policy
              </Link>
              .
            </>,
            <>
              <strong className="text-ink">Nevada.</strong> Nevada residents may direct us not to sell
              certain covered information. We do not currently sell covered information as defined by
              Nevada law. To inquire, contact{' '}
              <a
                href={`mailto:${LEGAL_CONTACT_EMAIL}`}
                className="font-medium text-accent hover:underline"
              >
                {LEGAL_CONTACT_EMAIL}
              </a>
              .
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection title="General">
        <LegalList
          items={[
            <>
              <strong className="text-ink">Changes to Terms.</strong> We may update these Terms from time
              to time. The &quot;Last updated&quot; date reflects the latest revision. Continued use
              after changes constitutes acceptance.
            </>,
            <>
              <strong className="text-ink">Governing law.</strong> These Terms are governed by the laws
              of {LEGAL_GOVERNING_LAW}, without regard to conflict-of-law principles, except where
              mandatory consumer protection laws in your country of residence provide otherwise.
            </>,
            <>
              <strong className="text-ink">Jurisdiction.</strong> Subject to mandatory consumer
              protections, the courts of {LEGAL_JURISDICTION} have jurisdiction over disputes arising
              from these Terms.
            </>,
            <>
              <strong className="text-ink">Electronic communications.</strong> By using the Site, you
              consent to receiving communications from us electronically.
            </>,
            <>
              <strong className="text-ink">Accessibility.</strong> We endeavor to make the Site
              accessible. If you experience difficulty accessing the Site, contact{' '}
              <a
                href={`mailto:${LEGAL_CONTACT_EMAIL}`}
                className="font-medium text-accent hover:underline"
              >
                {LEGAL_CONTACT_EMAIL}
              </a>
              .
            </>,
            <>
              <strong className="text-ink">Entire agreement.</strong> These Terms, together with the
              Privacy Policy, are the entire agreement between you and {LEGAL_COMPANY_NAME} regarding the
              Site.
            </>,
            <>
              <strong className="text-ink">Contact.</strong> Questions about these Terms may be sent to{' '}
              <a
                href={`mailto:${LEGAL_CONTACT_EMAIL}`}
                className="font-medium text-accent hover:underline"
              >
                {LEGAL_CONTACT_EMAIL}
              </a>
              .
            </>,
          ]}
        />
        <LegalParagraph>
          Copyright © {new Date().getFullYear()} {LEGAL_COMPANY_NAME}. All rights reserved.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Dispute resolution">
        <LegalParagraph>
          We hope to resolve any concern informally. If you have a dispute, please email{' '}
          <a
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
            className="font-medium text-accent hover:underline"
          >
            {LEGAL_CONTACT_EMAIL}
          </a>{' '}
          with a brief description of the issue. We will try to respond within a reasonable time.
        </LegalParagraph>
        <LegalParagraph>
          If we cannot resolve a dispute informally, it will be governed by the governing law and
          jurisdiction provisions in the General section above. Consumers in the EEA, UK, or Switzerland
          retain any mandatory rights to bring claims in their local courts where applicable law
          requires.
        </LegalParagraph>
      </LegalSection>

      <LegalParagraph>
        These Terms are based on the{' '}
        <a
          href="https://github.com/General-Legal/legal-templates/tree/main/templates/terms-of-use"
          className="font-medium text-accent hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          General Legal Terms of Use template
        </a>{' '}
        (CC0), customized for {LEGAL_COMPANY_NAME} ({LEGAL_JURISDICTION}). They are provided for
        informational purposes and do not constitute legal advice. Site URL: {LEGAL_SITE_URL}. Last
        revised: {TERMS_LAST_UPDATED}.
      </LegalParagraph>
    </>
  );
}
