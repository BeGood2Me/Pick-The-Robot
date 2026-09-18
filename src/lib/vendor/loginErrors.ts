export const VENDOR_LOGIN_ERRORS: Record<string, string> = {
  missing_token:
    'That sign-in link is incomplete. Open the full URL from your email or CLI output, including the token after ?token=.',
  invalid_token:
    'That sign-in link expired or was already used. Request a new one below.',
  no_account:
    'No vendor account exists for that email yet. Subscribe on the vendors page first.',
};

export function vendorLoginErrorMessage(code: string | undefined): string | null {
  if (!code) return null;
  return VENDOR_LOGIN_ERRORS[code] ?? 'Sign-in failed. Request a new login link and try again.';
}
