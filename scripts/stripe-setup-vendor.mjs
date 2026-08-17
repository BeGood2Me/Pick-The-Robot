import { readFileSync, writeFileSync } from 'node:fs';
import Stripe from 'stripe';

function loadEnvLocal() {
  const env = {};
  const lines = readFileSync('.env.local', 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return env;
}

function upsertEnvLocal(updates) {
  const lines = readFileSync('.env.local', 'utf8').split(/\r?\n/);
  const keys = new Set(Object.keys(updates));
  const kept = lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return true;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return true;
    return !keys.has(trimmed.slice(0, idx));
  });
  const additions = Object.entries(updates).map(([key, value]) => `${key}=${value}`);
  writeFileSync('.env.local', [...kept, ...additions].join('\n') + '\n', 'utf8');
}

const env = loadEnvLocal();
const secretKey =
  process.env.STRIPE_SECRET_KEY ||
  env.STRIPE_SECRET_KEY ||
  env.STRIPE_LIVE_SECRET_KEY ||
  env.STRIPE_TEST_SECRET_KEY;

if (!secretKey) {
  console.error('Set STRIPE_SECRET_KEY or STRIPE_LIVE_SECRET_KEY in .env.local');
  process.exit(1);
}

const stripe = new Stripe(secretKey);

async function ensureProduct(name, amountCents, metadata) {
  const products = await stripe.products.list({ active: true, limit: 100 });
  let product = products.data.find((item) => item.name === name);
  if (!product) {
    product = await stripe.products.create({ name, metadata });
    console.log(`Created product ${name}: ${product.id}`);
  }

  const prices = await stripe.prices.list({ product: product.id, active: true, limit: 20 });
  let price = prices.data.find(
    (item) => item.unit_amount === amountCents && item.recurring?.interval === 'month',
  );
  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      currency: 'usd',
      unit_amount: amountCents,
      recurring: { interval: 'month' },
    });
    console.log(`Created price for ${name}: ${price.id}`);
  }

  return price.id;
}

const verifiedPriceId = await ensureProduct('PickTheRobot Vendor — Verified Partner', 9900, {
  app: 'picktherobot_vendor',
  tier: 'verified',
});
const sponsoredPriceId = await ensureProduct('PickTheRobot Vendor — Sponsored Boost', 4900, {
  app: 'picktherobot_vendor',
  tier: 'sponsored',
});

const updates = {
  STRIPE_VENDOR_VERIFIED_PRICE_ID: verifiedPriceId,
  STRIPE_VENDOR_SPONSORED_PRICE_ID: sponsoredPriceId,
};

if (secretKey.startsWith('sk_live_')) {
  updates.STRIPE_LIVE_VENDOR_VERIFIED_PRICE_ID = verifiedPriceId;
  updates.STRIPE_LIVE_VENDOR_SPONSORED_PRICE_ID = sponsoredPriceId;
}

upsertEnvLocal(updates);

console.log('\nVendor Stripe prices ready:');
console.log(`  STRIPE_VENDOR_VERIFIED_PRICE_ID=${verifiedPriceId}`);
console.log(`  STRIPE_VENDOR_SPONSORED_PRICE_ID=${sponsoredPriceId}`);
console.log('\nEnable Stripe Customer Portal in Dashboard → Settings → Billing → Customer portal.');
