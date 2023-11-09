import { AppFeature } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { provideIndexedDbEntities } from '@spryker-oryx/indexed-db';
import { 
  SyncEntity,
  SyncSchedulerDefaultService,
  SyncSchedulerService,
} from '@spryker-oryx/offline/sync';

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
