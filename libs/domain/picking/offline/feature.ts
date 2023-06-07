import {
  AppFeature,
  AppInitializer,
  AppPlugin,
  DefaultStorageService,
  injectEnv,
  StorageService,
  StorageType,
} from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideIndexedDbEntities } from '@spryker-oryx/indexed-db';
import { provideSyncActionsHandler } from '@spryker-oryx/offline';
import {
  PickingHttpDefaultService,
  PickingHttpService,
  PickingListAdapter,
  PickingListDefaultService,
  PickingListService,
} from '@spryker-oryx/picking';
import { PushProvider } from '@spryker-oryx/push-notification';
import { WebPushProvider } from '@spryker-oryx/push-notification/web';
import { OfflineDataPlugin } from './data-plugin';
import { PickingListEntity, PickingProductEntity } from './entities';
import { PushNotificationPlugin } from './push-notification-plugin';
import {
  BapiPushNotificationAdapter,
  BapiPushNotificationDefaultAdapter,
  BapiPushNotificationDefaultService,
  BapiPushNotificationService,
  PickingListOfflineAdapter,
  PickingListOnlineAdapter,
  PickingListOnlineDefaultAdapter,
  PickingSyncAction,
  PickingSyncActionHandlerService,
  SwPushInitializerService,
} from './services';

export class OfflinePickingFeature implements AppFeature {
  providers: Provider[] = this.getProviders();
  plugins: AppPlugin[] = [
    new OfflineDataPlugin(),
    new PushNotificationPlugin(),
  ];

  protected getProviders(): Provider[] {
    return [
      ...provideIndexedDbEntities([PickingListEntity, PickingProductEntity]),
      ...provideSyncActionsHandler(
        PickingSyncAction,
        PickingSyncActionHandlerService
      ),
      {
        provide: AppInitializer,
        useClass: SwPushInitializerService,
      },
      {
        provide: PushProvider,
        useFactory: () =>
          new WebPushProvider({
            applicationServerKey: injectEnv(
              'ORYX_FULFILLMENT_PUBLIC_VAPID_KEY'
            ),
          }),
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
        useFactory: () => new DefaultStorageService(StorageType.Idb),
      },
    ];
  }
}
