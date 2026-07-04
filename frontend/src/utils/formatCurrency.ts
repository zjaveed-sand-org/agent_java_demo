const localeMap: Record<string, string> = {
  en: 'en-US',
  de: 'de-DE',
  es: 'es-ES',
  zh: 'zh-CN',
};

export const formatCurrency = (amount: number, language: string): string =>
  new Intl.NumberFormat(localeMap[language] ?? localeMap.en, {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
