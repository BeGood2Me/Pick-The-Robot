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
  LEGAL_DATA_PROTECTION_AUTHORITY,
  LEGAL_DOMAIN,
  LEGAL_DPC_URL,
  LEGAL_JURISDICTION,
  PRIVACY_LAST_UPDATED,
} from '@/lib/content/legal';

/**
 * Privacy policy adapted from General Legal's GDPR-enhanced Privacy Policy template (CC0).
 * https://github.com/General-Legal/legal-templates/tree/main/templates/privacy-policy-gdpr
 */
export function PrivacyPolicyContent() {
  return (
    <>
      <LegalSection title="Overview">
        <LegalParagraph>
          Effective as of {PRIVACY_LAST_UPDATED}. This Privacy Policy describes how{' '}
          {LEGAL_COMPANY_NAME} (&quot;{LEGAL_COMPANY_NAME},&quot; &quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;) processes personal information when you use picktherobot.com and related
          pages that link to this policy (collectively, the &quot;Service&quot;).
        </LegalParagraph>
        <LegalParagraph>
          {LEGAL_COMPANY_NAME} operates a rules-based robot recommendation tool and buyer research
          site for warehouse, cleaning, and restaurant automation. We are based in{' '}
          {LEGAL_JURISDICTION} and do not require an account to use the matcher.
        </LegalParagraph>
        <LegalParagraph>
          <strong className="text-ink">Data controller:</strong> {LEGAL_COMPANY_NAME} is the controller
          of personal information described in this policy. Contact us at{' '}
          <a
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
            className="font-medium text-accent hover:underline"
          >
            {LEGAL_CONTACT_EMAIL}
          </a>
          .
        </LegalParagraph>
        <LegalParagraph>
          <strong className="text-ink">European users:</strong> See the Notice to European users section
          below for GDPR rights and legal bases.{' '}
          <strong className="text-ink">U.S. users:</strong> See the State privacy rights notice section
          for rights that may be available under applicable U.S. state privacy laws.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Personal information we collect">
        <LegalSubsection title="Information you provide to us">
          <LegalParagraph>
            The matcher does not ask for your name, email address, phone number, or company name. We
            do not operate a general-purpose login system for site visitors.
          </LegalParagraph>
          <LegalParagraph>
            If you contact us directly (for example, by email), we collect the information you choose
            to send, such as your email address and message contents, so we can respond.
          </LegalParagraph>
        </LegalSubsection>

        <LegalSubsection title="Matcher answers (your browser)">
          <LegalParagraph>
            When you use the matcher, your answers are processed in your browser to produce
            recommendations. Answers may be saved in your browser&apos;s{' '}
            <strong className="text-ink">local storage</strong> under a key tied to the category you
            selected. This stays on your device until you clear site data, complete a match, or start
            over. We do not automatically send your full matcher answers to our servers.
          </LegalParagraph>
        </LegalSubsection>

        <LegalSubsection title="Share links">
          <LegalParagraph>
            If you use &quot;Copy share link,&quot; your form answers are encoded into the URL you
            copy. Anyone with that link can open it and see the resulting match. Shared results pages
            are marked <strong className="text-ink">noindex</strong> for search engines, but the link
            itself is not private unless you treat it that way.
          </LegalParagraph>
        </LegalSubsection>

        <LegalSubsection title="Automatic data collection">
          <LegalParagraph>
            We, our hosting provider, and our analytics providers (when enabled and after you accept
            cookies) may automatically log information about you, your computer or mobile device, and
            your interaction with the Service, such as:
          </LegalParagraph>
          <LegalList
            items={[
              <>
                <strong className="text-ink">Device data</strong>, such as browser type, operating
                system, screen resolution, device type, IP address, language settings, and general
                location information derived from IP address (such as city or region).
              </>,
              <>
                <strong className="text-ink">Online activity data</strong>, such as pages viewed, time
                spent on pages, navigation paths, referrer URL, and whether you opened emails from us
                (if applicable).
              </>,
              <>
                <strong className="text-ink">Analytics event data</strong>, such as matcher category,
                robot type, or vendor identifier when you complete a match or click a vendor link. We
                do not include your full matcher form responses in these events.
              </>,
            ]}
          />
        </LegalSubsection>

        <LegalSubsection title="Hosting and server logs">
          <LegalParagraph>
            Like most websites, our hosting provider may keep routine server logs (such as IP address,
            request time, and page requested) for security and operations. We do not use those logs to
            build profiles of individual matcher users.
          </LegalParagraph>
        </LegalSubsection>
      </LegalSection>

      <LegalSection title="Tracking and other technologies">
        <LegalParagraph>
          Some automatic data collection is facilitated by cookies, local storage, and similar
          technologies.
        </LegalParagraph>
        <LegalList
          items={[
            <>
              <strong className="text-ink">Cookie consent.</strong> Analytics scripts load only after
              you accept them in the cookie banner on your first visit. Your choice (accept or reject)
              is stored in your browser&apos;s local storage so we do not ask again on every page.
            </>,
            <>
              <strong className="text-ink">Analytics providers.</strong> When configured and accepted,
              we may use Google Analytics 4 and/or Plausible Analytics. These services use cookies or
              similar technologies as described in their own privacy policies.
            </>,
            <>
              <strong className="text-ink">Matcher storage.</strong> We use local storage to remember
              in-progress matcher answers and your analytics consent choice. This is not used for
              cross-site advertising.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection title="How we use your personal information">
        <LegalParagraph>We may use personal information for the following purposes:</LegalParagraph>
        <LegalList
          items={[
            <>
              <strong className="text-ink">Service delivery and operations</strong> — operate,
              secure, and maintain the Service; respond to your requests and communications.
            </>,
            <>
              <strong className="text-ink">Service improvement and analytics</strong> — understand how
              the Service is used, improve pages and scoring, and measure feature performance (only
              when analytics is enabled and you have accepted cookies).
            </>,
            <>
              <strong className="text-ink">Compliance and protection</strong> — comply with law,
              respond to lawful requests, protect rights and safety, and prevent fraud or abuse.
            </>,
            <>
              <strong className="text-ink">Aggregated or de-identified data</strong> — create
              aggregated statistics that do not identify you. We do not attempt to reidentify
              de-identified data.
            </>,
          ]}
        />
        <LegalParagraph>
          We do not use your personal information to send marketing emails to matcher users, and we do
          not sell personal information.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="How we share your personal information">
        <LegalParagraph>We may share personal information with the following parties:</LegalParagraph>
        <LegalList
          items={[
            <>
              <strong className="text-ink">Service providers</strong> — third parties that help us
              operate the Service, such as hosting (for example, Vercel) and analytics providers (for
              example, Google or Plausible) when you have accepted cookies.
            </>,
            <>
              <strong className="text-ink">Authorities and others</strong> — law enforcement, regulators,
              or other parties when we believe disclosure is required or appropriate to comply with law
              or protect rights and safety.
            </>,
            <>
              <strong className="text-ink">Business transferees</strong> — in connection with a merger,
              acquisition, financing, reorganization, or sale of assets, subject to customary
              confidentiality obligations.
            </>,
          ]}
        />
        <LegalParagraph>
          When you click through to a vendor website, you leave {LEGAL_COMPANY_NAME}. Outbound URLs may
          include standard campaign parameters (for example, utm_source=picktherobot) so vendors can see
          traffic came from us. Some vendors use affiliate or referral URLs. Those sites have their
          own privacy policies.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Your choices">
        <LegalList
          items={[
            <>
              <strong className="text-ink">Analytics cookies.</strong> Use the cookie banner to accept
              or reject analytics on your first visit. You can also clear site data in your browser or
              use browser extensions that block third-party scripts.
            </>,
            <>
              <strong className="text-ink">Do Not Track.</strong> Some browsers send &quot;Do Not
              Track&quot; signals. We do not currently respond to those signals. To learn more, visit{' '}
              <a
                href="https://allaboutdnt.com/"
                className="font-medium text-accent hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                allaboutdnt.com
              </a>
              .
            </>,
            <>
              <strong className="text-ink">Share links.</strong> Only share matcher links with people you
              trust. Anyone with the link can view the encoded answers.
            </>,
            <>
              <strong className="text-ink">Email and download actions.</strong> &quot;Email
              summary&quot; opens your own email app with a pre-filled message. We do not receive that
              email. &quot;Download .txt&quot; and &quot;Copy&quot; run entirely in your browser.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection title="Other sites and services">
        <LegalParagraph>
          The Service contains links to third-party websites, including vendor sites. We do not control
          those sites and are not responsible for their privacy practices. We encourage you to read
          their privacy policies.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Machine-readable site information">
        <LegalParagraph>
          We publish plain-text summaries at <strong className="text-ink">/llms.txt</strong> and{' '}
          <strong className="text-ink">/llms-full.txt</strong> so AI assistants can describe the
          matcher and link users to the right pages. Those files describe the product and public URLs
          only — not your matcher answers or personal information.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Chrome extension">
        <LegalParagraph>
          We offer an optional Chrome extension (&quot;PickTheRobot — Robot Matcher Shortcut&quot;) that
          opens {LEGAL_COMPANY_NAME} matcher and guide pages in a new tab. The extension does not
          collect personal information, does not read your browsing history, does not use analytics
          SDKs, and does not request host or storage permissions beyond opening public{' '}
          {LEGAL_DOMAIN} URLs you choose.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Security">
        <LegalParagraph>
          We use technical and organizational measures designed to protect personal information.
          However, security risk is inherent in internet technologies, and we cannot guarantee absolute
          security.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="International data transfer">
        <LegalParagraph>
          We are based in {LEGAL_JURISDICTION} (European Economic Area). Some service providers we use
          — such as hosting or analytics providers — may process personal information in the United
          States or other countries. Where required, we rely on appropriate safeguards for those
          transfers, such as the European Commission&apos;s Standard Contractual Clauses or equivalent
          mechanisms under applicable law.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Children">
        <LegalParagraph>
          The Service is intended for business decision-makers, not children. We do not knowingly collect
          personal information from anyone under 16. If you believe we have collected information from a
          child under 16, contact us and we will take steps to delete it as required by law.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Changes to this Privacy Policy">
        <LegalParagraph>
          We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the
          top of this page will change when we do. Continued use of the Service after an update means
          you accept the revised policy.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="How to contact us">
        <LegalParagraph>
          Questions about this Privacy Policy or requests to exercise privacy rights may be sent to:
        </LegalParagraph>
        <LegalList
          items={[
            <>
              <strong className="text-ink">Email:</strong>{' '}
              <a
                href={`mailto:${LEGAL_CONTACT_EMAIL}`}
                className="font-medium text-accent hover:underline"
              >
                {LEGAL_CONTACT_EMAIL}
              </a>
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection id="european-users" title="Notice to European users">
        <LegalParagraph>
          This section applies if you are in the European Economic Area, United Kingdom, or Switzerland
          (&quot;Europe&quot;). References to &quot;personal information&quot; include &quot;personal
          data&quot; as defined in the GDPR and UK GDPR.
        </LegalParagraph>

        <LegalSubsection title="Legal bases for processing">
          <LegalParagraph>
            We process personal data only where we have a valid legal basis. The main bases we rely on
            are:
          </LegalParagraph>
          <LegalList
            items={[
              <>
                <strong className="text-ink">Consent</strong> — for optional analytics cookies and
                similar technologies when you accept them in the cookie banner. You may withdraw consent
                at any time by clearing site data or changing your browser settings.
              </>,
              <>
                <strong className="text-ink">Legitimate interests</strong> — to operate, secure, and
                improve the Service, understand aggregate usage, and respond to communications, where
                those interests are not overridden by your rights.
              </>,
              <>
                <strong className="text-ink">Compliance with law</strong> — where processing is
                necessary to meet legal obligations or respond to lawful requests.
              </>,
            ]}
          />
        </LegalSubsection>

        <LegalSubsection title="Your GDPR rights">
          <LegalParagraph>
            Subject to applicable law, you may have the right to access, correct, delete, restrict, or
            object to certain processing of your personal data, and to receive a portable copy of data
            you provided to us. To exercise these rights, email{' '}
            <a
              href={`mailto:${LEGAL_CONTACT_EMAIL}`}
              className="font-medium text-accent hover:underline"
            >
              {LEGAL_CONTACT_EMAIL}
            </a>{' '}
            with the subject line &quot;GDPR Request.&quot; We may need to verify your identity before
            responding.
          </LegalParagraph>
          <LegalParagraph>
            You also have the right to lodge a complaint with your local supervisory authority. In
            Ireland, this is the{' '}
            <a
              href={LEGAL_DPC_URL}
              className="font-medium text-accent hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              {LEGAL_DATA_PROTECTION_AUTHORITY}
            </a>
            .
          </LegalParagraph>
        </LegalSubsection>

        <LegalSubsection title="Retention">
          <LegalParagraph>
            We retain personal data only as long as needed for the purposes described in this policy,
            including security, analytics (where consented), and legal compliance. Server logs and
            analytics data are kept for limited periods consistent with our providers&apos; practices
            and our operational needs.
          </LegalParagraph>
        </LegalSubsection>

        <LegalSubsection title="Automated decision-making">
          <LegalParagraph>
            The matcher uses rules-based scoring to suggest robot types and vendors. This is a research
            tool, not automated decision-making with legal or similarly significant effects on you.
          </LegalParagraph>
        </LegalSubsection>
      </LegalSection>

      <LegalSection id="state-privacy-rights" title="State privacy rights notice">
        <LegalParagraph>
          This section applies to residents of U.S. states with privacy laws that grant the rights
          described below, to the extent those laws apply to {LEGAL_COMPANY_NAME} (collectively,
          &quot;State Privacy Laws&quot;). Not all rights apply in every state, and we may decline
          requests where permitted by law.
        </LegalParagraph>

        <LegalSubsection title="Your privacy rights">
          <LegalParagraph>
            Depending on where you live, you may have some or all of the following rights:
          </LegalParagraph>
          <LegalList
            items={[
              'Know what personal information we collect and how we use it.',
              'Access a copy of personal information we hold about you.',
              'Correct inaccurate personal information.',
              'Delete personal information we collected from you.',
              'Opt out of certain processing, such as targeted advertising or sales of personal information.',
              'Appeal a denial of a request, where required by law.',
              'Not receive discriminatory treatment for exercising these rights.',
            ]}
          />
        </LegalSubsection>

        <LegalSubsection title="Important disclosures">
          <LegalList
            items={[
              <>
                <strong className="text-ink">Targeted advertising:</strong> We do not process personal
                information for cross-context behavioral advertising or targeted advertising as defined
                by State Privacy Laws.
              </>,
              <>
                <strong className="text-ink">Sale of personal information:</strong> We do not sell
                personal information within the meaning of State Privacy Laws.
              </>,
              <>
                <strong className="text-ink">Profiling:</strong> We do not use personal information for
                automated decision-making that produces legal or similarly significant effects.
              </>,
              <>
                <strong className="text-ink">Sensitive personal information:</strong> We do not
                intentionally collect sensitive personal information through the matcher.
              </>,
            ]}
          />
        </LegalSubsection>

        <LegalSubsection title="Exercising your rights">
          <LegalParagraph>
            To submit a request, email{' '}
            <a
              href={`mailto:${LEGAL_CONTACT_EMAIL}`}
              className="font-medium text-accent hover:underline"
            >
              {LEGAL_CONTACT_EMAIL}
            </a>{' '}
            with the subject line &quot;Privacy Request&quot; and describe the right you wish to
            exercise. We may need to verify your identity before processing certain requests. If we
            cannot verify your identity from the information provided, we may ask for additional
            information reasonably necessary to confirm it.
          </LegalParagraph>
          <LegalParagraph>
            If you use a recognized opt-out preference signal (such as the Global Privacy Control), we
            will treat it as a valid opt-out request to the extent required by applicable law and
            technically feasible for our Service.
          </LegalParagraph>
        </LegalSubsection>

        <LegalSubsection title="Information practices (last 12 months)">
          <LegalParagraph>
            The chart below summarizes categories of personal information we collect, why we collect them,
            and with whom we may disclose them. We do not sell or share personal information for
            cross-context behavioral advertising.
          </LegalParagraph>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="py-2 pr-3 font-semibold text-ink">Personal information</th>
                  <th className="py-2 pr-3 font-semibold text-ink">CCPA category</th>
                  <th className="py-2 pr-3 font-semibold text-ink">Purposes</th>
                  <th className="py-2 pr-3 font-semibold text-ink">Disclosed to</th>
                  <th className="py-2 font-semibold text-ink">Sold / shared</th>
                </tr>
              </thead>
              <tbody className="align-top">
                <tr className="border-b border-surface-border">
                  <td className="py-2 pr-3">Identifiers (for example, IP address, browser type)</td>
                  <td className="py-2 pr-3">Identifiers</td>
                  <td className="py-2 pr-3">Operate and secure the Service; analytics (if accepted)</td>
                  <td className="py-2 pr-3">Hosting and analytics providers</td>
                  <td className="py-2">No</td>
                </tr>
                <tr className="border-b border-surface-border">
                  <td className="py-2 pr-3">Internet / network activity (pages viewed, referrers)</td>
                  <td className="py-2 pr-3">Internet or network activity</td>
                  <td className="py-2 pr-3">Analytics and product improvement (if accepted)</td>
                  <td className="py-2 pr-3">Hosting and analytics providers</td>
                  <td className="py-2">No</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Contact information you email to us</td>
                  <td className="py-2 pr-3">Identifiers</td>
                  <td className="py-2 pr-3">Respond to inquiries</td>
                  <td className="py-2 pr-3">Service providers assisting with email or support</td>
                  <td className="py-2">No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </LegalSubsection>

        <LegalSubsection title="Additional information for California residents">
          <LegalParagraph>
            Under California&apos;s Shine the Light law (California Civil Code Section 1798.83),
            California residents may request information about certain personal information disclosures
            to third parties for their own direct marketing purposes. We do not disclose personal
            information to third parties for their own direct marketing purposes. To inquire, email{' '}
            <a
              href={`mailto:${LEGAL_CONTACT_EMAIL}`}
              className="font-medium text-accent hover:underline"
            >
              {LEGAL_CONTACT_EMAIL}
            </a>{' '}
            with the subject line &quot;Shine the Light Request.&quot;
          </LegalParagraph>
        </LegalSubsection>
      </LegalSection>

      <LegalParagraph>
        This policy is based on the{' '}
        <a
          href="https://github.com/General-Legal/legal-templates/tree/main/templates/privacy-policy-gdpr"
          className="font-medium text-accent hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          General Legal GDPR-enhanced Privacy Policy template
        </a>{' '}
        (CC0), customized for {LEGAL_COMPANY_NAME} ({LEGAL_JURISDICTION}). It is provided for
        informational purposes and does not constitute legal advice. See also our{' '}
        <Link href="/terms" className="font-medium text-accent hover:underline">
          Terms of Use
        </Link>
        .
      </LegalParagraph>
    </>
  );
}
