import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync('src/lib/matching/vendors.ts', 'utf-8');
const start = src.indexOf('= [');
const end = src.lastIndexOf('];');
if (start === -1 || end === -1) throw new Error('Could not find VENDORS array');

const arrayLiteral = src.slice(start + 2, end + 1);
// eslint-disable-next-line no-eval
const vendors = eval(arrayLiteral);

for (const v of vendors) {
  if (v.sponsored && !v.affiliateUrl) {
    v.affiliateUrl = v.outboundUrl;
  }
}

writeFileSync('src/data/vendors.json', JSON.stringify(vendors, null, 2));
console.log(`Exported ${vendors.length} vendors to src/data/vendors.json`);
