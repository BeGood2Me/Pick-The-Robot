'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FOR_VENDORS_PATH } from '@/lib/content/for-vendors';

export function VendorLoginForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [devLink, setDevLink] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('idle');
    setMessage(null);
    setDevLink(null);
    try {
      const response = await fetch('/api/vendor/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { loginUrl?: string; message?: string };
      if (!response.ok) throw new Error(data.message ?? 'Login request failed.');
      setStatus('sent');
      if (data.loginUrl) setDevLink(data.loginUrl);
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Login request failed.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-md">
      <h2 className="text-lg font-semibold">Vendor login</h2>
      <p className="mt-2 text-sm text-ink-muted">
        Enter the email on your vendor account. We will send a one-time sign-in link.
      </p>
      <label className="mt-4 block text-sm font-medium" htmlFor="vendor-email">
        Email
      </label>
      <input
        id="vendor-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="mt-4 inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
      >
        Send login link
      </button>
      {status === 'sent' && (
        <p className="mt-3 text-sm text-ink-muted">
          If an account exists for that email, we sent a one-time sign-in link.
          {devLink && (
            <>
              {' '}
              <a href={devLink} className="text-accent hover:underline">
                Open dev login link
              </a>
            </>
          )}
        </p>
      )}
      {message && <p className="mt-3 text-sm text-warn">{message}</p>}
      <p className="mt-4 text-sm">
        <Link href={FOR_VENDORS_PATH} className="text-accent hover:underline">
          Back to for vendors
        </Link>
      </p>
    </form>
  );
}
