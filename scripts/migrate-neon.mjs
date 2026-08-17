import { readFileSync } from 'node:fs';
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
      env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
    }
  } catch {
    // optional
  }
  return env;
}

const env = loadEnvLocal();
const url = env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is required.');
  process.exit(1);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS api_keys (
    key_hash TEXT PRIMARY KEY,
    tier TEXT NOT NULL CHECK (tier IN ('starter', 'pro')),
    customer_id TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'revoked')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    subscription_id TEXT
  )
`;

await sql`
  CREATE INDEX IF NOT EXISTS api_keys_customer_id_idx ON api_keys (customer_id)
`;

await sql`ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS subscription_id TEXT`;

await sql`
  CREATE INDEX IF NOT EXISTS api_keys_subscription_id_idx ON api_keys (subscription_id)
`;

await sql`
  CREATE TABLE IF NOT EXISTS pending_checkout_keys (
    checkout_session_id TEXT PRIMARY KEY,
    api_key TEXT NOT NULL,
    key_hash TEXT NOT NULL REFERENCES api_keys (key_hash) ON DELETE CASCADE,
    retrieved BOOLEAN NOT NULL DEFAULT FALSE,
    tier TEXT NOT NULL CHECK (tier IN ('starter', 'pro'))
  )
`;

console.log('Neon API key tables are ready.');

await sql`
  CREATE TABLE IF NOT EXISTS api_rate_limit_buckets (
    client_id TEXT NOT NULL,
    window_start_ms BIGINT NOT NULL,
    request_count INT NOT NULL DEFAULT 0,
    PRIMARY KEY (client_id, window_start_ms)
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS api_monthly_usage (
    client_id TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    period TEXT NOT NULL,
    request_count INT NOT NULL DEFAULT 0,
    PRIMARY KEY (client_id, endpoint, period)
  )
`;

await sql`ALTER TABLE pending_checkout_keys ADD COLUMN IF NOT EXISTS api_key_ciphertext TEXT`;
await sql`ALTER TABLE pending_checkout_keys ADD COLUMN IF NOT EXISTS recovery_token_hash TEXT`;

console.log('Neon limits and key-security columns are ready.');

await sql`
  CREATE TABLE IF NOT EXISTS vendor_accounts (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    vendor_slug TEXT NOT NULL UNIQUE,
    stripe_customer_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;
await sql`CREATE INDEX IF NOT EXISTS vendor_accounts_email_idx ON vendor_accounts (email)`;

await sql`
  CREATE TABLE IF NOT EXISTS vendor_subscriptions (
    stripe_subscription_id TEXT PRIMARY KEY,
    vendor_account_id TEXT NOT NULL REFERENCES vendor_accounts (id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('verified', 'sponsored')),
    status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;
await sql`CREATE INDEX IF NOT EXISTS vendor_subscriptions_account_idx ON vendor_subscriptions (vendor_account_id)`;

await sql`
  CREATE TABLE IF NOT EXISTS vendor_profiles (
    vendor_slug TEXT PRIMARY KEY,
    logo_url TEXT,
    affiliate_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS vendor_login_tokens (
    token_hash TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;
await sql`CREATE INDEX IF NOT EXISTS vendor_login_tokens_email_idx ON vendor_login_tokens (email)`;

await sql`
  CREATE TABLE IF NOT EXISTS vendor_clicks (
    id BIGSERIAL PRIMARY KEY,
    vendor_slug TEXT NOT NULL,
    context TEXT,
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;
await sql`CREATE INDEX IF NOT EXISTS vendor_clicks_slug_idx ON vendor_clicks (vendor_slug, clicked_at DESC)`;

console.log('Neon vendor partner tables are ready.');
