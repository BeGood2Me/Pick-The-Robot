import { describe, it, expect, beforeEach } from 'vitest';
import { encryptApiKey, decryptApiKey } from '../src/lib/api/keyStoreCrypto';

describe('api key encryption', () => {
  beforeEach(() => {
    delete process.env.API_KEY_ENCRYPTION_KEY;
  });

  it('round-trips encrypted pending keys in development', () => {
    const plaintext = 'ptr_starter_testvalue123';
    const ciphertext = encryptApiKey(plaintext);
    expect(ciphertext).not.toContain(plaintext);
    expect(decryptApiKey(ciphertext)).toBe(plaintext);
  });
});
