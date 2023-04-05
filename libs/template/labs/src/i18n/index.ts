import { I18nFeature } from '@spryker-oryx/i18n';

export * from './translations/de';

// to avoid console errors, we provide a list of supported languages
const supported = ['en', 'de', 'ar'];

export const labsI18nFeature = new I18nFeature({
  load: (localeId) => {
    if (supported.includes(localeId)) {
      return import(`./translations/${localeId}.ts`);
    } else {
      return Promise.resolve();
    }
  },
});
