import { LegalDocument } from '@/components/pages/LegalDocument';
import { siteMetadata } from '@/lib/seo/metadata';

const LAST_UPDATED = 'July 3, 2026';

export const metadata = siteMetadata({
  title: 'Terms of Use',
  description: 'Terms for using PickTheRobot’s matcher, guides, and vendor information.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <LegalDocument title="Terms of Use" path="/terms" lastUpdated={LAST_UPDATED}>
      <section>
        <h2 className="text-lg font-semibold text-ink">Agreement</h2>
        <p className="mt-2">
          By using PickTheRobot (picktherobot.com), you agree to these terms. If you do not agree,
          please do not use the site.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">What the site provides</h2>
        <p className="mt-2">
          PickTheRobot offers editorial guides and a <strong className="text-ink">rules-based matcher</strong>{' '}
          that scores robot types and vendors using the inputs you provide. It is a starting point for
          research — not a substitute for vendor quotes, site visits, pilots, engineering review, or
          professional advice (legal, financial, or otherwise).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">No guarantees</h2>
        <p className="mt-2">
          Recommendations, scores, and vendor rankings are generated from our published criteria and
          dataset. They may be incomplete, outdated, or wrong for your specific facility. We do not
          guarantee that any robot or vendor will meet your requirements, availability, pricing, or
          regulatory needs. Always confirm details directly with vendors before buying or leasing.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Vendor information and links</h2>
        <p className="mt-2">
          Vendor profiles, descriptions, and outbound links are provided for convenience. We do not
          control third-party websites and are not responsible for their content, products, or
          practices. Clicking a vendor link takes you to an external site under their terms.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Share links</h2>
        <p className="mt-2">
          If you copy a share link, your form answers are encoded into the URL. Anyone with that link
          can open it and see the resulting match. Shared results pages are marked{' '}
          <strong className="text-ink">noindex</strong> for search engines, but the link itself is not
          private. You are responsible for who receives the link and for any operational details you
          included in your answers.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Affiliate and sponsored listings</h2>
        <p className="mt-2">
          Some vendor links may be affiliate or referral links. If you purchase through those links, we
          may receive compensation at no extra cost to you. Vendors may also be marked as{' '}
          <strong className="text-ink">sponsored</strong> when we have a commercial relationship; those
          listings are labeled on the site. Sponsorship may add a small score adjustment when a vendor
          is already a reasonable fit — it does not override relevance, and a poor match should still
          rank low. We disclose sponsorship where it applies.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Acceptable use</h2>
        <p className="mt-2">You agree not to:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Use the site in any way that breaks applicable law</li>
          <li>Attempt to disrupt, scrape, or overload the service</li>
          <li>Misrepresent affiliation with PickTheRobot or our vendors</li>
          <li>Reuse large portions of the site or dataset for competing products without permission</li>
        </ul>
        <p className="mt-2">
          Reading our published <strong className="text-ink">/llms.txt</strong> and{' '}
          <strong className="text-ink">/llms-full.txt</strong> files to help users discover the matcher
          is permitted.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Intellectual property</h2>
        <p className="mt-2">
          Site text, design, scoring logic, and branding are owned by PickTheRobot or its licensors.
          Vendor names and logos belong to their respective owners and are used for identification only.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Disclaimer of warranties</h2>
        <p className="mt-2">
          The site is provided <strong className="text-ink">&quot;as is&quot;</strong> and{' '}
          <strong className="text-ink">&quot;as available,&quot;</strong> without warranties of any kind,
          whether express or implied, including fitness for a particular purpose or accuracy of results.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Limitation of liability</h2>
        <p className="mt-2">
          To the fullest extent permitted by law, PickTheRobot and its operators will not be liable for
          any indirect, incidental, or consequential damages arising from your use of the site or
          reliance on its recommendations — including purchasing decisions, deployment costs, or lost
          profits.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink">Changes</h2>
        <p className="mt-2">
          We may change these terms or discontinue features at any time. The &quot;Last updated&quot;
          date reflects the latest revision. Your continued use after changes constitutes acceptance.
        </p>
      </section>
    </LegalDocument>
  );
}
