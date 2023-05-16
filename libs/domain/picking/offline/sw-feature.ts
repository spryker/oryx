import { AppFeature } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { SyncSchedulerService } from '@spryker-oryx/offline';
import { firstValueFrom } from 'rxjs';
import { PickingSyncAction } from './services';

interface PushPayload {
  action: 'create' | 'update';
  entity: 'picking-list';
  ids: string[];
}

declare let self: ServiceWorkerGlobalScope;

export class SwOfflinePickingFeature implements AppFeature {
  constructor(private syncSchedulerService = inject(SyncSchedulerService)) {
    this.init();
  }

  private init(): void {
    self.addEventListener('push', (event: PushEvent) => {
      const payload: PushPayload = event.data?.json();

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
