const localeMap: Record<string, string> = {
  en: 'en-US',
  de: 'de-DE',
  es: 'es-ES',
  zh: 'zh-CN',
};

const normalizeLanguage = (language: string): string => language.split('-')[0].toLowerCase();

export const formatCurrency = (amount: number, language: string): string =>
  new Intl.NumberFormat(localeMap[normalizeLanguage(language)] ?? localeMap.en, {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
