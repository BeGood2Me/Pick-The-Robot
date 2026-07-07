import type { Metadata } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { AnalyticsConsentProvider } from '@/components/analytics/AnalyticsConsentProvider';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { BASE_URL } from '@/lib/seo/metadata';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const display = Source_Serif_4({ subsets: ['latin'], variable: '--font-display' });

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'PickTheRobot — Pick the right robot for your business',
    template: '%s | PickTheRobot',
  },
  description:
    'Compare warehouse, cleaning, and restaurant robots by fit, cost model, and deployment. Rules-based recommendations and vendor matches.',
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans">
        <AnalyticsConsentProvider>
          <AnalyticsProvider>
            <SiteHeader />
            <main id="main-content">{children}</main>
            <SiteFooter />
          </AnalyticsProvider>
        </AnalyticsConsentProvider>
        <Analytics />
      </body>
    </html>
  );
}
