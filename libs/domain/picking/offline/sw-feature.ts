import { AppFeature, AppInitializer } from '@spryker-oryx/core';
import { SwPushInitializerService } from './services';

export class SwOfflinePickingFeature implements AppFeature {
  providers = [
    {
      provide: AppInitializer,
      useClass: SwPushInitializerService,
    },
  ];
}
