import { I18nFeature } from '@spryker-oryx/i18n';

export const labsI18nFeature = new I18nFeature({
  load: (localeId) => {
    switch (localeId) {
      case 'de':
        return import(`./translations/de.js`);
      case 'ar':
        return import(`./translations/ar.js`);
      default:
        return import(`./translations/en.js`);
    }
  },
});
