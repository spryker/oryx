import { AppFeature, AppPlugin } from '@spryker-oryx/core';
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
import { OfflineDemoDataPlugin } from './demo-data-plugin';
import { PickingListEntity, PickingProductEntity } from './entities';
import {
  PickingListOfflineAdapter,
  PickingListOnlineAdapter,
  PickingListOnlineDefaultAdapter,
  PickingSyncAction,
  PickingSyncActionHandlerService,
} from './services';

export class OfflinePickingFeature implements AppFeature {
  providers: Provider[] = this.getProviders();
  plugins: AppPlugin[] = [new OfflineDemoDataPlugin()];

  protected getProviders(): Provider[] {
    return [
      ...provideIndexedDbEntities([PickingListEntity, PickingProductEntity]),
      ...provideSyncActionsHandler(
        PickingSyncAction,
        PickingSyncActionHandlerService
      ),
      { provide: PickingListService, useClass: PickingListDefaultService },
      { provide: PickingListAdapter, useClass: PickingListOfflineAdapter },
      {
        provide: PickingListOnlineAdapter,
        useClass: PickingListOnlineDefaultAdapter,
      },
      { provide: PickingHttpService, useClass: PickingHttpDefaultService },
    ];
  }
}
