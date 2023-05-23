import { AppInitializer } from '@spryker-oryx/core';
import { SwPushInitializerService } from './services';
import { OfflinePickingFeature } from './feature';

export class SwOfflinePickingFeature extends OfflinePickingFeature {
  plugins = [];

  providers = [
    ...super.getProviders(),
    {
      provide: AppInitializer,
      useClass: SwPushInitializerService,
    },
  ];
}
