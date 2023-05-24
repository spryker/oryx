import {
  AppFeature,
  AppPlugin,
  DefaultStorageService,
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
  BapiPushNotificationService,
  PickingListOfflineAdapter,
  PickingListOnlineAdapter,
  PickingListOnlineDefaultAdapter,
  PickingSyncAction,
  PickingSyncActionHandlerService,
} from './services';
import { BapiPushNotificationDefaultAdapter } from './services/adapter/bapi-push-notification-default.adapter';
import { BapiPushNotificationAdapter } from './services/adapter/bapi-push-notification.adapter';
import { BapiPushNotificationDefaultService } from './services/bapi-push-notification-default.service';

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
        provide: PushProvider,
        useFactory: () =>
          new WebPushProvider({
            applicationServerKey:
              'BGqNWbv0hWM5CQ1-KwAfSQBMC6TMVFyrnh3vQp37oGCNvQ6eG_HyMjxBFJRWeCPTbzDoxcjhxLJS8Ck8r1G2oFw',
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
