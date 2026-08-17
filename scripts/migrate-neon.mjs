import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
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
