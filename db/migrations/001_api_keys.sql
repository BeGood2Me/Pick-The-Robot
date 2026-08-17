CREATE TABLE IF NOT EXISTS api_keys (
  key_hash TEXT PRIMARY KEY,
  tier TEXT NOT NULL CHECK (tier IN ('starter', 'pro')),
  customer_id TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS api_keys_customer_id_idx ON api_keys (customer_id);

CREATE TABLE IF NOT EXISTS pending_checkout_keys (
  checkout_session_id TEXT PRIMARY KEY,
  api_key TEXT NOT NULL,
  key_hash TEXT NOT NULL REFERENCES api_keys (key_hash) ON DELETE CASCADE,
  retrieved BOOLEAN NOT NULL DEFAULT FALSE,
  tier TEXT NOT NULL CHECK (tier IN ('starter', 'pro'))
);
