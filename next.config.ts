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
        source: '/vendors/autoguide-mobile-robots',
        destination: '/vendors/mir-mobile-industrial-robots',
        permanent: true,
      },
      {
        source: '/blog/topics/humanoid-robotics',
        destination: '/humanoid-robots',
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
