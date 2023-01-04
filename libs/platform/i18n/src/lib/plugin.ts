import { App, AppPlugin, InjectionPlugin } from '@spryker-oryx/core';
import { i18nInjectable } from '@spryker-oryx/utilities';
import { I18nServiceInjectableAdapter } from './i18n-service-injectable.adapter';
import { I18nService } from './i18n.service';

export class I18nPlugin implements AppPlugin {
  getName(): string {
    return 'fes$i18n';
  }

  apply(app: App): void | Promise<void> {
    i18nInjectable.inject(
      new I18nServiceInjectableAdapter(
        app.requirePlugin(InjectionPlugin).getInjector().inject(I18nService)
      )
    );
  }
}
