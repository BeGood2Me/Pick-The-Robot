import type { Metadata } from 'next';
import { DM_Sans, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AnalyticsConsentProvider } from '@/components/analytics/AnalyticsConsentProvider';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { VendorEntitlementsLoader } from '@/components/vendor/VendorEntitlementsLoader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { BRAND_IMAGE_PATHS } from '@/lib/brand/imagePaths';
import { BASE_URL } from '@/lib/seo/metadata';
import './globals.css';

const sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  adjustFontFallback: true,
});
const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  adjustFontFallback: true,
  preload: true,
});

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'PickTheRobot — Pick the right robot for your business',
    template: '%s | PickTheRobot',
  },
  description:
    'Compare warehouse, cleaning, and restaurant robots by fit, cost model, and deployment. Rules-based recommendations and vendor matches.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      {
        url: BRAND_IMAGE_PATHS.robotMark48,
        sizes: '48x48',
        type: 'image/png',
      },
      {
        url: BRAND_IMAGE_PATHS.robotMarkSvg,
        type: 'image/svg+xml',
      },
      {
        url: BRAND_IMAGE_PATHS.robotMark32,
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: BRAND_IMAGE_PATHS.appleTouch180,
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
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
            <VendorEntitlementsLoader />
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
