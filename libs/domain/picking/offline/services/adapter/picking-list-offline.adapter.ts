import { inject } from '@spryker-oryx/di';
import { IndexedDbService } from '@spryker-oryx/indexed-db';
import { SyncSchedulerService } from '@spryker-oryx/offline';
import {
  PickingListAdapter,
  PickingListQualifier,
  PickingListStatus,
} from '@spryker-oryx/picking';
import { intersectArrays } from '@spryker-oryx/utilities';
import { Collection, liveQuery, Table } from 'dexie';
import { combineLatestWith, map, Observable, switchMap } from 'rxjs';
import {
  PickingListEntity,
  PickingListOffline,
  PickingListSerialized,
  PickingProductEntity,
} from '../../entities';
import { PickingSyncAction } from '../picking-sync-action-handler.service';
import { PickingListOnlineAdapter } from './picking-list-online.adapter';

export class PickingListOfflineAdapter implements PickingListAdapter {
  constructor(
    protected indexedDbService = inject(IndexedDbService),
    protected syncSchedulerService = inject(SyncSchedulerService),
    protected onlineAdapter = inject(PickingListOnlineAdapter)
  ) {}

  get(qualifier: PickingListQualifier): Observable<PickingListEntity[]> {
    return this.indexedDbService.getDb().pipe(
      combineLatestWith(
        this.indexedDbService.getStore(PickingListEntity),
        this.indexedDbService.getStore(PickingProductEntity)
      ),
      switchMap(([db, pickingListStore, productStore]) => {
        return liveQuery(() =>
          db.transaction(
            'readonly',
            [pickingListStore, productStore],
            async () => {
              if (qualifier.id) {
                const data = await pickingListStore.get(qualifier.id);

                if (!data) {
                  return [];
                }

                return this.deserializePickingLists([data], productStore);
              }

              const andCollections: Collection<PickingListSerialized>[] = [];

              if (qualifier.status) {
                andCollections.push(
                  pickingListStore.where('localStatus').equals(qualifier.status)
                );
              }

              if (qualifier.orderItemUUIDs) {
                andCollections.push(
                  pickingListStore
                    .where('orderItemUUIDs')
                    .startsWithAnyOf(qualifier.orderItemUUIDs)
                    .distinct()
                );
              }

              if (andCollections.length === 0) {
                andCollections.push(pickingListStore.toCollection());
              }

              const andGroups = await Promise.all(
                andCollections.map((collection) => {
                  if (qualifier.offset) {
                    collection = collection.offset(qualifier.offset);
                  }

                  if (qualifier.limit) {
                    collection = collection.limit(qualifier.limit);
                  }

                  if (qualifier.sortDesc) {
                    collection = collection.reverse();
                  }

                  if (qualifier.sortBy) {
                    return collection.sortBy(qualifier.sortBy);
                  }

                  return collection.toArray();
                })
              );

              let data = intersectArrays((item) => item.id, ...andGroups);

              // Drop any excess data after merging groups
              if (qualifier.limit) {
                data = data.slice(0, qualifier.limit);
              }

              return await this.deserializePickingLists(data, productStore);
            }
          )
        );
      })
    );
  }

  startPicking(pickingList: PickingListEntity): Observable<PickingListEntity> {
    return this.indexedDbService.getDb().pipe(
      combineLatestWith(
        this.indexedDbService.getStore(PickingListEntity),
        this.indexedDbService.getStore(PickingProductEntity),
        this.onlineAdapter.startPicking(pickingList)
      ),
      switchMap(([db, pickingListStore, productStore, updatedPickingList]) =>
        db.transaction(
          'readwrite',
          [pickingListStore, productStore],
          async () => {
            const updatedObjects = await pickingListStore.update(
              pickingList.id,
              {
                ...updatedPickingList,
                localStatus: updatedPickingList.status,
              }
            );

            const pickingListData = await pickingListStore.get(pickingList.id);

            if (updatedObjects === 0 || !pickingListData) {
              throw new PickingListNotFoundError(
                pickingList.id,
                'Cannot start picking'
              );
            }

            return this.deserializePickingList(pickingListData, productStore);
          }
        )
      )
    );
  }

  updatePickingItems(
    pickingList: PickingListEntity
  ): Observable<PickingListEntity> {
    return this.indexedDbService.getDb().pipe(
      combineLatestWith(
        this.indexedDbService.getStore(PickingListEntity),
        this.indexedDbService.getStore(PickingProductEntity)
      ),
      switchMap(([db, pickingListStore, productStore]) =>
        db.transaction(
          'readwrite',
          [pickingListStore, productStore],
          async () => {
            const updatedObjects = await pickingListStore.update(
              pickingList.id,
              {
                items: pickingList.items,
              }
            );

            const pickingListData = await pickingListStore.get(pickingList.id);

            if (updatedObjects === 0 || !pickingListData) {
              throw new PickingListNotFoundError(
                pickingList.id,
                'Cannot update picking'
              );
            }

            return this.deserializePickingList(pickingListData, productStore);
          }
        )
      )
    );
  }

  finishPicking(pickingList: PickingListEntity): Observable<PickingListEntity> {
    return this.indexedDbService.getDb().pipe(
      combineLatestWith(
        this.indexedDbService.getStore(PickingListEntity),
        this.indexedDbService.getStore(PickingProductEntity)
      ),
      switchMap(([db, pickingListStore, productStore]) =>
        db.transaction(
          'readwrite',
          [pickingListStore, productStore],
          async () => {
            const updatedObjects = await pickingListStore.update(
              pickingList.id,
              {
                localStatus: PickingListStatus.PickingFinished,
              }
            );

            const pickingListData = await pickingListStore.get(pickingList.id);

            if (updatedObjects === 0 || !pickingListData) {
              throw new PickingListNotFoundError(
                pickingList.id,
                'Cannot finish picking'
              );
            }

            return this.deserializePickingList(pickingListData, productStore);
          }
        )
      ),
      switchMap((pickingList) =>
        this.syncSchedulerService
          .schedule({
            action: PickingSyncAction.FinishPicking,
            payload: pickingList,
          })
          .pipe(map(() => pickingList))
      )
    );
  }

  protected async deserializePickingList(
    pickingList: PickingListSerialized,
    productStore: Table<PickingProductEntity>
  ): Promise<PickingListEntity> {
    const lists = await this.deserializePickingLists(
      [pickingList],
      productStore
    );

    return lists[0];
  }

  protected async deserializePickingLists(
    pickingLists: PickingListSerialized[],
    productStore: Table<PickingProductEntity>
  ): Promise<PickingListEntity[]> {
    const productIds = pickingLists
      .map((pickingList) => pickingList.items.map((item) => item.productId))
      .flat();

    const productsData = await productStore.bulkGet(productIds);

    const productMap = Object.fromEntries(
      productIds.map((productId) => {
        const productData = productsData.find((d) => d?.id === productId);

        if (!productData) {
          throw new Error(
            `PickingListOfflineAdapter: Foreing key` +
              ` ${PickingProductEntity.name}(${productId})` +
              ` cannot be found when resolving ${PickingListEntity.name}!`
          );
        }

        return [productData.id, new PickingProductEntity(productData)];
      })
    );

    const fullData: PickingListOffline[] = pickingLists.map((pickingList) => ({
      ...pickingList,
      items: pickingList.items.map((item) => ({
        ...item,
        product: productMap[item.productId],
      })),
    }));

    return fullData.map((data) => new PickingListEntity(data));
  }
}

export class PickingListNotFoundError extends Error {
  constructor(pickingListId: string, errorDesc?: string) {
    super(
      `${
        errorDesc ? `${errorDesc} because ` : ''
      }PickingList(${pickingListId}) was not found!`
    );
  }
}
