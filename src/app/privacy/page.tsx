import { LegalDocument } from '@/components/pages/LegalDocument';
import { siteMetadata } from '@/lib/seo/metadata';

const LAST_UPDATED = 'July 3, 2026';

export const metadata = siteMetadata({
  title: 'Privacy Policy',
  description: 'How PickTheRobot handles data when you use the robot matcher and guides.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy" path="/privacy" lastUpdated={LAST_UPDATED}>
      <section>
        <h2 className="text-lg font-semibold text-ink">Overview</h2>
        <p className="mt-2">
          {`PickTheRobot ("we," "us") operates picktherobot.com — a free, rules-based tool to compare
          warehouse, cleaning, and restaurant robots. We do not require an account to use the matcher.
          This policy describes what information is involved when you use the site, in plain language.`}
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">What we do not collect by default</h2>
        <p className="mt-2">
          The matcher does not ask for your name, email address, phone number, or company name. We do
          not run a login system, and we do not sell personal information.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Matcher answers (your browser)</h2>
        <p className="mt-2">
          When you fill out the matcher, your answers are processed in your browser to produce
          recommendations. If you continue a session later, answers may be saved in your browser&apos;s{' '}
          <strong className="text-ink">local storage</strong> under a key tied to the category you
          selected (for example, warehouse). This stays on your device until you clear site data,
          complete a match, or start over. We do not automatically send your full form answers to our
          servers.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Share links</h2>
        <p className="mt-2">
          If you use &quot;Copy share link,&quot; your form answers are encoded into the URL you copy.
          Anyone with that link can open it and see the resulting match. The shared results page is
          marked <strong className="text-ink">noindex</strong> for search engines, but the link itself
          is not private unless you treat it that way. Only share links with people you trust.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Analytics (optional)</h2>
        <p className="mt-2">
          The site may load third-party analytics scripts <strong className="text-ink">only if</strong>{' '}
          they are configured in the deployment environment:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Google Analytics 4, when a measurement ID is set</li>
          <li>Plausible Analytics, when a domain is configured</li>
        </ul>
        <p className="mt-2">
          If enabled, these services may collect information such as pages visited, referrer, browser
          type, and general location derived from IP address. We also send custom events for things like
          completing a match or clicking a vendor link — typically including category, robot type, or
          vendor identifier, not your full form responses. Analytics scripts load only after you accept
          them in the cookie banner on your first visit. Your choice (accept or essential only) is
          stored in your browser&apos;s <strong className="text-ink">local storage</strong> so we do
          not ask again on every page. You can limit analytics with browser extensions, blocking
          third-party scripts, clearing site data, or your browser&apos;s privacy settings.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Email and download actions</h2>
        <p className="mt-2">
          &quot;Email summary&quot; opens your own email app with a pre-filled message (a{' '}
          <strong className="text-ink">mailto</strong> link). We do not receive that email or store
          your address. &quot;Download .txt&quot; and &quot;Copy&quot; actions run entirely in your
          browser — files and clipboard contents stay on your device unless you send them elsewhere.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Machine-readable site information</h2>
        <p className="mt-2">
          We publish plain-text summaries at <strong className="text-ink">/llms.txt</strong> and{' '}
          <strong className="text-ink">/llms-full.txt</strong> so AI assistants can describe the
          matcher and link users to the right pages. Those files describe the product and public URLs
          only — not your matcher answers or personal information.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Vendor and outbound links</h2>
        <p className="mt-2">
          When you click through to a vendor website, you leave PickTheRobot. Outbound URLs may include
          standard campaign parameters (for example, utm_source=picktherobot) so vendors can see
          traffic came from us. Some vendors use affiliate or referral URLs where we may earn a
          commission if you purchase — this does not change the price you pay. Those sites have their
          own privacy policies.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Hosting and logs</h2>
        <p className="mt-2">
          Like most websites, our hosting provider may keep routine server logs (such as IP address,
          request time, and page requested) for security and operations. We do not use those logs to
          build profiles of individual matcher users.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Children</h2>
        <p className="mt-2">
          The site is intended for business decision-makers, not children. We do not knowingly collect
          information from anyone under 13.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Changes</h2>
        <p className="mt-2">
          We may update this policy from time to time. The &quot;Last updated&quot; date at the top
          will change when we do. Continued use of the site after an update means you accept the revised
          policy.
        </p>
      </section>
    </LegalDocument>
  );
}
