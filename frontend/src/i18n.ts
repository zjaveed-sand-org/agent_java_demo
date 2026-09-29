import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import cartDe from './locales/de/cart.json';
import commonDe from './locales/de/common.json';
import productsDe from './locales/de/products.json';
import cartEn from './locales/en/cart.json';
import commonEn from './locales/en/common.json';
import productsEn from './locales/en/products.json';
import cartEs from './locales/es/cart.json';
import commonEs from './locales/es/common.json';
import productsEs from './locales/es/products.json';
import cartZh from './locales/zh/cart.json';
import commonZh from './locales/zh/common.json';
import productsZh from './locales/zh/products.json';

const LANGUAGE_STORAGE_KEY = 'octocat-language';
const supportedLanguages = ['en', 'de', 'es', 'zh'] as const;

type SupportedLanguage = (typeof supportedLanguages)[number];

const isSupportedLanguage = (language: string): language is SupportedLanguage =>
  supportedLanguages.includes(language as SupportedLanguage);

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage && isSupportedLanguage(storedLanguage)) {
    return storedLanguage;
  }

  const browserLanguage = window.navigator.language.split('-')[0];
  return isSupportedLanguage(browserLanguage) ? browserLanguage : 'en';
};

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: commonEn,
      products: productsEn,
      cart: cartEn,
    },
    de: {
      common: commonDe,
      products: productsDe,
      cart: cartDe,
    },
    es: {
      common: commonEs,
      products: productsEs,
      cart: cartEs,
    },
    zh: {
      common: commonZh,
      products: productsZh,
      cart: cartZh,
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'products', 'cart'],
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (language) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
});

export default i18n;
