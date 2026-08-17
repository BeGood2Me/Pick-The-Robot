'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { API_REFERENCE_PATH, DEVELOPERS_PATH } from '@/lib/content/developers';
import type { ApiTier } from '@/lib/api/tiers';

interface ApiKeyRevealProps {
  sessionId: string;
}

const SESSION_KEY_PREFIX = 'ptr_checkout_key:';
const SESSION_TIER_PREFIX = 'ptr_checkout_tier:';
const RECOVERY_TOKEN_PREFIX = 'ptr_recovery_token:';

function cacheKey(sessionId: string): string {
  return `${SESSION_KEY_PREFIX}${sessionId}`;
}

function tierCacheKey(sessionId: string): string {
  return `${SESSION_TIER_PREFIX}${sessionId}`;
}

function recoveryTokenCacheKey(sessionId: string): string {
  return `${RECOVERY_TOKEN_PREFIX}${sessionId}`;
}

export function ApiKeyReveal({ sessionId }: ApiKeyRevealProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [tier, setTier] = useState<ApiTier | null>(null);
  const [recoveryToken, setRecoveryToken] = useState<string | null>(null);
  const [rotated, setRotated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [recoveryCopied, setRecoveryCopied] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Preparing your API key…');
  const [regenerating, setRegenerating] = useState(false);

  const recoveryUrl = useMemo(() => {
    if (!recoveryToken || typeof window === 'undefined') return '';
    const params = new URLSearchParams({
      session_id: sessionId,
      rotate: '1',
      token: recoveryToken,
    });
    return `${window.location.origin}${DEVELOPERS_PATH}/success?${params.toString()}`;
  }, [recoveryToken, sessionId]);

  const fetchKey = useCallback(
    async (options: { rotate?: boolean; attempt?: number } = {}): Promise<void> => {
      const { rotate = false, attempt = 0 } = options;

      const params = new URLSearchParams({ session_id: sessionId });
      if (rotate) {
        params.set('rotate', '1');
        const token =
          typeof window !== 'undefined'
            ? sessionStorage.getItem(recoveryTokenCacheKey(sessionId))
            : null;
        if (!token) {
          throw new Error('Recovery token missing. Use the recovery link from your first checkout.');
        }
        params.set('token', token);
      }

      const response = await fetch(`/api/stripe/session?${params.toString()}`);
      const data = (await response.json()) as {
        apiKey?: string;
        tier?: ApiTier;
        recoveryToken?: string | null;
        rotated?: boolean;
        error?: string;
        message?: string;
      };

      if (response.ok && data.apiKey) {
        sessionStorage.setItem(cacheKey(sessionId), data.apiKey);
        if (data.tier) {
          sessionStorage.setItem(tierCacheKey(sessionId), data.tier);
        }
        if (data.recoveryToken) {
          sessionStorage.setItem(recoveryTokenCacheKey(sessionId), data.recoveryToken);
          setRecoveryToken(data.recoveryToken);
        }
        setApiKey(data.apiKey);
        setTier(data.tier ?? null);
        setRotated(Boolean(data.rotated));
        setError(null);
        return;
      }

      const retryable =
        response.status === 202 ||
        response.status === 402 ||
        data.error === 'key_pending' ||
        data.error === 'payment_incomplete';

      if (retryable && attempt < 12) {
        setLoadingMessage('Confirming your payment…');
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await fetchKey({ rotate, attempt: attempt + 1 });
        return;
      }

      throw new Error(data.message ?? 'Could not load your API key.');
    },
    [sessionId],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const cached =
        typeof window !== 'undefined' ? sessionStorage.getItem(cacheKey(sessionId)) : null;
      const cachedTier =
        typeof window !== 'undefined' ? sessionStorage.getItem(tierCacheKey(sessionId)) : null;
      const cachedRecoveryToken =
        typeof window !== 'undefined'
          ? sessionStorage.getItem(recoveryTokenCacheKey(sessionId))
          : null;

      if (cached) {
        setApiKey(cached);
        if (cachedTier === 'starter' || cachedTier === 'pro') {
          setTier(cachedTier);
        }
        if (cachedRecoveryToken) {
          setRecoveryToken(cachedRecoveryToken);
        }
        return;
      }

      try {
        await fetchKey();
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load your API key.');
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [sessionId, fetchKey]);

  async function copyKey() {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function copyRecoveryLink() {
    if (!recoveryUrl) return;
    await navigator.clipboard.writeText(recoveryUrl);
    setRecoveryCopied(true);
    setTimeout(() => setRecoveryCopied(false), 2000);
  }

  async function regenerateKey() {
    setRegenerating(true);
    setError(null);
    sessionStorage.removeItem(cacheKey(sessionId));
    sessionStorage.removeItem(tierCacheKey(sessionId));
    try {
      await fetchKey({ rotate: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate a new API key.');
    } finally {
      setRegenerating(false);
    }
  }

  if (error) {
    return (
      <div className="card border-warn/40 bg-warn-soft/30">
        <p className="text-sm text-ink">{error}</p>
        <p className="mt-3 text-sm text-ink-muted">
          Email{' '}
          <a href="mailto:hello@picktherobot.com" className="text-accent hover:underline">
            hello@picktherobot.com
          </a>{' '}
          with checkout session <code className="text-xs">{sessionId}</code> if you need help.
        </p>
      </div>
    );
  }

  if (!apiKey) {
    return <p className="text-sm text-ink-muted">{loadingMessage}</p>;
  }

  const tierLabel = tier === 'pro' ? 'Pro' : 'Starter';

  return (
    <div className="space-y-4">
      {rotated ? (
        <div className="card border-accent/30 bg-accent-soft/20">
          <p className="text-sm text-ink">
            New API key issued. Update your apps — your previous key no longer works.
          </p>
        </div>
      ) : null}

      <div className="card border-accent/30 bg-accent-soft/20">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">{tierLabel} API key</p>
        <p className="mt-2 text-sm text-ink-muted">
          Copy this key now. Use it in the{' '}
          <code className="rounded bg-surface-soft px-1 py-0.5 text-xs">X-API-Key</code> header on
          every API request.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-ink p-4 text-xs text-surface-soft">
          <code>{apiKey}</code>
        </pre>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyKey}
            className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            {copied ? 'Copied' : 'Copy API key'}
          </button>
          <button
            type="button"
            onClick={regenerateKey}
            disabled={regenerating || !recoveryToken}
            className="inline-flex rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-soft disabled:opacity-60"
          >
            {regenerating ? 'Generating…' : 'Generate new key'}
          </button>
          <Link
            href={API_REFERENCE_PATH}
            className="inline-flex rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-soft"
          >
            API reference
          </Link>
        </div>
      </div>

      <div className="card">
        <p className="text-sm font-semibold text-ink">Recovery link</p>
        <p className="mt-2 text-sm text-ink-muted">
          Save this private link. It includes a one-time recovery token required to rotate your key
          if you lose access.
        </p>
        {recoveryUrl ? (
          <>
            <p className="mt-3 break-all font-mono text-xs text-ink-muted">{recoveryUrl}</p>
            <button
              type="button"
              onClick={copyRecoveryLink}
              className="mt-3 inline-flex rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-soft"
            >
              {recoveryCopied ? 'Link copied' : 'Copy recovery link'}
            </button>
          </>
        ) : (
          <p className="mt-3 text-sm text-ink-muted">Recovery link will appear after your key loads.</p>
        )}
      </div>
    </div>
  );
}
