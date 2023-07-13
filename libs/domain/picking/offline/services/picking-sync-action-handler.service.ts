import { inject } from '@spryker-oryx/di';
import { IndexedDbService } from '@spryker-oryx/indexed-db';
import { Sync, SyncActionHandler } from '@spryker-oryx/offline';
import {
  combineLatestWith,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { PickingListEntity } from '../entities';
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

    return this.onlineAdapter.get({ ids: sync.payload.ids }).pipe(
      tap(() => console.log('handlePush')),
      combineLatestWith(this.indexedDbService.getStore(PickingListEntity)),
      switchMap(async ([pickingLists, store]) => {
        const pickingListsIdsToRemove = sync.payload.ids.filter((id) => {
          return !pickingLists.find((pl) => pl.id === id);
        });

        await store.bulkDelete(pickingListsIdsToRemove);
        await store.bulkPut(pickingLists, {
          allKeys: true,
        });
      })
    );
  }
}
