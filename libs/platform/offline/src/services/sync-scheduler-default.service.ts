import { inject } from '@spryker-oryx/di';
import { IndexedDbService } from '@spryker-oryx/indexed-db';
import { liveQuery } from 'dexie';
import {
  filter,
  firstValueFrom,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { SyncEntity } from '../entities';
import { Sync, SyncAction, SyncOperation, SyncStatus } from '../models';
import { SyncSchedulerService } from './sync-scheduler.service';

export const ProcessSyncsBackgroundSyncTag = 'oryx.ProcessSyncs';

declare let self: ServiceWorkerGlobalScope;

export class SyncSchedulerDefaultService implements SyncSchedulerService {
  protected scheduleSyncTimer?: ReturnType<typeof setTimeout>;

  constructor(
    protected indexedDbService = inject(IndexedDbService),
  ) {}

  protected async getServiceWorker(): Promise<ServiceWorkerRegistration> {
    return navigator.serviceWorker
      ? await navigator.serviceWorker.ready
      : self.registration;
  }

  schedule<TAction extends SyncAction>(
    operation: SyncOperation<TAction>
  ): Observable<Sync<TAction>> {
    return this.indexedDbService.getStore(SyncEntity).pipe(
      switchMap(async (store) => {
        const sync = await this.createSync<TAction>({
          ...operation,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          id: undefined!,
          prevSyncIds: operation.prevSyncIds ?? [],
          status: SyncStatus.Queued,
          scheduledAt: new Date(),
          retries: 0,
          errors: [],
        });

        return (await store.add(sync)) as number;
      }),
      switchMap((id) => this.findSync(id) as Observable<Sync<TAction>>),
      tap(() => this.scheduleSync())
    );
  }

  findSync(syncId: number): Observable<Sync> {
    return this.indexedDbService.getStore(SyncEntity).pipe(
      switchMap((store) =>
        liveQuery(async () => {
          const sync = await store.get(syncId);

          if (!sync) {
            return throwError(
              () =>
                new Error(
                  `SyncSchedulerDefaultService: Cannot find Sync(${syncId})!`
                )
            );
          }

          return await this.createSync(sync);
        })
      )
    ) as Observable<Sync>;
  }

  getPending(): Observable<Sync[]> {
    return this.indexedDbService.getStore(SyncEntity).pipe(
      switchMap((store) =>
        liveQuery(async () => {
          const syncs = await store
            .where('status')
            .anyOf(SyncStatus.Queued, SyncStatus.Processing)
            .toArray();

          return await Promise.all(syncs.map((sync) => this.createSync(sync)));
        })
      )
    );
  }

  hasPending(): Observable<boolean> {
    return this.indexedDbService.getStore(SyncEntity).pipe(
      switchMap((store) =>
        liveQuery(async () => {
          const count = await store
            .where('status')
            .anyOf(SyncStatus.Queued, SyncStatus.Processing)
            .count();

          return count > 0;
        })
      )
    );
  }

  getFailed(): Observable<Sync[]> {
    return this.indexedDbService.getStore(SyncEntity).pipe(
      switchMap((store) =>
        liveQuery(async () => {
          const syncs = await store
            .where('[status+scheduledAt]')
            .anyOf(SyncStatus.Failed)
            .reverse()
            .sortBy('scheduledAt');

          return syncs.map((sync) => new SyncEntity(sync));
        })
      )
    );
  }

  hasFailed(): Observable<boolean> {
    return this.indexedDbService.getStore(SyncEntity).pipe(
      switchMap((store) =>
        liveQuery(async () => {
          const count = await store
            .where('status')
            .anyOf(SyncStatus.Failed)
            .count();

          return count > 0;
        })
      )
    );
  }

  protected async createSync<TAction extends SyncAction>(
    data: Omit<Sync<TAction>, 'whenCompleted' | 'cancel'>
  ): Promise<SyncEntity<TAction>> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    return new SyncEntity<TAction>({
      ...data,

      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      async whenCompleted() {
        const updatedSync = (await firstValueFrom(
          that.indexedDbService.getStore(SyncEntity).pipe(
            switchMap((store) => liveQuery(() => store.get(this.id))),
            filter((sync) => sync?.status === SyncStatus.Completed)
          )
        )) as SyncEntity<TAction>;

        Object.assign(this, updatedSync);
      },

      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      async cancel() {
        const store = await firstValueFrom(
          that.indexedDbService.getStore(SyncEntity)
        );

        const updateObjects = await store.update(this.id, {
          status: SyncStatus.Cancelled,
        });

        if (updateObjects === 0) {
          throw new Error(
            `SyncEntity: Cannot cancel non-existing SyncEntity(${this.id})!`
          );
        }

        this.status = SyncStatus.Cancelled;
      },
    });
  }

  protected scheduleSync(): void {
    if (this.scheduleSyncTimer !== undefined) {
      return;
    }

    this.scheduleSyncTimer = setTimeout(async () => {
      const sync = (await this.getServiceWorker()).sync;

      if (!sync) {
        throw new Error(
          `SyncSchedulerDefaultService: Unable to register background sync!
          The app must be installed first as a PWA!`
        );
      }

      await sync.register(ProcessSyncsBackgroundSyncTag);

      this.scheduleSyncTimer = undefined;
    });
  }
}
