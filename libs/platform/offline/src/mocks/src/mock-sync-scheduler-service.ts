import { Observable, of } from 'rxjs';
import { SyncSchedulerService } from '../../../sync';

export class MockSyncSchedulerService implements Partial<SyncSchedulerService> {
  hasPending(): Observable<boolean> {
    return of(true);
  }
}
