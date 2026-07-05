import { describe, it, expect } from 'vitest';
import { defaultAnswersForCategory } from '../src/lib/forms';
import {
  buildSharePayload,
  decodeSharePayload,
  encodeSharePayload,
} from '../src/lib/matching/share';

describe('share payload', () => {
  it('round-trips form answers', () => {
    const answers = defaultAnswersForCategory('warehouse');
    const encoded = encodeSharePayload(buildSharePayload(answers));
    const decoded = decodeSharePayload(encoded);
    expect(decoded?.answers.category).toBe('warehouse');
    if (decoded?.answers.category === 'warehouse') {
      expect(decoded.answers.facilitySizeSqM).toBe(answers.facilitySizeSqM);
    }
  });

  it('rejects invalid token', () => {
    expect(decodeSharePayload('not-valid')).toBeNull();
  });

  it('rejects partial payloads that would backfill defaults', () => {
    const partial = encodeSharePayload({
      v: 1,
      answers: { category: 'warehouse' } as never,
    });
    expect(decodeSharePayload(partial)).toBeNull();
  });
});
