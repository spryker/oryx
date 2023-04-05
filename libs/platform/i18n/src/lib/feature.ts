import { AppFeature, AppPlugin } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { isDefined } from '@spryker-oryx/utilities';
import { DefaultI18nLoaderConfig } from './i18n';
import { DefaultLocaleAdapterConfig } from './locale';
import { I18nPlugin } from './plugin';
import { i18nProviders } from './providers';

export class I18nFeature implements AppFeature {
  providers: Provider[];
  plugins: AppPlugin[] = [new I18nPlugin()];

  constructor(options?: I18nFeatureOptions) {
    this.providers = [
      ...i18nProviders,
      options && { provide: DefaultI18nLoaderConfig, useValue: options },
      options?.locale && {
        provide: DefaultLocaleAdapterConfig,
        useValue: options.locale,
      },
    ].filter(isDefined);
  }
}

export interface I18nFeatureOptions extends DefaultI18nLoaderConfig {
  locale?: DefaultLocaleAdapterConfig;
}
