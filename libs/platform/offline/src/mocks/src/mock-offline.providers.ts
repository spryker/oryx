import { Provider } from '@spryker-oryx/di';
import { SyncSchedulerService } from '@spryker-oryx/offline/sync';
import { MockSyncSchedulerService } from './mock-sync-scheduler-service';

export const mockOfflineProviders: Provider[] = [
  {
    provide: SyncSchedulerService,
    useClass: MockSyncSchedulerService,
  },
];
