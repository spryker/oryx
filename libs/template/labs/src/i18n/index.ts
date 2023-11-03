import { Provider } from '@spryker-oryx/di';
import { I18nFeature, LocaleService } from '@spryker-oryx/i18n';
import { LabsLocaleService } from './locales/labs-locale.service';

// We have to use static strings for imports, as long as vite is
// differently optimize imports in node_modules and outside of it.

export const labsI18nFeature = new I18nFeature({
  load: (localeId) => {
    switch (localeId) {
      case 'de':
        return import('./translations/de.js');
      case 'ar':
        return import('./translations/ar.js');
      default:
        return import('./translations/en.js');
    }
  },
});

export const i18nLabsProviders: Provider[] = [
  { provide: LocaleService, useClass: LabsLocaleService },
];
