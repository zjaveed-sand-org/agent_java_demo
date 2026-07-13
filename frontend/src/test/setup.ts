import i18n from '../i18n';
import { beforeEach } from 'vitest';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});
