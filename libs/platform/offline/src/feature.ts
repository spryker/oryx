import { AppFeature, AppPlugin } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideIndexedDbEntities } from '@spryker-oryx/indexed-db';
import { SyncEntity } from './entities';
import {
  SyncActionRegistryDefaultService,
  SyncActionRegistryService,
  SyncExecutorDefaultService,
  SyncExecutorService,
  SyncSchedulerDefaultService,
  SyncSchedulerService,
} from './services';
import { OfflineServiceWorkerPlugin } from './sw-plugin';

export class OfflineFeature implements AppFeature {
  providers: Provider[] = this.getProviders();

  protected getProviders(): Provider[] {
    return [
      ...provideIndexedDbEntities([SyncEntity]),
      {
        provide: SyncSchedulerService,
        useClass: SyncSchedulerDefaultService,
      },
    ];
  }
}

export class OfflineServiceWorkerFeature
  extends OfflineFeature
  implements AppFeature
{
  plugins: AppPlugin[] = this.getPlugins();

  protected override getProviders(): Provider[] {
    return [
      ...super.getProviders(),
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
