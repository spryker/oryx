import { OauthService } from '@spryker-oryx/auth';
import { AppInitializer } from '@spryker-oryx/core';
import { inject, resolve } from '@spryker-oryx/di';
import { SyncSchedulerService } from '@spryker-oryx/offline';
import {
  PickingSyncAction,
  PushSyncPayload,
} from '@spryker-oryx/picking/offline';
import { firstValueFrom, Observable } from 'rxjs';

declare let self: ServiceWorkerGlobalScope;

export class SwPushInitializerService implements AppInitializer {
  constructor(private syncSchedulerService = inject(SyncSchedulerService)) {}

  initialize(): void | Observable<void> | Promise<void> {
    //make subscription on auth token
    resolve(OauthService).invokeStoredToken();

    self.addEventListener('push', (event: PushEvent) => {
      const payload: PushSyncPayload = event.data?.json();

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
