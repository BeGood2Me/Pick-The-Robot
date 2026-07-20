import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: projectRoot,
  async redirects() {
    return [
      {
        source: '/vendors/autoguide-mobile-robots',
        destination: '/vendors/mir-mobile-industrial-robots',
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
