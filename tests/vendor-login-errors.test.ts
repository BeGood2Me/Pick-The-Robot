import { describe, expect, it } from 'vitest';
import { vendorLoginErrorMessage } from '../src/lib/vendor/loginErrors';

describe('vendorLoginErrorMessage', () => {
  it('maps known auth error codes', () => {
    expect(vendorLoginErrorMessage('missing_token')).toContain('?token=');
    expect(vendorLoginErrorMessage('invalid_token')).toContain('expired');
  });

  it('returns null for empty input', () => {
    expect(vendorLoginErrorMessage(undefined)).toBeNull();
  });
});
