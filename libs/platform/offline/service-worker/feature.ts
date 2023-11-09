import {
  SyncEntity,
  SyncActionRegistryDefaultService,
  SyncActionRegistryService,
  SyncExecutorDefaultService,
  SyncExecutorService,
  SyncSchedulerDefaultService,
  SyncSchedulerService,
} from '@spryker-oryx/offline/sync';
import { AppFeature, AppPlugin } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideIndexedDbEntities } from '@spryker-oryx/indexed-db';
import { OfflineServiceWorkerPlugin } from './plugin';

export class OfflineServiceWorkerFeature
  implements AppFeature
{
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
