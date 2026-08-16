import { describe, it, expect } from 'vitest';
import {
  AMR_DEFINITION,
  AGV_DEFINITION,
  getCategoryDefinitions,
  getDefinitionsById,
  AMR_VS_AGV_DEFINITION_IDS,
} from '../src/lib/content/definitions';

describe('canonical definitions', () => {
  it('returns warehouse definitions including AMR and AGV', () => {
    const defs = getCategoryDefinitions('warehouse');
    expect(defs.some((d) => d.id === 'amr')).toBe(true);
    expect(defs.some((d) => d.id === 'agv')).toBe(true);
  });

  it('keeps identical AMR text for snippet reuse', () => {
    const fromWarehouse = getCategoryDefinitions('warehouse').find((d) => d.id === 'amr');
    const fromComparison = getDefinitionsById([...AMR_VS_AGV_DEFINITION_IDS]).find((d) => d.id === 'amr');
    expect(fromWarehouse?.answer).toBe(AMR_DEFINITION.answer);
    expect(fromComparison?.answer).toBe(AMR_DEFINITION.answer);
  });

  it('resolves definitions by id in order', () => {
    const defs = getDefinitionsById(['agv', 'amr']);
    expect(defs).toHaveLength(2);
    expect(defs[0].id).toBe('agv');
    expect(defs[1].id).toBe('amr');
  });
});
