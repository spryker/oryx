import { OfflineDataPlugin } from '@spryker-oryx/picking/offline';
import { Observable, of } from 'rxjs';

export class MockOfflineDataPlugin extends OfflineDataPlugin {
  apply(): void | Promise<void> {
    //mock
  }

  refreshData(): Observable<void> {
    return of(undefined);
  }
}
