import { inject } from '@spryker-oryx/di';
import { IndexedDbService } from '@spryker-oryx/indexed-db';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { SyncEntity } from '../entities';
import { Sync, SyncStatus } from '../models';
import { SyncActionRegistryService } from './sync-action-registry.service';
import { SyncExecutorService } from './sync-executor.service';
import { SyncSchedulerService } from './sync-scheduler.service';

export interface SyncExecutorConfig {
  maxRetries?: number;
}

export const SyncExecutorConfig = 'oryx.SyncExecutorConfig';

declare global {
  export interface InjectionTokensContractMap {
    [SyncExecutorConfig]: SyncExecutorConfig;
  }
}

export class SyncExecutorDefaultService implements SyncExecutorService {
  protected maxRetries = this.config?.maxRetries ?? 3;
  protected syncStore$ = this.indexedDbService
    .getStore(SyncEntity)
    .pipe(shareReplay({ refCount: true, bufferSize: 1 }));

  constructor(
    protected config = inject(SyncExecutorConfig, null),
    protected indexedDbService = inject(IndexedDbService),
    protected syncSchedulerService = inject(SyncSchedulerService),
    protected syncActionRegistryService = inject(SyncActionRegistryService)
  ) {}

  processPendingSyncs(): Observable<number> {
    return this.syncSchedulerService.getPending().pipe(
      take(1),
      switchMap((pendingSyncs) => {
        if (pendingSyncs.length === 0) return of([]);

        return forkJoin(
          pendingSyncs.map((pendingSync) => this.handleSync(pendingSync))
        );
      }),
      map((syncs) => syncs.length)
    );
  }

  protected handleSync(sync: Sync): Observable<Sync> {
    return this.syncActionRegistryService.handleSync(sync).pipe(
      take(1),
      switchMap(() => this.syncStore$.pipe(take(1))),
      switchMap(async (store) => {
        const updatedObjects = await store.update(sync.id, {
          status: SyncStatus.Completed,
          completedAt: new Date(),
          retries: sync.errors.length > 0 ? sync.retries + 1 : sync.retries,
        } as SyncEntity);

        if (updatedObjects === 0) {
          throw new Error(
            `SyncExecutorDefaultService: Could not complete Sync(${sync.id})!`
          );
        }

        return sync;
      }),
      catchError((error) =>
        this.syncStore$.pipe(
          take(1),
          switchMap(async (store) => {
            const isFailed = sync.retries >= this.maxRetries;

            const updatedObjects = await store.update(sync.id, {
              status: isFailed ? SyncStatus.Failed : SyncStatus.Queued,
              triedAt: new Date(),
              retries: sync.errors.length,
              errors: [...sync.errors, String(error)],
            } as SyncEntity);

            if (updatedObjects === 0) {
              throw new Error(
                `SyncExecutorDefaultService: Could not update failed Sync(${sync.id})!`
              );
            }
          }),
          // Rethrow error down the stream
          switchMap(() => throwError(() => error))
        )
      )
    );
  }
}
