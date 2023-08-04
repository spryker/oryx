import { OauthService, OauthServiceConfig } from '@spryker-oryx/auth';
import { App, AppPlugin, InjectionPlugin } from '@spryker-oryx/core';
import { Injector } from '@spryker-oryx/di';
import { DexieIndexedDbService } from '@spryker-oryx/indexed-db';
import { RouterService } from '@spryker-oryx/router';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { PickingListEntity, PickingProductEntity } from './entities';
import { PickingListOnlineAdapter } from './services';

export class OfflineDataPlugin implements AppPlugin {
  protected subscription?: Subscription;
  protected isRefreshing$ = new BehaviorSubject(false);

  getName(): string {
    return 'oryx.pickingOfflineData';
  }

  apply(app: App): void | Promise<void> {
    const injector = app!.requirePlugin(InjectionPlugin).getInjector();

    const authService = injector.inject(OauthService);
    const routerService = injector.inject(RouterService);
    const oauthConfig = injector.inject(OauthServiceConfig);

    this.subscription = routerService
      .route()
      .pipe(
        switchMap((currentRoute) => {
          const redirectUrl = new URL(
            oauthConfig.providers[0].redirectUrl as string
          );
          if (currentRoute.startsWith(redirectUrl.pathname)) {
            return authService.isAuthenticated();
          }
          return of(undefined);
        }),
        switchMap((authenticated) => {
          if (authenticated) {
            return this.clearDb(injector).pipe(
              tap(() => routerService.navigate('/warehouse-selection'))
            );
          }
          return of(undefined);
        })
      )
      .subscribe();
  }

  destroy(): void {
    this.subscription?.unsubscribe();
  }

  refreshData(injector: Injector): Observable<void> {
    this.isRefreshing$.next(true);
    return this.clearDb(injector).pipe(
      switchMap(() => this.populateDb(injector)),
      tap({
        next: () => {
          this.isRefreshing$.next(false);
        },
        error: () => {
          this.isRefreshing$.next(false);
        },
      })
    );
  }

  isRefreshing(): Observable<boolean> {
    return this.isRefreshing$;
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
        const productIds = new Set<string>();
        return {
          pickingLists: pl,
          products: pl
            .map((pickingList) => pickingList.items.map((item) => item.product))
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
