import { I18nFeature } from '@spryker-oryx/i18n';

// We have to use static strings for imports, as long as vite is differently optimize imports in node_modules and
// outside of it. This is a workaround for the issue.

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
