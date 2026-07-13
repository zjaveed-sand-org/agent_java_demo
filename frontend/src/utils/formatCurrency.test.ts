import { describe, expect, it } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('uses the base language when a region-specific locale is provided', () => {
    expect(formatCurrency(1234.56, 'de-DE')).toBe('1.234,56\xa0$');
  });

  it('falls back to English formatting for unknown locales', () => {
    expect(formatCurrency(1234.56, 'fr-FR')).toBe('$1,234.56');
  });
});
