import { describe, it, expect } from 'vitest';
import { defaultAnswersForCategory } from '../src/lib/forms';
import {
  buildSharePayload,
  decodeSharePayload,
  encodeSharePayload,
} from '../src/lib/matching/share';

describe('share payload', () => {
  it('round-trips warehouse form answers', () => {
    const answers = defaultAnswersForCategory('warehouse');
    const encoded = encodeSharePayload(buildSharePayload(answers));
    const decoded = decodeSharePayload(encoded);
    expect(decoded?.answers.category).toBe('warehouse');
    if (decoded?.answers.category === 'warehouse') {
      expect(decoded.answers.facilitySizeSqM).toBe(answers.facilitySizeSqM);
    }
  });

  it('round-trips cleaning form answers', () => {
    const answers = defaultAnswersForCategory('cleaning');
    const encoded = encodeSharePayload(buildSharePayload(answers));
    const decoded = decodeSharePayload(encoded);
    expect(decoded?.answers.category).toBe('cleaning');
    if (decoded?.answers.category === 'cleaning') {
      expect(decoded.answers.floorAreaSqM).toBe(answers.floorAreaSqM);
    }
  });

  it('round-trips restaurant form answers', () => {
    const answers = defaultAnswersForCategory('restaurant');
    const encoded = encodeSharePayload(buildSharePayload(answers));
    const decoded = decodeSharePayload(encoded);
    expect(decoded?.answers.category).toBe('restaurant');
    if (decoded?.answers.category === 'restaurant') {
      expect(decoded.answers.seatsPerDay).toBe(answers.seatsPerDay);
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
