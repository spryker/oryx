import { AppFeature, AppPlugin } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/injector';
import { isDefined } from '@spryker-oryx/utilities';
import { DefaultI18nLoaderConfig } from './default-i18n.loader';
import { I18nPlugin } from './plugin';
import { i18nProviders } from './providers';

export type I18nFeatureOptions = DefaultI18nLoaderConfig;

export class I18nFeature implements AppFeature {
  providers: Provider[];
  plugins: AppPlugin[] = [new I18nPlugin()];

  constructor(options?: I18nFeatureOptions) {
    this.providers = [
      ...i18nProviders,
      options && { provide: DefaultI18nLoaderConfig, useValue: options },
    ].filter(isDefined);
  }
}
