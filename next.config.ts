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
    ];
  },
};

export default nextConfig;
