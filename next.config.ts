import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: projectRoot,
  async headers() {
    return [
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/favicon.svg',
        destination: '/images/brand/picktherobot-robot-mark.svg',
        permanent: true,
      },
      {
        source: '/favicon-32x32.png',
        destination: '/images/brand/picktherobot-robot-mark-32x32.png',
        permanent: true,
      },
      {
        source: '/favicon-48x48.png',
        destination: '/images/brand/picktherobot-robot-mark-48x48.png',
        permanent: true,
      },
      {
        source: '/apple-icon.png',
        destination: '/images/brand/picktherobot-apple-touch-icon-180x180.png',
        permanent: true,
      },
      {
        source: '/vendors/autoguide-mobile-robots',
        destination: '/vendors/mir-mobile-industrial-robots',
        permanent: true,
      },
      {
        source: '/blog/topics/humanoid-robotics',
        destination: '/humanoid-robots',
        permanent: true,
      },
      {
        source: '/developers',
        destination: '/api',
        permanent: true,
      },
      {
        source: '/developers/reference',
        destination: '/api/reference',
        permanent: true,
      },
      {
        source: '/developers/success',
        destination: '/api/success',
        permanent: true,
      },
      // Strip trailing slashes (except root) without host-based middleware —
      // host middleware previously 308'd localhost and broke local browsers.
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
