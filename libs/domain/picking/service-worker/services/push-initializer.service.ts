import { OauthService } from '@spryker-oryx/auth';
import { AppInitializer } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { SyncSchedulerService } from '@spryker-oryx/offline/sync';
import { firstValueFrom, Observable } from 'rxjs';
import {
  PickingSyncAction,
  PushSyncPayload,
} from '@spryker-oryx/picking/offline';

declare let self: ServiceWorkerGlobalScope;

export class PushInitializerService implements AppInitializer {
  constructor(
    private syncSchedulerService = inject(SyncSchedulerService),
    private authService = inject(OauthService)
  ) {}

  initialize(): void | Observable<void> | Promise<void> {
    //make subscription on auth token
    this.authService.invokeStoredToken();

    self.addEventListener('push', (event: PushEvent) => {
      if (!event.data) {
        throw new Error('SwPushInitializerService: No data in push event');
      }

      const payload: PushSyncPayload = event.data.json();

      console.log('Push', this.syncSchedulerService);

      event.waitUntil(
        firstValueFrom(
          this.syncSchedulerService.schedule({
            action: PickingSyncAction.Push,
            payload,
          })
        )
      );
    });
  }
}
