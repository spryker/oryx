import {
  AppFeature,
  AppPlugin,
  DefaultStorageService,
  StorageService,
  AppInitializer,
} from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  IndexedDbStorageMethod,
  provideIndexedDbEntities,
} from '@spryker-oryx/indexed-db';
import { provideSyncActionsHandler } from '@spryker-oryx/offline/sync';
import {
  PickingHttpDefaultService,
  PickingHttpService,
  PickingListAdapter,
  PickingListDefaultService,
  PickingListService,
} from '@spryker-oryx/picking/api';
import {
  PickingListEntity, 
  PickingProductEntity,
  BapiPushNotificationAdapter,
  BapiPushNotificationDefaultAdapter,
  BapiPushNotificationDefaultService,
  BapiPushNotificationService,
  PickingListOfflineAdapter,
  PickingListOnlineAdapter,
  PickingListOnlineDefaultAdapter,
  PickingSyncAction,
  PickingSyncActionHandlerService,
} from '@spryker-oryx/picking/offline';
import {
  PushInitializerService,
} from './services';

export class OfflinePickingFeature implements AppFeature {
  providers: Provider[] = this.getProviders();
  plugins: AppPlugin[] = [];

  protected getProviders(): Provider[] {
    return [
      ...provideIndexedDbEntities([PickingListEntity, PickingProductEntity]),
      ...provideSyncActionsHandler(
        PickingSyncAction,
        PickingSyncActionHandlerService
      ),
      {
        provide: AppInitializer,
        useClass: PushInitializerService,
      },
      {
        provide: BapiPushNotificationService,
        useClass: BapiPushNotificationDefaultService,
      },
      {
        provide: BapiPushNotificationAdapter,
        useClass: BapiPushNotificationDefaultAdapter,
      },
      { provide: PickingListService, useClass: PickingListDefaultService },
      { provide: PickingListAdapter, useClass: PickingListOfflineAdapter },
      {
        provide: PickingListOnlineAdapter,
        useClass: PickingListOnlineDefaultAdapter,
      },
      { provide: PickingHttpService, useClass: PickingHttpDefaultService },
      {
        provide: StorageService,
        useFactory: () => new DefaultStorageService(IndexedDbStorageMethod),
      },
    ];
  }
}


