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
const liveKey =
  process.env.STRIPE_LIVE_SECRET_KEY ||
  env.STRIPE_LIVE_SECRET_KEY ||
  (env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? env.STRIPE_SECRET_KEY : null);
if (!liveKey) {
  console.error(
    'Add STRIPE_LIVE_SECRET_KEY=sk_live_... to .env.local (or set STRIPE_SECRET_KEY to your live key).',
  );
  process.exit(1);
}

const stripe = new Stripe(liveKey);
const siteUrl = 'https://picktherobot.com';

async function ensureProduct(name, amountCents) {
  const products = await stripe.products.list({ active: true, limit: 100 });
  let product = products.data.find((item) => item.name === name);
  if (!product) {
    product = await stripe.products.create({ name, metadata: { app: 'picktherobot_api' } });
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

const starterPriceId = await ensureProduct('PickTheRobot API — Starter', 4900);
const proPriceId = await ensureProduct('PickTheRobot API — Pro', 14900);

const webhookUrl = `${siteUrl}/api/stripe/webhook`;
const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
let endpoint = endpoints.data.find((item) => item.url === webhookUrl);
if (!endpoint) {
  endpoint = await stripe.webhookEndpoints.create({
    url: webhookUrl,
    enabled_events: [
      'checkout.session.completed',
      'customer.subscription.deleted',
      'customer.subscription.updated',
    ],
    description: 'PickTheRobot API subscriptions',
  });
  console.log(`Created webhook endpoint: ${endpoint.id}`);
} else {
  const requiredEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.deleted',
    'customer.subscription.updated',
  ]);
  const missing = [...requiredEvents].filter((event) => !endpoint.enabled_events.includes(event));
  if (missing.length > 0) {
    endpoint = await stripe.webhookEndpoints.update(endpoint.id, {
      enabled_events: [...new Set([...endpoint.enabled_events, ...missing])],
    });
    console.log(`Updated webhook endpoint events: ${endpoint.id}`);
  } else {
    console.log(`Webhook endpoint already exists: ${endpoint.id}`);
  }
}

const updates = {
  STRIPE_LIVE_SECRET_KEY: liveKey,
  STRIPE_LIVE_STARTER_PRICE_ID: starterPriceId,
  STRIPE_LIVE_PRO_PRICE_ID: proPriceId,
};
if (endpoint.secret) {
  updates.STRIPE_LIVE_WEBHOOK_SECRET = endpoint.secret;
} else {
  console.warn('Webhook secret not returned — keeping existing STRIPE_LIVE_WEBHOOK_SECRET in .env.local.');
}
upsertEnvLocal(updates);

console.log('Live Stripe setup complete.');
console.log('STRIPE_LIVE_STARTER_PRICE_ID', starterPriceId);
console.log('STRIPE_LIVE_PRO_PRICE_ID', proPriceId);
if (endpoint.secret) {
  console.log('STRIPE_LIVE_WEBHOOK_SECRET set in .env.local');
}
