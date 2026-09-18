import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

function loadEnvLocal() {
  const env = { ...process.env };
  try {
    const lines = readFileSync('.env.local', 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      let value = trimmed.slice(idx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[trimmed.slice(0, idx)] = value;
    }
  } catch {
    // optional
  }
  return env;
}

const TEST_EMAIL = 'vendor-test@picktherobot.com';
const TEST_VENDOR_SLUG = 'locus-robotics';
const TEST_CUSTOMER_ID = 'cus_dev_vendor_test';
const TEST_SUBSCRIPTION_ID = 'sub_dev_vendor_test';

const env = loadEnvLocal();
if (!env.DATABASE_URL) {
  console.error('DATABASE_URL is required in .env.local');
  process.exit(1);
}

function normalizeDatabaseUrl(url) {
  return url.replace(/([?&])channel_binding=[^&]*/g, '$1').replace(/[?&]$/, '');
}

const sql = neon(normalizeDatabaseUrl(env.DATABASE_URL));

const existingBySlug = await sql`
  SELECT id, email FROM vendor_accounts WHERE vendor_slug = ${TEST_VENDOR_SLUG} LIMIT 1
`;

let accountId;
if (existingBySlug.length > 0) {
  accountId = existingBySlug[0].id;
  await sql`
    UPDATE vendor_accounts
    SET email = ${TEST_EMAIL}, stripe_customer_id = ${TEST_CUSTOMER_ID}
    WHERE id = ${accountId}
  `;
} else {
  accountId = randomUUID();
  await sql`
    INSERT INTO vendor_accounts (id, email, vendor_slug, stripe_customer_id)
    VALUES (${accountId}, ${TEST_EMAIL}, ${TEST_VENDOR_SLUG}, ${TEST_CUSTOMER_ID})
  `;
}

await sql`
  INSERT INTO vendor_subscriptions (
    stripe_subscription_id, vendor_account_id, tier, status, updated_at
  )
  VALUES (${TEST_SUBSCRIPTION_ID}, ${accountId}, 'verified', 'active', NOW())
  ON CONFLICT (stripe_subscription_id) DO UPDATE
  SET status = 'active', tier = 'verified', updated_at = NOW()
`;

console.log(`Test vendor account ready.`);
console.log(`Email: ${TEST_EMAIL}`);
console.log(`Vendor: ${TEST_VENDOR_SLUG}`);
console.log(`Tier: verified (active)`);
console.log(`\nGenerate a login link:`);
console.log(`  node scripts/vendor-login-link.mjs ${TEST_EMAIL}`);
