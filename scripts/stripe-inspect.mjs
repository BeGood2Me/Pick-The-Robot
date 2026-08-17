import { readFileSync } from 'node:fs';
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

const env = loadEnvLocal();
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const account = await stripe.accounts.retrieve();
console.log('account_id', account.id);
console.log('livemode', account.charges_enabled);

const products = await stripe.products.list({ limit: 20, active: true });
for (const product of products.data) {
  const prices = await stripe.prices.list({ product: product.id, active: true, limit: 10 });
  console.log(
  JSON.stringify({
    product: product.name,
    productId: product.id,
    prices: prices.data.map((p) => ({
      id: p.id,
      amount: p.unit_amount,
      interval: p.recurring?.interval,
      metadata: p.metadata,
    })),
  }),
  );
}
