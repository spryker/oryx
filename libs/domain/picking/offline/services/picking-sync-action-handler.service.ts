import { inject } from '@spryker-oryx/di';
import { IndexedDbService } from '@spryker-oryx/indexed-db';
import { Sync, SyncActionHandler } from '@spryker-oryx/offline';
import {
  BehaviorSubject,
  Observable,
  combineLatestWith,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { PickingListEntity, PickingProductEntity } from '../entities';
import { PickingListOnlineAdapter } from './adapter';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface OryxSyncActions {
    [PickingSyncAction.FinishPicking]: PickingListEntity;
    [PickingSyncAction.Push]: PushSyncPayload;
  }
}

export enum PickingSyncAction {
  FinishPicking = 'oryx.picking:finish-picking',
  Push = 'oryx.picking:push',
}

export interface PushSyncPayload {
  action: 'create' | 'update';
  entity: string;
  ids: string[];
}

export class PickingSyncActionHandlerService
  implements SyncActionHandler<PickingSyncAction>
{
  constructor(
    protected indexedDbService = inject(IndexedDbService),
    protected onlineAdapter = inject(PickingListOnlineAdapter)
  ) {}

  protected syncing$ = new BehaviorSubject(false);

  handleSync(sync: Sync<PickingSyncAction>): Observable<void> {
    switch (sync.action) {
      case PickingSyncAction.FinishPicking:
        return this.handleFinishPicking(
          sync as Sync<PickingSyncAction.FinishPicking>
        );
      case PickingSyncAction.Push:
        return this.handlePush(sync as Sync<PickingSyncAction.Push>);
      default:
        return throwError(
          () =>
            new Error(
              `PickingSyncActionHandlerService: Unable to handle unknown sync action '${sync.action}'!`
            )
        );
    }
  }

  isSyncing(): Observable<boolean> {
    return this.syncing$;
  }

  protected handleFinishPicking(
    sync: Sync<PickingSyncAction.FinishPicking>
  ): Observable<void> {
    return this.onlineAdapter.finishPicking(sync.payload).pipe(
      combineLatestWith(this.indexedDbService.getStore(PickingListEntity)),
      switchMap(async ([updatedPickingList, store]) => {
        const updatedObjects = await store.update(
          sync.payload.id,
          updatedPickingList
        );

        if (updatedObjects === 0) {
          throw new Error(
            `PickingSyncActionHandlerService: Could not update PickingList(${sync.payload.id}) after finishing picking!`
          );
        }
      })
    );
  }

  protected handlePush(sync: Sync<PickingSyncAction.Push>): Observable<void> {
    if (sync.payload.entity !== 'picking-lists') {
      return throwError(
        () =>
          new Error(
            `PickingSyncActionHandlerService: Unknown ${sync.payload.entity} entity`
          )
      );
    }

    this.syncing$.next(true);
    return this.onlineAdapter.get({ ids: sync.payload.ids }).pipe(
      combineLatestWith(
        this.indexedDbService.getStore(PickingListEntity),
        this.indexedDbService.getStore(PickingProductEntity)
      ),
      switchMap(async ([pickingLists, pickingListsStore, productsStore]) => {
        const pickingListsIdsToRemove = sync.payload.ids.filter((id) => {
          return !pickingLists.find((pl) => pl.id === id);
        });

        await pickingListsStore.bulkDelete(pickingListsIdsToRemove);

        const productIds = new Set<string>();
        const products = pickingLists
          .map((pickingList) => pickingList.items.map((item) => item.product))
          .flat()
          .filter((product) => {
            if (productIds.has(product.id)) return false;
            productIds.add(product.id);
            return true;
          });

        await productsStore.bulkPut(products);
        await pickingListsStore.bulkPut(pickingLists, {
          allKeys: true,
        });
      }),
      tap({
        next: () => this.syncing$.next(false),
        error: () => this.syncing$.next(false),
      })
    );
  }
}
