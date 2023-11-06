/// <reference lib="WebWorker" />

import { App, AppPlugin, InjectionPlugin } from '@spryker-oryx/core';
import { firstValueFrom } from 'rxjs';
import { ProcessSyncsBackgroundSyncTag, SyncExecutorService } from './services';

declare let self: ServiceWorkerGlobalScope;

export class OfflineServiceWorkerPlugin implements AppPlugin {
  getName(): string {
    return 'oryx.offlineSw';
  }

  apply(app: App): void | Promise<void> {
    self.addEventListener('sync', (event) => {
      if (event.tag !== ProcessSyncsBackgroundSyncTag) {
        return;
      }

      event.waitUntil(this.processSyncs(app));
    });
  }

  protected async processSyncs(app: App): Promise<void> {
    try {
      const syncExecutorService = app
        .requirePlugin(InjectionPlugin)
        .getInjector()
        .inject(SyncExecutorService);

      const processedSyncs = await firstValueFrom(
        syncExecutorService.processPendingSyncs()
      );

      console.debug(
        `OfflineServiceWorkerPlugin: Processed ${processedSyncs} pending syncs!`
      );
    } catch (e) {
      console.error(
        `OfflineServiceWorkerPlugin: Failed to process pending syncs due to: ${String(
          e
        )}
${(e && (e as any).stack) || ''}`,
        e
      );

      throw e;
    }
  }
}
