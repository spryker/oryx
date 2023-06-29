import { SyncSchedulerService } from '@spryker-oryx/offline';
import { Observable, of } from 'rxjs';

export class MockSyncSchedulerService implements Partial<SyncSchedulerService> {
  hasPending(): Observable<boolean> {
    return of(true);
  }
}
