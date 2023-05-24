import { AppInitializer } from '@spryker-oryx/core';
import { OfflinePickingFeature } from './feature';
import { SwPushInitializerService } from './services';

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
