import type { Metadata } from 'next';
import { DM_Sans, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AnalyticsConsentProvider } from '@/components/analytics/AnalyticsConsentProvider';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { BASE_URL } from '@/lib/seo/metadata';
import './globals.css';

const sans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'PickTheRobot — Pick the right robot for your business',
    template: '%s | PickTheRobot',
  },
  description:
    'Compare warehouse, cleaning, and restaurant robots by fit, cost model, and deployment. Rules-based recommendations and vendor matches.',
  icons: {
    icon: [{ url: '/icon', sizes: '96x96', type: 'image/png' }],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
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
        <SpeedInsights />
      </body>
    </html>
  );
}
