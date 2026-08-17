ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS subscription_id TEXT;

CREATE INDEX IF NOT EXISTS api_keys_subscription_id_idx ON api_keys (subscription_id);
