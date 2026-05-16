import { describe, expect, it } from 'vitest';
import { eventEnvelopeSchema } from './index.js';

describe('contracts', () => {
  it('validates event envelopes', () => {
    expect(() =>
      eventEnvelopeSchema.parse({
        id: 'evt_1',
        version: 1,
        type: 'workflow.started',
        source: 'test',
        tenantId: 'tenant',
        correlationId: 'corr',
        timestamp: new Date().toISOString(),
        payload: {},
        tags: {},
      }),
    ).not.toThrow();
  });
});
