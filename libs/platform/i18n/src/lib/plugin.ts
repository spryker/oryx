import { App, AppPlugin, InjectionPlugin } from '@spryker-oryx/core';
import {
  I18nInjectable,
  Injectable,
  i18nInjectable,
} from '@spryker-oryx/utilities';
import { I18nService, I18nServiceInjectableAdapter } from './i18n';

export class I18nPlugin implements AppPlugin {
  constructor(
    protected adapterType: new (
      i18n: I18nService
    ) => I18nInjectable = I18nServiceInjectableAdapter,
    protected _i18nInjectable: Injectable<I18nInjectable> = i18nInjectable
  ) {}

  getName(): string {
    return 'oryx$i18n';
  }

  apply(app: App): void | Promise<void> {
    this._i18nInjectable.inject(
      new this.adapterType(
        app.requirePlugin(InjectionPlugin).getInjector().inject(I18nService)
      )
    );
  }
}
