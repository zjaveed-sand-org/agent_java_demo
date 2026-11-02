import { describe, expect, it } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('uses the base language when a region-specific locale is provided', () => {
    const expected = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'USD',
    }).format(1234.56);

    expect(formatCurrency(1234.56, 'de-DE')).toBe(expected);
  });

  it('falls back to English formatting for unknown locales', () => {
    const expected = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(1234.56);

    expect(formatCurrency(1234.56, 'fr-FR')).toBe(expected);
  });
});
