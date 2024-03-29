import { AppFeature, AppPlugin } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideIndexedDbEntities } from '@spryker-oryx/indexed-db';
import {
  SyncActionRegistryDefaultService,
  SyncActionRegistryService,
  SyncEntity,
  SyncExecutorDefaultService,
  SyncExecutorService,
  SyncSchedulerDefaultService,
  SyncSchedulerService,
} from '@spryker-oryx/offline/sync';
import { OfflineServiceWorkerPlugin } from './plugin';

export class OfflineServiceWorkerFeature implements AppFeature {
  providers: Provider[] = this.getProviders();
  plugins: AppPlugin[] = this.getPlugins();

  protected getProviders(): Provider[] {
    return [
      ...provideIndexedDbEntities([SyncEntity]),
      {
        provide: SyncSchedulerService,
        useClass: SyncSchedulerDefaultService,
      },
      {
        provide: SyncExecutorService,
        useClass: SyncExecutorDefaultService,
      },
      {
        provide: SyncActionRegistryService,
        useClass: SyncActionRegistryDefaultService,
      },
    ];
  }

  protected getPlugins(): AppPlugin[] {
    return [new OfflineServiceWorkerPlugin()];
  }
}
