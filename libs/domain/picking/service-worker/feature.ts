import {
  AppFeature,
  AppInitializer,
  AppPlugin,
  DefaultStorageService,
  injectEnv,
  StorageService,
} from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
// import { DefaultLocaleAdapter, LocaleAdapter } from '@spryker-oryx/i18n';
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
} from '../src/services';
import { PushProvider } from '@spryker-oryx/push-notification';
import { WebPushProvider } from '@spryker-oryx/push-notification/web';
import { PickingListEntity, PickingProductEntity } from '../offline/entities';
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
} from '../offline/services';

import {
  PushInitializerService,
} from '.services';

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
        useFactory: () => new DefaultStorageService(IndexedDbStorageMethod),
      },
      // {
      //   provide: LocaleAdapter,
      //   useClass: DefaultLocaleAdapter,
      // },
    ];
  }
}


