import { Provider } from '@spryker-oryx/di';
import { DefaultI18nLoader } from './default-i18n.loader';
import { DefaultI18nProcessor } from './default-i18n.processor';
import { DefaultI18nService } from './default-i18n.service';
import { GlobalizeService } from './globalize.service';
import { I18nLoader } from './i18n.loader';
import { I18nProcessor } from './i18n.processor';
import { I18nService } from './i18n.service';

export const i18nProviders: Provider[] = [
  { provide: I18nService, useClass: DefaultI18nService },
  { provide: I18nLoader, useClass: DefaultI18nLoader },
  { provide: I18nProcessor, useClass: DefaultI18nProcessor },
  { provide: GlobalizeService, useClass: GlobalizeService },
];
