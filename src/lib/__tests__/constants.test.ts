import { STORAGE_PREFIX, HONESTY_DISCLAIMER, AI_TIMEOUT_MS } from '../constants';

describe('Application Constants & Invariants', () => {
  it('enforces the future-you: prefix for localStorage isolation', () => {
    expect(STORAGE_PREFIX).toBe('future-you:');
  });

  it('embeds the reflection honesty disclaimer', () => {
    expect(HONESTY_DISCLAIMER).toContain('reflection tool, not a prediction engine');
  });

  it('defines 60 second AI timeout', () => {
    expect(AI_TIMEOUT_MS).toBe(60000);
  });
});
