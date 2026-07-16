/**
 * Production smoke test — run after deploy or against a local `next start` server.
 *
 * Usage:
 *   npm run start & npm run smoke
 *   SMOKE_BASE_URL=https://picktherobot.com npm run smoke
 */

const base = (process.env.SMOKE_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

const paths = [
  '/',
  '/warehouse-robots',
  '/cleaning-robots',
  '/restaurant-robots',
  '/vendors',
  '/vendors/locus-robotics',
  '/privacy',
  '/terms',
  '/sitemap.xml',
  '/robots.txt',
  '/amr-vs-agv',
  '/robot-leasing-vs-buying',
  '/raas-pricing',
  '/warehouse-robot-cost',
  '/cleaning-robot-cost',
  '/cleaning-robots-as-a-service',
  '/for-vendors',
  '/blog',
  '/about',
  '/blog/warehouse-robot-cost-2026',
  '/blog/topics/warehouse-automation',
];

async function check(path) {
  const url = `${base}${path}`;
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`${path} → ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  if (path === '/sitemap.xml' && !text.includes('<urlset')) {
    throw new Error(`${path} → missing <urlset>`);
  }
  if (path === '/robots.txt' && !text.includes('Sitemap:')) {
    throw new Error(`${path} → missing Sitemap directive`);
  }
  return path;
}

console.log(`Smoke test: ${base}`);

let failed = false;
for (const path of paths) {
  try {
    await check(path);
    console.log(`  ✓ ${path}`);
  } catch (err) {
    failed = true;
    console.error(`  ✗ ${err.message}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log(`\n${paths.length} routes OK`);
