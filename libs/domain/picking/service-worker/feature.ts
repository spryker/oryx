import {
  AppInitializer,
  AppPlugin,
} from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
// import { DefaultLocaleAdapter, LocaleAdapter } from '@spryker-oryx/i18n';
import {
  OfflinePickingFeature as OfflinePickingFeatureBasic,
} from '@spryker-oryx/picking/offline';
import {
  PushInitializerService,
} from './services';

export class OfflinePickingFeature extends OfflinePickingFeatureBasic {
  providers: Provider[] = this.getProviders();
  plugins: AppPlugin[] = [];

  protected getProviders(): Provider[] {
    return [
      {
        provide: AppInitializer,
        useClass: PushInitializerService,
      },
      ...super.providers
      // {
      //   provide: LocaleAdapter,
      //   useClass: DefaultLocaleAdapter,
      // },
    ];
  }
}


