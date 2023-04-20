import { Provider } from '@spryker-oryx/di';
import {
  DefaultI18nLoader,
  DefaultI18nProcessor,
  DefaultI18nService,
  I18nLoader,
  I18nProcessor,
  I18nService,
} from './i18n';
import { GlobalizeService } from './i18n/globalize.service';
import {
  DefaultLocaleMetaInitializer,
  LocaleMetaInitializer,
} from './initializers';
import { DefaultLocaleService, LocaleService } from './locale';

export const i18nProviders: Provider[] = [
  { provide: I18nService, useClass: DefaultI18nService },
  { provide: I18nLoader, useClass: DefaultI18nLoader },
  { provide: I18nProcessor, useClass: DefaultI18nProcessor },
  { provide: GlobalizeService, useClass: GlobalizeService },
  { provide: LocaleService, useClass: DefaultLocaleService },
  { provide: LocaleMetaInitializer, useClass: DefaultLocaleMetaInitializer },
];
