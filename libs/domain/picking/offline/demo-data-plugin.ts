import {
  AppEnvironment,
  ExecPlugin,
  InjectionPlugin,
} from '@spryker-oryx/core';
import { Injector } from '@spryker-oryx/di';
import { DexieIndexedDbService } from '@spryker-oryx/indexed-db';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { PickingListEntity, PickingProductEntity } from './entities';
import { PickingListOnlineAdapter } from './services';

export class OfflineDemoDataPlugin extends ExecPlugin {
  constructor() {
    super((app) => {
      const injector = app!.requirePlugin(InjectionPlugin).getInjector();

      const env = injector.inject(AppEnvironment, {} as AppEnvironment);

      // TODO - re-enable this check when online features are added to orchestration. We'd like to display something in netlify for the time being.
      /*
      if (!env.DEV) {
        return;
      }
      */

      const dexieIdbService = injector.inject(DexieIndexedDbService);

      dexieIdbService.onPopulate(() =>
        setTimeout(() => this.populateDb(injector))
      );
    });
  }

  protected async populateDb(injector: Injector): Promise<void> {
    const onlineAdapter = injector.inject(PickingListOnlineAdapter);
    const dexieIdbService = injector.inject(DexieIndexedDbService);

    onlineAdapter
      .get()
      .pipe(
        map((pl) => {
          const productIds = new Set<string>();

          return {
            pickingLists: pl,
            products: pl
              .map((pickingList) =>
                pickingList.items.map((item) => item.product)
              )
              .flat()
              .filter((product) => {
                if (productIds.has(product.id)) return false;

                productIds.add(product.id);
                return true;
              }),
          };
        }),
        withLatestFrom(
          dexieIdbService.getStore(PickingListEntity),
          dexieIdbService.getStore(PickingProductEntity),
          dexieIdbService.getDb()
        ),
        switchMap(
          ([
            { pickingLists, products },
            pickingListsStore,
            productStore,
            db,
          ]) => {
            return db.transaction(
              'readwrite',
              [pickingListsStore, productStore],
              () => {
                pickingListsStore.bulkAdd(pickingLists);
                productStore.bulkAdd(products);
              }
            );
          }
        )
      )
      .subscribe();
  }
}
