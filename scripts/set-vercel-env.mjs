import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

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

function setVercelEnv(name, value, target) {
  const result = spawnSync(
    'npx',
    ['vercel', 'env', 'add', name, target, '--force'],
    {
      input: value,
      encoding: 'utf8',
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    },
  );
  if (result.status !== 0) {
    throw new Error(
      `Failed to set ${name} for ${target}: ${result.stderr || result.stdout}`,
    );
  }
}

const env = loadEnvLocal();
const neonUrl = process.env.DATABASE_URL;
if (!neonUrl) {
  throw new Error('Set DATABASE_URL in the shell before running this script.');
}

function resolveLiveStripeConfig(env) {
  const secretKey =
    env.STRIPE_LIVE_SECRET_KEY ||
    (env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? env.STRIPE_SECRET_KEY : null);
  const webhookSecret = env.STRIPE_LIVE_WEBHOOK_SECRET || null;
  const starterPriceId = env.STRIPE_LIVE_STARTER_PRICE_ID || null;
  const proPriceId = env.STRIPE_LIVE_PRO_PRICE_ID || null;
  if (!secretKey || !webhookSecret || !starterPriceId || !proPriceId) return null;
  return { secretKey, webhookSecret, starterPriceId, proPriceId };
}

function resolveTestStripeConfig(env) {
  const secretKey = env.STRIPE_TEST_SECRET_KEY
    || (env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? env.STRIPE_SECRET_KEY : null);
  if (!secretKey) return null;
  return {
    secretKey,
    webhookSecret: env.STRIPE_TEST_WEBHOOK_SECRET || env.STRIPE_WEBHOOK_SECRET,
    starterPriceId: env.STRIPE_TEST_STARTER_PRICE_ID || env.STRIPE_STARTER_PRICE_ID,
    proPriceId: env.STRIPE_TEST_PRO_PRICE_ID || env.STRIPE_PRO_PRICE_ID,
  };
}

const liveStripe = resolveLiveStripeConfig(env);
const testStripe = resolveTestStripeConfig(env);

const productionVars = {
  DATABASE_URL: neonUrl,
  NEXT_PUBLIC_SITE_URL: 'https://picktherobot.com',
};

if (liveStripe) {
  productionVars.STRIPE_SECRET_KEY = liveStripe.secretKey;
  productionVars.STRIPE_WEBHOOK_SECRET = liveStripe.webhookSecret;
  productionVars.STRIPE_STARTER_PRICE_ID = liveStripe.starterPriceId;
  productionVars.STRIPE_PRO_PRICE_ID = liveStripe.proPriceId;
}

if (env.API_KEY_ENCRYPTION_KEY) {
  productionVars.API_KEY_ENCRYPTION_KEY = env.API_KEY_ENCRYPTION_KEY;
}

const previewVars = {
  NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL || 'https://picktherobot.com',
};

const previewDatabaseUrl = process.env.PREVIEW_DATABASE_URL;
if (previewDatabaseUrl) {
  previewVars.DATABASE_URL = previewDatabaseUrl;
} else {
  console.warn(
    'Preview DATABASE_URL not set — preview deploys will not share production Neon. Set PREVIEW_DATABASE_URL to use a separate branch.',
  );
}

if (testStripe?.secretKey && testStripe.webhookSecret && testStripe.starterPriceId && testStripe.proPriceId) {
  previewVars.STRIPE_SECRET_KEY = testStripe.secretKey;
  previewVars.STRIPE_WEBHOOK_SECRET = testStripe.webhookSecret;
  previewVars.STRIPE_STARTER_PRICE_ID = testStripe.starterPriceId;
  previewVars.STRIPE_PRO_PRICE_ID = testStripe.proPriceId;
}

for (const [name, value] of Object.entries(productionVars)) {
  if (!value) {
    console.warn(`Skipping production ${name} (no value).`);
    continue;
  }
  setVercelEnv(name, value, 'production');
  console.log(`Set production ${name}`);
}

for (const [name, value] of Object.entries(previewVars)) {
  if (!value) {
    console.warn(`Skipping preview ${name} (no value).`);
    continue;
  }
  setVercelEnv(name, value, 'preview');
  console.log(`Set preview ${name}`);
}

if (!liveStripe) {
  console.warn(
    'Skipped production Stripe vars — run scripts/stripe-setup-live.mjs first, then re-run this script.',
  );
}

if (!testStripe) {
  console.warn(
    'Skipped preview Stripe vars — add STRIPE_TEST_SECRET_KEY (sk_test_...) to .env.local to refresh preview deploys.',
  );
}
