import { OauthService } from '@spryker-oryx/auth';
import {
  AppEnvironment,
  ExecPlugin,
  InjectionPlugin,
} from '@spryker-oryx/core';
import { Injector } from '@spryker-oryx/di';
import { DexieIndexedDbService } from '@spryker-oryx/indexed-db';
import {
  combineLatest,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { PickingListEntity, PickingProductEntity } from './entities';
import { PickingListOnlineAdapter } from './services';

export class OfflineDataPlugin extends ExecPlugin {
  protected subscription?: Subscription;

  constructor() {
    super((app) => {
      const injector = app!.requirePlugin(InjectionPlugin).getInjector();

      const env = injector.inject(AppEnvironment, {} as AppEnvironment);

      const authService = injector.inject(OauthService);

      this.subscription = authService
        .isAuthenticated()
        .pipe(
          switchMap((authenticated) => {
            if (authenticated) {
              return this.clearDb(injector).pipe(
                switchMap(() => this.populateDb(injector))
              );
            }
            return of(undefined);
          })
        )
        .subscribe();
    });
  }

  destroy(): void {
    this.subscription?.unsubscribe();
  }

  protected clearDb(injector: Injector): Observable<void> {
    const dexieIdbService = injector.inject(DexieIndexedDbService);

    return combineLatest([
      dexieIdbService.getStore(PickingListEntity),
      dexieIdbService.getStore(PickingProductEntity),
    ]).pipe(
      switchMap(async ([pickingStore, productStore]) => {
        await pickingStore.clear();
        await productStore.clear();
        return undefined;
      })
    );
  }

  protected populateDb(injector: Injector): Observable<void> {
    const onlineAdapter = injector.inject(PickingListOnlineAdapter);
    const dexieIdbService = injector.inject(DexieIndexedDbService);

    return onlineAdapter.get({}).pipe(
      map((pl) => {
        return {
          pickingLists: pl,
          products: pl
            .map((pickingList) => pickingList.items.map((item) => item.product))
            .flat()
            .filter((product, i, arr) => {
              return arr.findIndex((p) => p.id === product.id) === i;
            }),
        };
      }),
      withLatestFrom(
        dexieIdbService.getStore(PickingListEntity),
        dexieIdbService.getStore(PickingProductEntity),
        dexieIdbService.getDb()
      ),
      switchMap(
        ([{ pickingLists, products }, pickingListsStore, productStore, db]) => {
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
    );
  }
}
