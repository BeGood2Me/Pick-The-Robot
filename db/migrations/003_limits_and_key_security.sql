CREATE TABLE IF NOT EXISTS api_rate_limit_buckets (
  client_id TEXT NOT NULL,
  window_start_ms BIGINT NOT NULL,
  request_count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (client_id, window_start_ms)
);

CREATE TABLE IF NOT EXISTS api_monthly_usage (
  client_id TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  period TEXT NOT NULL,
  request_count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (client_id, endpoint, period)
);

ALTER TABLE pending_checkout_keys ADD COLUMN IF NOT EXISTS api_key_ciphertext TEXT;
ALTER TABLE pending_checkout_keys ADD COLUMN IF NOT EXISTS recovery_token_hash TEXT;
